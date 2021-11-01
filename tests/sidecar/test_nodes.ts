import got from "got";
import { strict as assert } from "assert";


describe("[Nodes] endpoint", function () {

    it("total number of actual peers should be equal to the value in the 'numPeers'", async function () {
        const response = await got("http://127.0.0.1:8080/node/network")
        const body = JSON.parse(response.body)

        const actualPeersInfoLength = body.peersInfo.length
        const expectedPeersInfoLength = body.numPeers

        assert(
            actualPeersInfoLength == expectedPeersInfoLength,
            `Total actual peers [${actualPeersInfoLength}] != 'numPeers' value [${expectedPeersInfoLength}]`
        )
    })

})
