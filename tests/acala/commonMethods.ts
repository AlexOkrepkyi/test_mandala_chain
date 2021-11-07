import { ApiPromise } from "@polkadot/api";
import { TestKeyringMap } from "@polkadot/keyring/testingPairs";
import { waitUntil } from "async-wait-until";
import { u128 } from "@polkadot/types";
import { CONFIG } from "../../config/env";
import { get } from "../../src/tools/txwrapper/utils";
import { Nodes } from "../../src/tools/txwrapper/types";


export async function getLatestTxHashInPool() {
    const sidecarTxPool = await get<Nodes>(`${CONFIG.SIDECAR_LOCALHOST}/node/transaction-pool`);
    const poolSize = sidecarTxPool.pool.length;
    const latestTxHashInPool = sidecarTxPool.pool[poolSize - 1].hash;
    return latestTxHashInPool;
}

export async function signAndSendTransaction(api: ApiPromise, toAddress: string, transferVolume: number, testingPair: TestKeyringMap) {
    return await api.tx.balances
        .transfer(toAddress, transferVolume)
        .signAndSend(testingPair.alice, { nonce: -1 });
}

export async function waitUntilTokensReceived(api: ApiPromise, toAddress: string, toAddressPreviousFree: number | u128) {
    await waitUntil(
        async () => (await api.query.system.account(toAddress)).data.free > toAddressPreviousFree,
        { timeout: 10000 }
    );
}

export async function waitUntilTokensSent(api: ApiPromise, fromAddress: string, fromAddressPreviousFree: number | u128) {
    await waitUntil(
        async () => (await api.query.system.account(fromAddress)).data.free < fromAddressPreviousFree,
        { timeout: 10000 }
    );
}
