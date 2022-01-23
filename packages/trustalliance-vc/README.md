[![ExpTrustAlliance Logo](https://avatars.githubusercontent.com/u/95656833?s=100)](https://trustalliance.co.nz/)

[![TrustAlliance VC SDK](https://img.shields.io/badge/trustalliance--vc-0.0.1--alpha-blue)](https://github.com/trustalliance-blockchain/trustalliance-verifiable/tree/main/packages/trustalliance-vc)
[![TrustAlliance VC SDK Build](https://img.shields.io/badge/build-pass-blueviolet)](https://github.com/trustalliance-blockchain/trustalliance-verifiable/tree/main/packages)
[![Node Version](https://img.shields.io/badge/nodejs-14.0.0+-8ca)](https://nodejs.org/es/blog/release/v14.0.0)
[![Lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

# TrustAlliance SDK for Verifiable Credentials & Presentations

This sdk handles for issuing and verifying verifying Credentials
and Presentations that adhere to W3C standards.

## IMPORTANT!

* This is a minimum viable product suite with limited functionality.
* Please do not use this for production
* This is a part of SDKs for Verifiable Credentials, Verifiable Credential Presentations, DID Keys, Self Sovereign Identity and Decentralised Identifiers

## Installation

```bash
yarn install
```

## TrustAlliance Verifiabe Credentials
![Architecture](Architecture.png)
## Usage

### Importing Verifiable Credentials

ES Modules import

```javascript

import { VC } from '@trustalliance/vc'

```

CommonJS import

```javascript

const { VC } = require('@trustalliance/vc');

```

### Validate Verifiable Credentials

```javascript

const vc = new VC();

const result = vc.validate({
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                "type": ["VerifiableCredential"],
                "credentialSubject": {},
                "issuer": "did:trustalliance:issuer/1234"
            });

// true

```

### Verifiable Credentials create JWT

```javascript
import { JsonWebKey2020 } from '@trustalliance/key';
import { VC } from '@trustalliance/vc'

 
const vc = new VC();
const keyPair = await JsonWebKey2020.generate();

const credential = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    "type": ["VerifiableCredential"],
    "issuanceDate": "2010-01-01T19:23:24Z",
    "credentialSubject": {},
    "issuer": "did:trustalliance:issuer/1234"
}
const jwt = await vc.issueJWT({ keyPair, credential })

```

### Verifiable Credentials validate JWT

```javascript
import { JsonWebKey2020 } from '@trustalliance/key';
import { VC } from '@trustalliance/vc'

 
const vc = new VC();
const keyPair = await JsonWebKey2020.generate();

const credential = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    "type": ["VerifiableCredential"],
    "issuanceDate": "2010-01-01T19:23:24Z",
    "credentialSubject": {},
    "issuer": "did:trustalliance:issuer/1234"
}
const jwt = await vc.issueJWT({ keyPair, credential })

const result = await vc.verifyJWT(jwt, { keyPair, credential })

// true
```


## Presentation

### importing Verifiable Presentation

```javascript

import { VP } from '@trustalliance/vc'

```

### Verifiable Presentation create jwt

```javascript
import { JsonWebKey2020 } from '@trustalliance/key';
import { VP } from '@trustalliance/vc'

const vp = new VP();

const keyPair = await JsonWebKey2020.generate();

const presentation = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    "type": ["VerifiablePresentation"],
    verifiableCredential: [{
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        "type": ["VerifiableCredential"],
        "credentialSubject": {},
        "issuer": "did:trustalliance:issuer/1234"


    }]
}

const jwt = await vp.issueJWT({ keyPair, presentation })


// jwt
```

### Verifiable Presentation validate jwt

```javascript
import { JsonWebKey2020 } from '@trustalliance/key';
import { VP } from '@trustalliance/vc'

const vp = new VP();

// example json web key
const key = {
    id: 'did:trustalliance:key:SBQyXxAUa41yrBP9YJ-mPsCtESFjmzbOIUrzGI3-oWs#SBQyXxAUa41yrBP9YJ-mPsCtESFjmzbOIUrzGI3-oWs',
    type: 'JsonWebKey2020',
    controller: 'did:trustalliance:key:SBQyXxAUa41yrBP9YJ-mPsCtESFjmzbOIUrzGI3-oWs',
    publicKeyJwk: {
        crv: 'Ed25519',
        x: 'VBB9DDDSl3IMPNGlx5f4h-NY2AVKpOMauKqVSm3LYcU',
        kty: 'OKP',
        alg: 'EdDSA'
    },
    privateKeyJwk: {
        crv: 'Ed25519',
        d: 'nVlVbr0cfTf0KxIfha2LsOt3x4G7rJ2mRc_TbYXsscY',
        x: 'VBB9DDDSl3IMPNGlx5f4h-NY2AVKpOMauKqVSm3LYcU',
        kty: 'OKP',
        alg: 'EdDSA'
    }
}

// import key
const keyPair = JsonWebKey2020.from(key);

const JWT = `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp0cmFja2JhY2s6a2V5OlNCUXlYeEFVYTQxeXJCUDlZSi1tUHNDdEVTRmptemJPSVVyekdJMy1vV3MjU0JReVh4QVVhNDF5ckJQOVlKLW1Qc0N0RVNGam16Yk9JVXJ6R0kzLW9XcyJ9.eyJuYmYiOjE2MzQ2ODA2MDksInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6W3siQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6e30sImlzc3VlciI6ImRpZDp0cmFja2JhY2s6aXNzdWVyLzEyMzQifV19fQ.mZLZIH-BOd3r72ryGEkfs7UBfIQ5_fSRchUo9h7DgIwd9L2BE3fhIviJW2X9YMIyEVeAi8C2Yz1m8ETT9pmHBw`

const presentation = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    "type": ["VerifiablePresentation"],
    verifiableCredential: [{
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        "type": ["VerifiableCredential"],
        "credentialSubject": {},
        "issuer": "did:trustalliance:issuer/1234"
    }]
}

const result = await vp.verifyJWT(JWT, { keyPair, presentation })

// true
```
