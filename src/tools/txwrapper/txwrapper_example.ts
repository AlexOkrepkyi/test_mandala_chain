import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';

import { construct, decode, deriveAddress, getRegistry, methods, TokenSymbol } from '@acala-network/txwrapper-acala';
import { get, post } from './utils';
import { Balance, Transaction, TransactionMaterial } from './types';


const SIDECAR_HOST = 'http://127.0.0.1:8080';


async function run_txwrapper(): Promise<void> {
  await cryptoWaitReady();

  const alice = new Keyring().addFromUri(
    '//Alice',
    { name: 'Alice' },
    'sr25519'
  );

  console.log(
    `Alice's account address: ${deriveAddress(alice.publicKey, 42)}\n`
  );

  // Pull info from the node to construct an offline transaction. It's up
  // to you how you retrieve this info but here we are using a local API
  // sidecar. We are also pulling the balance info of Alice's account to
  // ensure we are using a valid nonce.
  const material = await get<TransactionMaterial>(
    `${SIDECAR_HOST}/transaction/material`
  );

  console.log(
    `Transaction material: ${material}\n`
  );

  const balance = await get<Balance>(
    `${SIDECAR_HOST}/accounts/${deriveAddress(
      alice.publicKey,
      42
    )}/balance-info`
  );

  const {
    nonce
  } = balance;

  console.log(
    `Balance --> nonce: ${balance.nonce}\n`
  );

  // Unpack the info pulled from the node.
  const {
    at: { hash, height },
    genesisHash,
    chainName,
    specName,
    specVersion,
    txVersion,
    metadata
  } = material;

  console.log(
    `Tx material --> chainName: ${material.chainName}\n`
  );

  // Create a new registry instance using metadata from node.
  const registry = getRegistry({
    chainName,
    specName,
    specVersion,
    metadataRpc: metadata
  });

  console.log(
    `Registry --> chainTokens --> ${registry.chainTokens}\n`
  );

  // Create an unsigned currency transfer transaction.
  const unsigned = methods.currencies.transfer(
    {
      amount: '123',
      currencyId: { Token: registry.chainTokens.toString() }, // Unit
      dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty' // Bob
    },
    {
      address: deriveAddress(alice.publicKey, 42),
      blockHash: hash,
      blockNumber: height,
      eraPeriod: 64,
      genesisHash,
      metadataRpc: metadata,
      nonce: balance.nonce + 1, // This doesn't take into account pending transactions in the pool
      specVersion,
      tip: 0,
      transactionVersion: txVersion
    },
    {
      metadataRpc: metadata,
      registry
    }
  );

  console.log(
    `Unsigned --> address --> ${unsigned.address}\n`,
    `Unsigned --> blockNumber --> ${unsigned.blockNumber}\n`
  );

  // Construct the signing payload from the unsigned transaction.
  const signingPayload = construct.signingPayload(unsigned, { registry });

  // Sign the payload.
  const { signature } = registry
    .createType('ExtrinsicPayload', signingPayload, {
      version: EXTRINSIC_VERSION
    })
    .sign(alice);

  // Create a signed transaction.
  const tx = construct.signedTx(unsigned, signature, {
    metadataRpc: metadata,
    registry
  });

  const expectedTxHash = construct.txHash(tx);

  // Decode transaction payload.
  const payloadInfo = decode(signingPayload, {
    metadataRpc: metadata,
    registry
  });

  console.log(`Chain node: ${chainName}\n`);
  console.log(`Tx signature: ${signature}\n`);

  console.log(
    `Decoded transaction\n  To (Bob): ${JSON.stringify(
      payloadInfo.method.args.dest
    )}\n` +
    `  Amount: ${payloadInfo.method.args.amount}\n` +
    `  CurrencyId: ${JSON.stringify(payloadInfo.method.args.currencyId)}\n`
  );

  // Send the transaction to the node. Txwrapper doesn't care how
  // you send this transaction but here we are using the API sidecar.
  const response = await post<Transaction>(`${SIDECAR_HOST}/transaction`, {
    tx: tx
  });

  console.log(`Expected hash: ${expectedTxHash}`);
  console.log(`Tx hash: ${response.hash}`);
}

run_txwrapper().catch((error) => {
  console.error(error);
  process.exit(1);
});