import { createTestPairs, TestKeyringMap } from "@polkadot/keyring/testingPairs";
import { waitUntil } from "async-wait-until";
import got from "got";
import { CONFIG } from "../../config/env";
import { getPolkadotApi } from "../../src/tools/acala/utils/getPolkadotApi";
import { strict as assert } from "assert";
import { ApiPromise } from "@polkadot/api";
import { u128 } from "@polkadot/types";


describe("[Acala.js]", function () {

    it("transfer currency from Alice to Bob", async function () {
        const api = await getPolkadotApi();

        const testingPair = createTestPairs();
        const aliceAddress = testingPair.alice.address;
        const bobAddress = testingPair.bob.address;
        const transferVolume = 100_000_000_000_000;

        let { data: { free: alicePreviousFree }, nonce: alicePreviousNonce } = await api.query.system.account(aliceAddress);
        let { data: { free: bobPreviousFree }, nonce: bobPreviousNonce } = await api.query.system.account(bobAddress);

        const currentTxHash = await signAndSendTransaction(api, bobAddress, transferVolume, testingPair);
        const latestTxHashInPool = await getLatestTxHashInPool();

        await waitUntilTokensSent(api, aliceAddress, alicePreviousFree);
        await waitUntilTokensReceived(api, bobAddress, bobPreviousFree);

        let { data: { free: aliceCurrentFree }, nonce: aliceCurrentNonce } = await api.query.system.account(aliceAddress);
        let { data: { free: bobCurrentFree }, nonce: bobCurrentNonce } = await api.query.system.account(bobAddress);

        assert(
            currentTxHash.toString() === latestTxHashInPool.toString(),
            `txHash [${currentTxHash}] != txHashInPool [${latestTxHashInPool}]`
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
            `Bob --> previous free [${bobPreviousFree}] should be [${bobPreviousFree.toString() + transferVolume}], instead found [${bobCurrentFree}]`
        );

        assert(
            bobPreviousNonce.toString() === bobCurrentNonce.toString(),
            `Bob --> previous nonce [${bobPreviousNonce}] should equal to the current nonce [${bobCurrentNonce}]`
        );
    })

})


async function getLatestTxHashInPool() {
    const sidecarPoolResponse = await got(`${CONFIG.SIDECAR_LOCALHOST}/node/transaction-pool`);
    const sidecarPoolBody = JSON.parse(sidecarPoolResponse.body);
    const poolSize = JSON.parse(sidecarPoolBody.pool.length);
    const latestTxHashInPool = sidecarPoolBody.pool[poolSize - 1].hash;
    return latestTxHashInPool;
}

async function signAndSendTransaction(api: ApiPromise, bobAddress: string, transferVolume: number, testingPair: TestKeyringMap) {
    return await api.tx.balances
        .transfer(bobAddress, transferVolume)
        .signAndSend(testingPair.alice, { nonce: -1 });
}

async function waitUntilTokensReceived(api: ApiPromise, bobAddress: string, bobPreviousFree: number | u128) {
    await waitUntil(
        async () => (await api.query.system.account(bobAddress)).data.free > bobPreviousFree,
        { timeout: 10000 }
    );
}

async function waitUntilTokensSent(api: ApiPromise, aliceAddress: string, alicePreviousFree: number | u128) {
    await waitUntil(
        async () => (await api.query.system.account(aliceAddress)).data.free < alicePreviousFree,
        { timeout: 10000 }
    );
}
