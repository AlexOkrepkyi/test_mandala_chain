import { ApiPromise, WsProvider } from "@polkadot/api"
import { options } from "@acala-network/api"


export const getPolkadotApi = async function() {
    const provider = new WsProvider("ws://127.0.0.1:9944", 100)
    const api = new ApiPromise(options({ provider }))
    await api.isReady

    return api
}
