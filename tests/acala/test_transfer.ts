import { createTestPairs } from "@polkadot/keyring/testingPairs";
import { assert } from "console";
import got from "got";
import { getPolkadotApi } from "../../src/tools/acala/utils/getPolkadotApi";


const generalTokenTransfer = async () => {
    const api = await getPolkadotApi();

    const testingPair = createTestPairs();

    // const signer = getSigner("//Alice");

    const fromAddress = testingPair.alice.address;
    const toAddress = testingPair.bob.address;

    // console.log(`[${testingPair.alice.meta.name}] has address [${testingPair.alice.address}] with publicKey [${testingPair.alice.publicKey}]`)
    // console.log(`[${testingPair.bob.meta.name}] has address [${testingPair.bob.address}] with publicKey [${testingPair.bob.publicKey}]`)

    const beforeAccountData = await api.query.system.account(fromAddress);
    // console.log(beforeAccountData.toHuman());

    const currentTxHash = await api.tx.balances
        .transfer(toAddress, 7733377)
        .signAndSend(testingPair.alice, { nonce: -1 });

    const afterAccountData = await api.query.system.account(fromAddress)
    // console.log(afterAccountData.toHuman());

    // // console.log("Transfer sent with hash", currentTxHash.toHex());
    // console.log("Transfer sent with hash", currentTxHash.toHex());


    const sidecarPoolResponse = await got(`${SIDECAR_LOCALHOST}/node/transaction-pool`);
    const sidecarPoolBody = JSON.parse(sidecarPoolResponse.body)
    const poolSize = JSON.parse(sidecarPoolBody.pool.length)
    const latestTxHashInPool = sidecarPoolBody.pool[poolSize - 1].hash

    assert(currentTxHash == latestTxHashInPool, `txHash [${currentTxHash}] != txHashInPool [${latestTxHashInPool}]`)

}

generalTokenTransfer()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });


