import { JsonWebKey2020, KeyPairOptions } from '@trustalliance/key';
import { VC, VP, CredentialBuilder } from '@trustalliance/vc';
import { v4 as uuidv4 } from 'uuid';
import {
  ICredentialIssuer,
  IKeyPair,
  ICredential,
  ITrustAllianceContext,
  DIDDocument,
  ServiceEndpoint,
  VerificationMethod
} from "../types";
import crypto from 'crypto';
import Keyring from "@polkadot/keyring";


/**
 * Trackback implementation for issuing credentials and presentations
 */
export class CredentialIssuer implements ICredentialIssuer {

  credentialBuilder: CredentialBuilder;
  id: string
  keypair: IKeyPair;
  didDocumentMetaData: any;


  constructor(options?: any) {

    this.id = options?.id;
    this.keypair = options?.keypair;
    this.credentialBuilder = new CredentialBuilder();

  }

  static async build(options?: any) {
    const id = options?.id || `did:trustalliance:${uuidv4()}`
    const keypair = await JsonWebKey2020.generate();
    return new CredentialIssuer({ ...options, id, keypair });
  }

  getIssuer() {
    return this.id;
  }


  private __updateDidDocument(meta?: any) {
    if (!meta) return;
    Object.keys(meta).forEach(key => meta[key] === undefined ? delete meta[key] : {});
    this.didDocumentMetaData = {
      ...this.didDocumentMetaData,
      ...meta,
    }
  }

  setService(service?: ServiceEndpoint[]) {
    this.__updateDidDocument({ service })
  }

  setAlsoKnownAs(alsoKnownAs?: string[]) {
    this.__updateDidDocument({ alsoKnownAs })
  }

  setController(controller?: string | string[]) {
    this.__updateDidDocument({ controller })
  }

  setAuthentication(authentication?: (string | VerificationMethod)[]) {
    this.__updateDidDocument({ authentication })
  }

  setAssertionMethod(assertionMethod?: (string | VerificationMethod)[]) {
    this.__updateDidDocument({ assertionMethod })
  }

  setKeyAgreement(keyAgreement?: (string | VerificationMethod)[]) {
    this.__updateDidDocument({ keyAgreement })
  }

  setCapabilityInvocation(capabilityInvocation?: (string | VerificationMethod)[]) {
    this.__updateDidDocument({ capabilityInvocation })
  }

  setCapabilityDelegation(capabilityDelegation?: (string | VerificationMethod)[]) {
    this.__updateDidDocument({ capabilityDelegation })
  }

  setOther(other: { [key: string]: any }) {
    this.__updateDidDocument({ ...other })
  }

  /**
   * Save Issuer did document
   * @param context - ITrustAllianceContext
   * @returns json didDocument
   */

  async save(context: ITrustAllianceContext, didDocumentMetadata: any = {}, didResolutionMetadata: any = {}) {
    const keyring = new Keyring({ type: "sr25519", ss58Format: 42 });
    const didDocument = this.toDidDocument();
    // TODO: Fix public key format
    let publicKey = keyring.encodeAddress(context.account.keyPair.publicKey, 42)//new TextDecoder().decode(context.account.keyPair.publicKey);
    let data = {
      didDocument: didDocument,
      "proof": crypto.createHash('sha256').update(JSON.stringify(didDocument)).digest('base64'),
      "senderTimeStamp": new Date().toISOString(),
      "publicKey": publicKey
    }

    if (context && context.agent) {
      let didRef = await context.agent.procedure.saveToDistributedStorage(data, {});
      await context.agent.procedure.constructDIDDocument(
        context.account.keyPair,
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata,
        didRef,
        [publicKey]
      );
    }

    return didDocument
  }

  /**
   * create did document for this issuer
   * @returns json didDocument
   */
  toDidDocument() {

    const didDocument: DIDDocument = {
      "@context": [
        "https://www.w3.org/ns/did/v1"
      ],
      id: this.id,
      ...this.didDocumentMetaData
    };

    if (!didDocument.id) {
      throw new Error('DIDDocument id required. Please refer https://www.w3.org/TR/did-core/#did-syntax');
    }

    if (didDocument.id.split(':')[0] !== 'did') {
      throw new Error('did prefix required. Please refer https://www.w3.org/TR/did-core/#did-syntax');
    }

    const { id, type, controller, publicKeyJwk } = this.keypair;

    didDocument['verificationMethod'] = [{
      id,
      controller,
      type,
      publicKeyJwk
    }]

    return didDocument;
  }



  /**
   * Create Verifiable Credentials as JWT
   * 
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
   * @param cred - The credential
   * @param keyPair - optional key pair 
   * @returns jwt
   */
  async createVerifiableCredentials(
    cred: ICredential,
    keyPair?: IKeyPair
  ): Promise<string> {
    if (!cred) throw new Error("Credentials required");

    if (!keyPair && !this.keypair) throw new Error("keyPair required");

    const vc = new VC();

    return vc.issue({ keyPair: (keyPair || this.keypair), credential: cred });
  }


  /**
   * Create JWT payload of a JWT based verifiable presentation
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#example-31-jwt-payload-of-a-jwt-based-verifiable-presentation-non-normative | JWT payload of a JWT based verifiable presentation (non-normative)}
   * @param vcs - array of JWT
   * @param keyPair - JWT key pair
   * @returns jwt
   */
  createVerifiablePresentation(
    vcs: string[],
    keyPair: IKeyPair
  ): Promise<string> {

    if (!vcs || vcs.length === 0) throw new Error("One or more VerifiableCredentials required");

    if (!keyPair) throw new Error("keyPair required");

    const presentation = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [
        ...vcs
      ],
    };

    const vp = new VP();
    return vp.issue({ keyPair, presentation, headers: { iss: this.id } });

  }


  /**
   * Generate IKeyPair
   * @param controller - did uri of the controller
   * @param alg - algorithm key
   * @param options - 
   * @returns 
   */
  generateKeyPair(
    controller?: string,
    alg?: string,
    options?: KeyPairOptions): Promise<IKeyPair> {
    return JsonWebKey2020.generate(controller, alg, options);
  }


  /**
   * import IKeyPair from object
   * @param keyPair - json IKeyPair type
   * @returns IKeyPair
   */
  importKeyPair(keyPair: any): IKeyPair {
    return JsonWebKey2020.import(keyPair);
  }


  /**
   * Export issuer as json
   * 
   */
  export(): string {
    return JSON.stringify(this);
  }

  /**
   * import issuer from json
   * @param options - json string
   * @returns CredentialIssuer
   */
  import(options: string) {
    return new CredentialIssuer(JSON.parse(options))
  }

}
