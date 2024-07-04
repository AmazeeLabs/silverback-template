import fs from 'node:fs';
import { query } from '../query.js';
import { CampaignUrlRedirectsQuery, Locale } from '@custom/schema';
import { drupalUrl } from '../utils.js';

export type Redirect = {
  source: string,
  destination: string,
  statusCode: number,
  force?: boolean,
};

type RedirectsOutputConfig = {
  outputFile?: string,
}

type RedirectsOutputService = 'netlify';

const redirectsPool: Map<string, Redirect> = new Map();

function createRedirect(redirect: Redirect) {
  redirectsPool.set(redirect.source, redirect);
}

async function createRedirects() {
  createRedirect({
    source: '/sites/default/files/*',
    destination: `${drupalUrl}/sites/default/files/:splat`,
    statusCode: 200,
  });

  // Proxy Drupal GraphQL queries.
  createRedirect({
    source: '/graphql',
    destination: `${drupalUrl}/graphql`,
    statusCode: 200,
  });

  // Proxy Drupal webforms.
  Object.values(Locale).forEach((locale) => {
    createRedirect({
      source: `/${locale}/form/*`,
      destination: `${drupalUrl}/${locale}/form/:splat`,
      statusCode: 200,
    });
  });

  // Additionally proxy themes and modules as they can have additional
  // non-aggregated assets.
  ['themes', 'modules', 'core/assets'].forEach((path) => {
    createRedirect({
      source: `/${path}/*`,
      destination: `${drupalUrl}/${path}/:splat`,
      statusCode: 200,
    });
  });

  // Create redirects for all the CampaignUrl entries from the CMS.
  let currentPage = 1;
  const pageSize = 100;
  while (true) {
    const redirects = await query(CampaignUrlRedirectsQuery, { args: `pageSize=${pageSize}&page=${currentPage}` });
    if (!redirects.campaignUrlRedirects?.rows?.length) {
      break;
    }
    redirects.campaignUrlRedirects?.rows?.forEach(redirect => redirect && createRedirect(redirect));
    currentPage++;
  }

  // Any unhandled requests are handed to strangler, which will try to pass
  // them to all registered legacy systems and return 404 if none of them
  // respond.
  createRedirect({
    source: '/*',
    destination: `/.netlify/functions/strangler`,
    statusCode: 200,
  });
}

function writeRedirects(service: RedirectsOutputService, config: RedirectsOutputConfig) {
  switch (service) {
    case 'netlify':
    default:
      writeRedirectsNetlify(config);
  }
}

function writeRedirectsNetlify(config: RedirectsOutputConfig) {
  if (!config.outputFile) {
    throw new Error("The netlify redirects file is not provided.");
  }

  redirectsPool.forEach((value, key) => {
    let redirectEntry = `[[redirects]]
  from = "${value.source}"
  to = "${value.destination}"
  status = ${value.statusCode}
`;
  if (value.force) {
    redirectEntry += `  force = true
`;
  }

    fs.appendFileSync(`${config.outputFile}`, redirectEntry);
  });
}

await createRedirects();
writeRedirects("netlify", { outputFile: "./dist/public/netlify.toml" });
