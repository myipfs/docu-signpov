
export interface Recipient {
  id: string;
  name: string;
  email: string;
  role: 'signer' | 'viewer';
}

export interface SignatureFieldData {
  id: string;
  name: string;
  recipientId: string;
  position: { x: number; y: number; page: number };
  isSigned: boolean;
}
