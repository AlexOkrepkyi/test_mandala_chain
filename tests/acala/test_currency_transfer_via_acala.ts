import { createTestPairs } from "@polkadot/keyring/testingPairs";
import { getPolkadotApi } from "../../src/tools/acala/utils/getPolkadotApi";
import { strict as assert } from "assert";
import { getLatestTxHashInPool, signAndSendTransaction, waitUntilTokensReceived, waitUntilTokensSent } from "./commonMethods";


describe("[Acala.js][transfer]", function () {

    it("transfer currency from Alice to Bob", async function () {
        const api = await getPolkadotApi();

        const testingPair = createTestPairs();
        const aliceAddress = testingPair.alice.address;
        const bobAddress = testingPair.bob.address;
        const amountToTransfer = 100_000_000_000_000;

        let { data: { free: alicePreviousFree }, nonce: alicePreviousNonce } = await api.query.system.account(aliceAddress);
        let { data: { free: bobPreviousFree }, nonce: bobPreviousNonce } = await api.query.system.account(bobAddress);

        const currentTxHash = await signAndSendTransaction(api, bobAddress, amountToTransfer, testingPair);
        const latestTxHashInPool = await getLatestTxHashInPool();

        await waitUntilTokensSent(api, aliceAddress, alicePreviousFree);
        await waitUntilTokensReceived(api, bobAddress, bobPreviousFree);

        let { data: { free: aliceCurrentFree }, nonce: aliceCurrentNonce } = await api.query.system.account(aliceAddress);
        let { data: { free: bobCurrentFree }, nonce: bobCurrentNonce } = await api.query.system.account(bobAddress);

        assert(
            currentTxHash.toString() === latestTxHashInPool.toString(),
            `Actual tx hash [${currentTxHash}] != latest tx hash in the pool [${latestTxHashInPool}]`
        );

        assert(
            alicePreviousFree > aliceCurrentFree,
            `Alice --> previous free balance: [${alicePreviousFree}] should be larger than the current free balance [${aliceCurrentFree}]`
        )

        assert(
            alicePreviousNonce < aliceCurrentNonce,
            `Alice --> previous nonce: [${alicePreviousNonce}] should be smaller than the current nonce [${aliceCurrentNonce}]`
        );

        assert(
            bobPreviousFree < bobCurrentFree,
            `Bob --> previous free [${bobPreviousFree}] should be [${bobPreviousFree.toString() + amountToTransfer}], instead found [${bobCurrentFree}]`
        );

        assert(
            bobPreviousNonce.toString() === bobCurrentNonce.toString(),
            `Bob --> previous nonce [${bobPreviousNonce}] should equal to the current nonce [${bobCurrentNonce}]`
        );
    })

})
