import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';
import { construct, decode, getRegistry, methods, TokenSymbol } from '@acala-network/txwrapper-acala';
import { TestAccounts } from '../../src/accounts/testAccounts';
import { Transaction } from '../../src/tools/txwrapper/types';
import { post } from '../../src/tools/txwrapper/utils';
import { strict as assert } from 'assert';
import { waitUntil } from 'async-wait-until';
import { CONFIG } from '../../config/env';
import { TransactionsController } from '../../src/tools/sidecar/controllers/transactions_controllers';
import { AccountsController } from '../../src/tools/sidecar/controllers/accounts_controllers';


const accountsController = new AccountsController();
const testAccount = new TestAccounts();
const txController = new TransactionsController();


describe("[txwrapper][sidecar]", function () {

    it("currency transfer", async function () {
        const alice = await testAccount.getAlice();
        const bob = await testAccount.getBob();

        const aliceAddress = alice.address;
        const bobAddress = bob.address;

        const transferVolume = 300_000_000_000_000;

        // Pull info from the node to construct an offline transaction.
        const material = await txController.getTxMaterial();
        const aliceBalance = await accountsController.getById(aliceAddress);
        const alicePreviousFree = aliceBalance.free;

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
            chainName: chainName,
            specName: specName,
            specVersion: specVersion,
            metadataRpc: metadata
        });

        // Create an unsigned currency transfer transaction.
        const unsigned = methods.currencies.transfer(
            {
                amount: transferVolume,
                currencyId: { Token: TokenSymbol.ACA },
                dest: bobAddress
            },
            {
                address: aliceAddress,
                blockHash: hash,
                blockNumber: height,
                eraPeriod: 64,
                genesisHash: genesisHash,
                metadataRpc: metadata,
                nonce: aliceBalance.nonce + 1, // This doesn't take into account pending transactions in the pool
                specVersion: specVersion,
                tip: 0,
                transactionVersion: txVersion
            },
            {
                metadataRpc: metadata,
                registry: registry
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
            registry: registry
        });

        const expectedTxHash = construct.txHash(tx);

        // Decode transaction payload.
        const payloadInfo = decode(signingPayload, {
            metadataRpc: metadata,
            registry: registry
        });

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
            `Alice --> previous free balance: [${alicePreviousFree}] should be larger than the current free balance [${aliceCurrentFree}]`
        );
    });

});
