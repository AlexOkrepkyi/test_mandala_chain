import { strict as assert } from "assert";
import { NetworkController } from "../../src/tools/sidecar/controllers/nodes_controllers";


const network = new NetworkController()


describe("[Nodes] endpoint", function () {

    it("total number of actual peers should be equal to the value in the 'numPeers'", async function () {
        const body = await network.getNodeNetwork()

        const actualPeersInfoLength = body.peersInfo.length
        const expectedPeersInfoLength = body.numPeers

        assert(
            actualPeersInfoLength == expectedPeersInfoLength,
            `Total actual peers [${actualPeersInfoLength}] != 'numPeers' value [${expectedPeersInfoLength}]`
        )
    })

})
