
export interface Balance {
  nonce: number;
  tokenSymbol: string;
  free: number;
}


export interface Block {
  header: {
    number: number;
  };
}


export interface Nodes {
  localListenAddresses: Array<string>;
}


export interface Root {
  version: string
}


export interface RuntimeVersion {
  specVersion: number;
  transactionVersion: number;
  specName: 'acala' | 'karura' | 'mandala';
}


export interface Transaction {
  hash: string;
}


export interface TransactionMaterial {
  body: any;
  at: {
    hash: string;
    height: number;
  };
  genesisHash: string;
  chainName: string;
  specName: 'acala' | 'karura' | 'mandala';
  specVersion: number;
  txVersion: number;
  metadata: string;
}