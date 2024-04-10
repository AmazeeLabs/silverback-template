# Silverback Template

## Create a new project from this template

Minimum steps

- https://github.com/AmazeeLabs/silverback-template > `Use this template` >
  `Create a new repository`
- In the newly created repo
  - Settings > Manage access > Collaborators and teams
    - add `Tech Team` with `Admin` role
    - remove yourself
  - Settings > General > Pull Requests
    - Disable `Allow merge commits`
    - Enable `Automatically delete head branches`
- Clone the newly create repo
- Run `pnpx @amazeelabs/mzx run INIT.md` from the project root
- Answer its questions
- Review the changes in the repo
- Commit and push

Other steps

- [Create a new Lagoon project](https://amazeelabs.atlassian.net/wiki/spaces/ALU/pages/368115717/Create+a+new+Lagoon+project)
- [Create a new Netlify project](https://amazeelabs.atlassian.net/wiki/spaces/ALU/pages/368017428/Create+a+new+Netlify+project)
- Check the [Environment overrides](#environment-overrides) section below
- Create `dev` and `prod` branches (and optionally `stage`) from `release`

## Branches and environments

<table>
<thead>
  <tr>
    <th rowspan="2">Branch name</th>
    <th rowspan="2">Connected environment</th>
    <th colspan="2">Purpose </th>
  </tr>
  <tr>
    <th>Pre Go Live</th>
    <th>Post Go Live</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><code>release</code></td>
    <td>(none)</td>
    <td colspan="2">Contains everything that is approved for PROD deployment</td>
  </tr>
  <tr>
    <td><code>prod</code></td>
    <td>PROD</td>
    <td colspan="2">The production environment</td>
  </tr>
  <tr>
    <td><code>dev</code></td>
    <td>DEV</td>
    <td>Sandbox/playground, no client data, anyone can merge anything</td>
    <td>Sandbox/playground, with client data, main testing environment</td>
  </tr>
  <tr>
    <td><code>stage</code></td>
    <td>STAGE</td>
    <td>Second sandbox with client data and automated merge from <code>dev</code> to <code>stage</code>, regular data sync</td>
    <td>Second sandbox for bigger features that need a clean set up or would prevent other normal tasks from being performed while working on it. With client data. No automated merges from <code>dev</code>.</td>
  </tr>
  <tr>
    <td><code>lagoon-*</code></td>
    <td>(same as branch name)</td>
    <td colspan="2">Can be created for big, long-term feature developments. Use wisely<br>  as it creates additional costs.</td>
  </tr>
</tbody>
</table>

## Development workflow

- Create a new branch from `release` and commit your work in
- Create a PR against `release`
- Merge your branch to `dev` for testing
- Testing feedback is committed to the branch and merged back to `dev` for
  retesting
- When the PR is approved and Jira ticket gets to the Deploy state, the branch
  is merged to `release`
  - Please note, this does not trigger an actual PROD deployment
- PROD deployment can be done by merging `release` branch into `prod`

## Installation

```
pnpm i
pnpm turbo:prep
```

Additionally, you can run `pnpm turbo:test` to make sure that your system is
fully compatible with the project.

Tip: Run `pnpm turbo:prep:force` after switching branches to avoid issues.

## Working with apps and packages

Navigate to an app/package folder and run `pnpm dev`.

When working on integration tasks, it may be required to re-run
`pnpm turbo:prep` from the repo root.

### Turborepo

<details>
  <summary>How it works in general</summary>

Turborepo allows to cache results for scripts from `package.json` files.

Minimal example:

- The `build` script compiles files from `src` folder and puts the result into
  `dist` folder
- We can setup a Turborepo pipeline
  ```json
  "build": {
    "inputs": ["src/**"],
    "outputs": ["dist/**"]
  }
  ```
- On the first `turbo build` run Turborepo will
  - calculate hashes for files from `src` folder, and save them into cache,
  - save `dist` folder into cache.
- On the second `turbo build` run Turborepo will compare `src` hashes with
  cache. If hashes do match, it will restore `dist` folder from the cache
  without running the `build` script.

More in docs: https://turbo.build/repo/docs/core-concepts/caching

</details>

<details>
  <summary>Turborepo setup: local vs CI</summary>

Locally, Turborepo stores caches under `node_modules/.cache/turbo` folder.

In CI, the caches are saved in Github artifacts.

</details>

<details>
  <summary>Debug Turborepo issues in CI</summary>

It can happen that some script fails in CI because of a misconfigured Turborepo
pipeline. The following can be used in order to debug this locally:

- Setup https://github.com/ducktors/turborepo-remote-cache locally
- Run `turborepo-remote-cache` with `TURBO_TOKEN=local pnpm dev`
- Run tests in the target repo with

  ```shell
  # Clean the repo
  rm -rf node_modules && git clean -dxff -e '/.turbo' -e '_local' -e '/.idea' && find . -type d -empty -delete && \
    # Install dependencies
    pnpm i && \
    # Run tests with
    # - local Turborepo server
    # - Turborepo debug info
    # - simulated CI
    TURBO_API=http://0.0.0.0:3000 TURBO_TOKEN=local TURBO_TEAM=local TURBO_RUN_SUMMARY=true CI=true pnpm turbo:test
  ```

</details>

### Drupal

Running `pnpm turbo:prep` works conditionally for Drupal. If database exists, it
clears Drupal cache. Otherwise, it re-installs Drupal completely.

If you wish Drupal to be re-installed, run `pnpm turbo:prep:force`.

## Environment overrides

The application is tailored to run locally out of the box. In a production or
hosting environment, you will need to override some of the environment
variables.

- **DRUPAL_HASH_SALT** (lagoon): Drupal's hash salt. Should be different per
  environment for security reasons.
- **PUBLISHER_URL** (lagoon): If publisher is set to a custom domain, this
  variable has to be defined.
- **NETLIFY**: To publish the project to netlify, provide the following
  environment variables:
  - **NETLIFY_SITE_ID** (lagoon): The ID of the netlify project the
  - **NETLIFY_AUTH_TOKEN** (lagoon): The auth token for the netlify project.
  - **NETLIFY_URL** (lagoon): The URL of the netlify project.
  - **NETLIFY_STORYBOOK_ID** (github): If this is set, the UI packages storybook
    build will be published to netlify.
- **CLOUDINARY**: To use cloudinary for image processing, provide the following
  environment variables:
  - **CLOUDINARY_CLOUDNAME** (lagoon): The cloud name of the cloudinary project.
  - **CLOUDINARY_API_KEY** (lagoon): The API key of the cloudinary project.
  - **CLOUDINARY_API_SECRET** (lagoon): The API secret of the cloudinary
    project.
- **DRUPAL_INTERNAL_URL** (lagoon): The internal URL of the Drupal instance.
  This is used for the GraphQL build queries.
- **DRUPAL_EXTERNAL_URL** (lagoon): The external URL of the Drupal instance.
  This is used for the GraphQL client queries.

On lagoon for example, this should happen in `.lagoon.env` files, or directly as
lagoon runtime configuration.

```shell
lagoon add variable -p [project name] -e dev -N NETLIFY_SITE_ID -V [netlify site id]
```

### Publisher authentication with Drupal

Publisher can require to authenticate with Drupal based on OAuth2. It is only
used on Lagoon environments.

<details>
  <summary>How it works</summary>
  
  #### Drupal configuration
  
  ##### Create keys
  
  Per environment, keys are gitignored and are auto-generated via a Lagoon post-rollout task.
  
  To generate keys manually
  
  via Drush: cd in the cms directory then
  
  ```bash
  drush simple-oauth:generate-keys ./keys
  ```
  
  or via the UI
  
  - Go to `/admin/config/people/simple_oauth`
  - Click on "Generate keys", the directory should be set to `./sites/default/files/private/keys`
  
  ##### Create the Publisher Consumer
  
  Per environment, Consumers are content entities.
  
  - Go to `/admin/config/services/consumer`
    - Create a Consumer
      - Label: `Publisher`
      - Client ID: `publisher`
      - Secret: a random string
      - Redirect URI: `[publisher-url]/oauth/callback`
    - Optional: the default Consumer can be safely deleted
  
  Troubleshooting:
  - make sure that the `DRUPAL_HASH_SALT` environment variable is >= 32 chars.
  - if enabled on local development, use `127.0.0.1:8888` for the cms and `127.0.0.1:8000` for Publisher
  
  #### Publisher authentication
  
  Edit [website environment variables](./apps/website/.lagoon.env)
  
  ```
  PUBLISHER_SKIP_AUTHENTICATION=false
  PUBLISHER_OAUTH2_CLIENT_SECRET="[secret used in the Drupal Consumer]"
  PUBLISHER_OAUTH2_SESSION_SECRET="[another random string]"
  ```
  
  ##### Set the 'Access Publisher' permission
  
  Optional: add this permission to relevant roles.

</details>

<details>
  <summary>How to disable it</summary>
  
  In website `.lagoon.env` set `PUBLISHER_SKIP_AUTHENTICATION=true`
</details>

## Storybook

If a `CHROMATIC_PROJECT_TOKEN` environment variable is set, the Storybook build
will be published to [Chromatic](https://www.chromatic.com/). Additionally
setting the `NETLIFY_STORYBOOK_ID` environment variable will deploy storybook to
netlify, which provides less features but is easier to access.

### Layout images

These are images that are part of the design and are therefore not uploaded by
the user. They have to be put into the `static/public` directory which is also
shared with the website application (Gatsby). Examples are logos, icons, etc. In
a component they should be rendered with a regular `<img>` tag and the `src`
relative to the `static/public` directory.

```tsx
<img src="/logo.svg" alt="Logo" />
```

### Content images

These are images that are uploaded by the user, or on some other way injected
from the outside. In production, images are handled by Cloudinary. In
development, basic cropping is simulated in the browser. The location to store
these images is the `static/stories` directory, which is used for Storybook
only.

In the GraphQL schema, these images are represented by the `ImageSource` type.
If the component requires ones of these, one should use the `image` helper from
`src/helpers/image`, which produces exactly this type. The image itself can be
imported from the `static/stories` directory using the `@stories/` alias. The
import is handled by
[`vite-imagetools`](https://github.com/JonasKruckenberg/imagetools/tree/main/packages/vite)
and has to end with `as=metadata`. It is also possible to apply transformations.

```tsx
import Teaser from './Teaser';
import TeaserImage from '@stories/teaser.jpg?as=metadata';

export const WithImage = {
  args: {
    title: 'Lorem ipsum dolor sit amet',
    image: image(TeaserImage),
  },
} satisfied StoryObj<typeof Teaser>
```

In this case, the image will retain its intrinsinc dimensions. To simulate
scaling, pass a `width` property.

```tsx
import Teaser from './Teaser';
import TeaserImage from '@stories/teaser.jpg?as=metadata';

export const WithImage = {
  args: {
    title: 'Lorem ipsum dolor sit amet',
    image: image(TeaserImage, { width: 400 }),
  },
} satisfied StoryObj<typeof Teaser>
```

The image will retain its aspect ratio. To actually crop the image, also add a
`height`.

```tsx
import Teaser from './Teaser';
import TeaserImage from '@stories/teaser.jpg?as=metadata';

export const WithImage = {
  args: {
    title: 'Lorem ipsum dolor sit amet',
    image: image(TeaserImage, { width: 400, height: 300 }),
  },
} satisfied StoryObj<typeof Teaser>
```

### Responsive images

In GraphQL fragments, it is possible to request responsive image sources.

```gql
fragment Teaser on Page {
  title
  image(width: 400, height: 300, sizes: [[1200, 800]])
}
```

The output of `image` is also of type `ImageSource`. To simulate this in
Storybook, add the same `sizes` property to the `image` helper.

```tsx
export const WithImage = {
  args: {
    title: 'Lorem ipsum dolor sit amet',
    image: image(TeaserImage, { width: 400, height: 300, sizes: [[1200, 800]]}),
  },
} satisfied StoryObj<typeof Teaser>
```

> **IMPORTANT:** If embedded this way, these images will not be visible in
> Storybook immediately. Instead, a placeholder that indicates the loaded images
> dimensions will be shown.

An approximation of the image that would be delivered by Cloudinary is embedded
when:

- On "demo" storybook builds deployed to netlify
- In Gatsby when built on Lagoon.

These Cloudinary approximations are not real images and will fail integration
tests. Therefore they are not used in regular development and testing scenarios.

## "Strangling" legacy systems

The template includes a Netlify Edge Function
(`apps/website/netlify/edge-functions/strangler.ts`) that allows to proxy
unknown requests selectively to other systems. This can be used to replace only
specific pages of a legacy system or incorporate existing business logic.

Refer to the
[Strangler Pattern](https://www.martinfowler.com/bliki/StranglerFigApplication.html)
blog post if you wonder where the name comes from, to
[Edge functions documentation](https://docs.netlify.com/edge-functions/overview/)
for technical details and to `strangler.ts` for how to add new legacy systems.
