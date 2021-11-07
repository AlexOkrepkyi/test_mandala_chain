import { createTestPairs } from "@polkadot/keyring/testingPairs";
import { getPolkadotApi } from "../../src/tools/acala/utils/getPolkadotApi";
import { strict as assert } from "assert";
import { signAndSendTransaction, waitUntilTokensReceived, waitUntilTokensSent } from "./commonMethods";


describe("[Acala.js][balance]", function () {

    const api = getPolkadotApi();

    const testingPair = createTestPairs();
    const aliceAddress = testingPair.alice.address;
    const bobAddress = testingPair.bob.address;
    const amountToTransfer = 100_000_000_000_000;

    it("[sender] free balance should be updated after tokens are sent", async function () {
        let { data: { free: alicePreviousFree } } = await (await api).query.system.account(aliceAddress);

        await signAndSendTransaction(await api, bobAddress, amountToTransfer, testingPair);
        await waitUntilTokensSent(await api, aliceAddress, alicePreviousFree);

        let { data: { free: aliceCurrentFree } } = await (await api).query.system.account(aliceAddress);

        assert(
            alicePreviousFree > aliceCurrentFree,
            `Alice --> previous free balance: [${alicePreviousFree}] should be larger than the current free balance [${aliceCurrentFree}]`
        )
    })

    it("[receiver] free balance should be updated after tokens are sent", async function () {
        let { data: { free: bobPreviousFree } } = await (await api).query.system.account(bobAddress);

        await signAndSendTransaction(await api, bobAddress, amountToTransfer, testingPair);
        await waitUntilTokensReceived(await api, bobAddress, bobPreviousFree);

        let { data: { free: bobCurrentFree } } = await (await api).query.system.account(bobAddress);

        assert(
            bobPreviousFree < bobCurrentFree,
            `Bob --> previous free [${bobPreviousFree}] should be [${bobPreviousFree.toString() + amountToTransfer}], instead found [${bobCurrentFree}]`
        );
    })

})
