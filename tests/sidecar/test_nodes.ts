import { strict as assert } from "assert";
import { NetworkController } from "../../src/tools/sidecar/controllers/nodes_controllers";


const node = new NetworkController();

describe("Sidecar [nodes] endpoint", function () {

    it("total 2 (two) local listen addresses should be present", async function () {
        const response = await node.getNetwork();

        const actualNumberOfListeAddresses = response.localListenAddresses.length;
        const expectedNumberOfListeAddresses = 2;

        assert(
            actualNumberOfListeAddresses == expectedNumberOfListeAddresses,
            `Total actual peers [${actualNumberOfListeAddresses}] != 'numPeers' value [${expectedNumberOfListeAddresses}]`
        );
    })

})
