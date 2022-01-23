[![ExpTrustAlliance Logo](https://avatars.githubusercontent.com/u/95656833?s=100)](https://trustalliance.co.nz/)

[![TrustAlliance VC SDK](https://img.shields.io/badge/trustalliance--vc-0.0.1--alpha-blue)](https://github.com/trustalliance-blockchain/trustalliance-verifiable/tree/main/packages/trustalliance-vc)
[![TrustAlliance Key SDK 0.0.1-alpha.6](https://img.shields.io/badge/trustalliance--key-0.0.1--alpha-green)](https://github.com/trustalliance-blockchain/trustalliance-verifiable/tree/main/packages/trustalliance-key)
[![TrustAlliance DID SDK](https://img.shields.io/badge/trustalliance--did-0.0.1--alpha-9cf)](https://github.com/trustalliance-blockchain/trustalliance-verifiable/tree/main/packages/trustalliance-did)
[![TrustAlliance Agent SDK](https://img.shields.io/badge/trustalliance--trustalliance--agent-0.0.1--alpha-yellow)](https://github.com/trustalliance-blockchain/trustalliance-verifiable/tree/main/packages/trustalliance-agent)

[![TrustAlliance VC SDK Build](https://img.shields.io/badge/build-pass-blueviolet)](https://github.com/trustalliance-blockchain/trustalliance-verifiable/tree/main/packages)
[![Node Version](https://img.shields.io/badge/nodejs-14.0.0+-8ca)](https://nodejs.org/es/blog/release/v14.0.0)
[![Lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## SDKs for Verifiable Credentials, Verifiable Credential Presentations, DID Keys, Self Sovereign Identity and Decentralised Identifiers

## IMPORTANT! 
* This is a minimum viable product suite with limited functionality.
* Please do not use this for production

## Prerequisites
* BuildScripts 
* Working with NodeJS 14.0.0 + in either Linux or Windows

## The Big Picture ( MVP Release )
![Architecture](Architecture.png)

## Mono repo packages
Please go through the individual repositories 
* [trustalliance-agent](./packages/trustalliance-agent)
* [trustalliance-did](./packages/trustalliance-did)
* [trustalliance-key](./packages/trustalliance-key)
* [trustalliance-vc](./packages/trustalliance-vc)


### Setup project.
```bash
nvm use 14
npm install lerna
npm install bootstrap
yarn config set workspaces-experimental true
npm run bootstrap
```

### Tests
To run all tests for the project

```bash
npm run test
```

### Builder

```bash
npm run build
```

### Clean and rebuild
```bash
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
yarn install
```
### Generate documentation
```bash
sudo npm i -g typedoc # needs to do only once
typedoc --darkHighlightTheme dark-plus --tsconfig ./tsconfig.json
```