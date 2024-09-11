<h1 align="center">Seedlingo Apiary</h1>
<h3 align="center">Content editor for Seedlingo</h3>
<p align="center">
  <img src="../docs/.vuepress/public/images/seedlingo-logo-blue.svg"
    alt="seedlingo-logo" height="160px" width="160px"/>
  <br/>
  <b>Modern mobile multi-language literacy</b>
  <br/>
  <i>A first-language digital learning tool for adults</i>
</p>
<hr>

# Seedlingo Apiary

Seedlingo Apiary is a content editor for the language learning tool [Seedlingo](../README.md).


## Setup

Make sure to install the dependencies:

```sh
npm install
```

## Development server

Start the development server on `http://localhost:3000`:

```sh
npm run dev
```

## Production

Build the application for production:

```sh
npm run build
```

Locally preview production build:

```sh
npm run preview
```

## AWS Amplify setup

1. Sign up for a user at
   [AWS](https://signin.aws.amazon.com/signup?request_type=register).
2. Navigate to [Amplify](https://console.aws.amazon.com/amplify).
3. Press `Create new app`-button.
4. At `Choose source code provider`, select `Github` and press `Next`.
5. In the popup, log in to Github with credentials that has access to the
   Seedlingo repo.
6. In the first dropdown, select `nodepa/seedlingo`. In the second dropdown,
   select `main`. Also check the box for `My app is a monorepo`, then press
   `Next`.
7. Enter the name of the app, i.e. `Seedlingo Apiary`. Leave the rest at
   defaults and press `Next`. (The `Frontend build command` and `Build output
   directory` will be overridden by the content of the `amplify.yml` file
   anyway, see `Edit YML file` for details/content).
8. Press `Save and deploy`.
9. If deploy fails, hunt for clues under `Deployments`. A log of all the build
   steps can be found by expanding the `Build` line.
10. If the deploy succeeds, any new git push to the same branch, i.e. `main`,
    will be picked up and deployed immediately.
11. Test the deploy in the browser by pressing the `Domain` link under
    `Deployments` or pressing the `Visit deployed URL` button under `Overview`.

## Amplify sandbox for local dev

This guide is based on the [account setup guide](
  https://docs.amplify.aws/vue/start/account-setup/
) in the Amplify docs.

1. Install [AWS CLI](
     https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
   ).
   It is available as a Snap package for Ubuntu and similar.

   ``` sh
   snap install aws-cli --classic

   # verify installation with:
   aws --version
   ```

2. Configure SSO (if you don't have an AWS SSO user, see
   [IAM Identity Center SSO setup](#iam-identity-center-sso-setup))

   ```sh
   aws configure sso

   # SSO session name: [assigned sso user, i.e. amplify-admin-1]
   # SSO start URL: https://d-966742a7b4.awsapps.com/start/
   # SSO region: ap-southeast-1
   # SSO registration scopes: [leave blank]

   # When the browser opens, log in with your aws-sso user
   ```

3. Verify

   ```sh
   aws amplify list-apps
   ```

4. Create sandbox for local dev

   ```sh
   # from within `seedlingo/editor`
   npm run sandbox
   ```

### IAM Identity Center SSO setup

To set up a SSO user with the correct permissions,
follow the [account setup guide](
  https://docs.amplify.aws/vue/start/account-setup/
) in the Amplify docs.
Then make use of the SSO user as described in
[Amplify sandbox for local dev](#amplify-sandbox-for-local-dev).

In short, create a SSO user with the permission
`AmplifyBackendDeployFullAccess`.

# Dependency upgrade process

```sh
npx nuxi@latest upgrade
npm outdated
npm update -S
```
