
[![ExpTrackback Logo](https://user-images.githubusercontent.com/2051324/127407635-236f8a7a-4ca6-410a-9fc4-add396743cfa.png)](https://trustalliance.co.nz/)

[![TrustAlliance DID SDK](https://img.shields.io/badge/trustalliance--did-0.0.1--alpha-9cf)](https://github.com/trustalliance-blockchain/trustalliance-verifiable/tree/main/packages/trustalliance-did)
[![TrustAlliance DID SDK build](https://img.shields.io/badge/build-pass-blueviolet)](https://github.com/trustalliance-blockchain/trustalliance-verifiable/tree/main/packages)
[![Node Version](https://img.shields.io/badge/nodejs-14.0.0+-8ca)](https://nodejs.org/es/blog/release/v14.0.0)
[![Lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

# TrustAlliance DID SDK

The library is intended to be used as a common template for resolving a DID.

Supports [Decentralized Identifiers](https://w3c.github.io/did-core/#identifier) spec.

## IMPORTANT!

* This is a minimum viable product suite with limited functionality.
* Please do not use this for production
* This is a part of SDKs for Verifiable Credentials, Verifiable Credential Presentations, DID Keys, Self Sovereign Identity and Decentralised Identifiers

## TrustAlliance DID
![Architecture](Architecture.png)
## Installation

```bash
yarn install
```

## Usage

### importing DID builder and resolver

ES Modules import

```javascript

import { Builder, DIDResolver } from '@trustalliance/did'

```

CommonJS import

```javascript

const { Builder, DIDResolver } = require('@trustalliance/did');

```

## Example

Following shows how to resolve a DID using different libraries

```javascript
const { DIDResolver } = require('@trustalliance/did');
const { Connector } = require('@trustalliance/agent');

const customWebResolver = {resolve:(didUri)=>{...}}

const connector = new Connector();
const agent = new TrustAllianceAgent(connector);

const resolver = new DIDResolver();

resolver.add('web', customWebResolver);
resolver.add('trustalliance', agent.procedure);

const result: DIDResolutionResult = await resolver.resolve(
'did:web:test1234'
);

// {
//   didResolutionMetadata: {...},
//   didDocument: {...},
//   didDocumentMetadata: {...},
// };

```
