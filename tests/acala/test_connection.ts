// import { assert } from "console"
// import { getPolkadotApi } from "../../src/acala/utils/getPolkadotApi"




// describe("Connection", function () {

//     it("Rococo Local Testnet should be connected", async function () {

//         const api = await getPolkadotApi();

//         const [chain, nodeName, nodeVersion] = await Promise.all([
//             api.rpc.system.chain(),
//             api.rpc.system.name(),
//             api.rpc.system.version()
//         ])

//         const actualChain = chain.toString()
//         const expectedChain = "Rococo Local Testnet"

//         assert(
//             actualChain == expectedChain,
//             `Expected [${expectedChain}], instead found [${actualChain}]`
//         )

//         console.log("disconneting now ...")
//             ; api.disconnect


//         // main().then(() => process.exit(0)); 
//     })
// })

// // async function main() {
// //     const provider = new WsProvider("ws://127.0.0.1:9944");
// //     const api = new ApiPromise(options({ provider }));
// //     await api.isReadyOrError;

// //     const [chain, nodeName, nodeVersion] = await Promise.all([
// //         api.rpc.system.chain(),
// //         api.rpc.system.name(),
// //         api.rpc.system.version()
// //     ])

// //     console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`)
// // }

