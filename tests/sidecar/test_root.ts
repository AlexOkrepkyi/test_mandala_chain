import { strict as assert } from "assert";
import { RootController } from "../../src/tools/sidecar/controllers/root_controllers";


const root = new RootController()


describe("Sidecar [root] endpoint: the following fields/objects should be present", function () {

    it("version", async function () {
        const response = await root.getRoot()

        const actualVersion = response.version
        const expectedVersion = "11.1.0"

        assert(
            actualVersion == expectedVersion,
            `Expected version [${expectedVersion}], instead got [${actualVersion}]`
        )
    })

})
