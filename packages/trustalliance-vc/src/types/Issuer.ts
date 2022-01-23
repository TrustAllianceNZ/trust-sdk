type IssuerURI = string;

// Issuer
interface IssuerObject {
  id: string;
  [x: string]: any;
}

export type Issuer = IssuerURI | IssuerObject;
