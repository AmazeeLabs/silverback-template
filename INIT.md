Run this file with `pnpx @amazeelabs/mzx run INIT.md` from the project root.

What it does:

Adjust project name in the repo.

```ts
await prompt('PROJECT_NAME_HUMAN', {
  type: 'text',
  message: 'Project name for humans:',
  validate: (name) => (!/^.+$/.test(name) ? 'Must be not empty.' : true),
  initial: 'My Project',
});
if (!process.env.PROJECT_NAME_HUMAN) {
  // Because ctrl+c on prompt does not stop the script.
  throw new Error('Cancelled');
}
replace(
  'README.md',
  '# Silverback Template',
  '# ' + process.env.PROJECT_NAME_HUMAN,
);
replace(
  'apps/cms/config/sync/system.site.yml',
  'Silverback Drupal Template',
  process.env.PROJECT_NAME_HUMAN,
);
replace(
  'apps/cms/config/sync/slack.settings.yml',
  'Silverback Template Bot',
  process.env.PROJECT_NAME_HUMAN + ' Bot',
);
```

Adjust project machine name in the repo.

```ts
await prompt('PROJECT_NAME_MACHINE', {
  type: 'text',
  message: 'Project name for machines:',
  validate: (name) =>
    !/^[a-z][a-z\d_]*$/.test(name)
      ? 'Must start with a lowercase letter and contain lowercase letters, numbers and underscores only.'
      : true,
  initial: 'my_project',
});
replace(
  [
    '.lagoon.yml',
    'README.md',
    'apps/cms/config/sync/system.site.yml',
    'apps/cms/config/sync/slack.settings.yml',
    'apps/cms/scaffold/settings.php.append.txt',
  ],
  'silverback-template',
  process.env.PROJECT_NAME_MACHINE,
);
replace(
  'package.json',
  '@amazeelabs/silverback-template',
  process.env.PROJECT_NAME_MACHINE,
);
```

Update the auth key for Gatsby user.

```ts
const authKey = randomString(32);
replace(
  'apps/website/gatsby-config.js',
  "auth_key: 'cfdb0555111c0f8924cecab028b53474'",
  `auth_key: '${authKey}'`,
);
replace(
  'packages/drupal/test_content/content/user/f20d961b-ba45-4820-b2cc-166e5ce56815.yml',
  'value: cfdb0555111c0f8924cecab028b53474',
  `value: ${authKey}`,
);
replace(
  'tests/schema/specs/lib.ts',
  "'api-key': 'cfdb0555111c0f8924cecab028b53474'",
  `'api-key': '${authKey}'`,
);
```

Update the default hash salt.

```ts
replace(
  'apps/cms/scaffold/settings.php.append.txt',
  'banana123',
  randomString(32),
);
```

Cleanup the readme.

```ts
replace(
  'README.md',
  /## Create a new project from this template.+?## /gs,
  '## ',
);
```

Remove the init script.

```ts
fs.unlinkSync('INIT.md');
```

<hr />
Here go some helpers.

```ts
function replace(path, from, to) {
  const paths = Array.isArray(path) ? path : [path];
  for (const path of paths) {
    if (!fs.existsSync(path)) {
      throw new Error(`File ${path} does not exist.`);
    }
    const contents = fs.readFileSync(path, 'utf8');
    if (!contents.match(from)) {
      throw new Error(`File ${path} does not contain ${from}.`);
    }
    fs.writeFileSync(path, contents.replaceAll(from, to), 'utf8');
  }
}

function randomString(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
```
