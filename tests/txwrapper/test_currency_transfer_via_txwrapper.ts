import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';
import { construct, decode, getRegistry, methods, TokenSymbol } from '@acala-network/txwrapper-acala';
import { TestAccounts } from '../../src/accounts/testAccounts';
import { Balance, Transaction, TransactionMaterial } from '../../src/tools/txwrapper/types';
import { get, post } from '../../src/tools/txwrapper/utils';
import { strict as assert } from 'assert';
import { waitUntil } from 'async-wait-until';
import { CONFIG } from '../../config/env';


const testAccount = new TestAccounts();


describe("[txwrapper][sidecar]", function () {

    it("currency transfer", async function () {
        const alice = await testAccount.getAlice()
        const bob = await testAccount.getBob()

        const aliceAddress = alice.address;
        const bobAddress = bob.address;

        // Pull info from the node to construct an offline transaction.
        const material = await get<TransactionMaterial>(
            `${CONFIG.SIDECAR_LOCALHOST}/transaction/material`
        );

        const aliceBalance = await get<Balance>(
            `${CONFIG.SIDECAR_LOCALHOST}/accounts/${aliceAddress}/balance-info`
        );

        const alicePreviousFree = aliceBalance.free
        console.log(alicePreviousFree);


        assert(alicePreviousFree > 0);

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

        // Create a new registry instance using metadata from node.
        const registry = getRegistry({
            chainName,
            specName,
            specVersion,
            metadataRpc: metadata
        });

        // Create an unsigned currency transfer transaction.
        const unsigned = methods.currencies.transfer(
            {
                amount: '321',
                currencyId: { Token: TokenSymbol.ACA },
                dest: bobAddress
            },
            {
                address: aliceAddress,
                blockHash: hash,
                blockNumber: height,
                eraPeriod: 64,
                genesisHash,
                metadataRpc: metadata,
                nonce: aliceBalance.nonce + 1, // This doesn't take into account pending transactions in the pool
                specVersion,
                tip: 0,
                transactionVersion: txVersion
            },
            {
                metadataRpc: metadata,
                registry
            }
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

        console.log(
            `Decoded transaction\n  To (Bob): ${JSON.stringify(
                payloadInfo.method.args.dest
            )}\n` +
            `  Amount: ${payloadInfo.method.args.amount}\n` +
            `  CurrencyId: ${JSON.stringify(payloadInfo.method.args.currencyId)}\n`
        );

        // Send the transaction to the node. Txwrapper doesn't care how
        // you send this transaction but here we are using the API sidecar.
        const response = await post<Transaction>(`${CONFIG.SIDECAR_LOCALHOST}/transaction`, {
            tx: tx
        });

        const actualTxHash = response.hash;

        const aliceCurrentFree = aliceBalance.free;

        await waitUntil(
            () => aliceCurrentFree < alicePreviousFree,
            { timeout: 10_000 },
        );

        assert(
            actualTxHash == expectedTxHash,
            `Actual tx hash [${actualTxHash}] != expected tx hash [${expectedTxHash}]`
        );

        assert(
            alicePreviousFree > aliceCurrentFree,
            `Alice's free balance before transfer [${alicePreviousFree}] is not larger than after [${aliceCurrentFree}]`)

    }).timeout(10_000)

});
