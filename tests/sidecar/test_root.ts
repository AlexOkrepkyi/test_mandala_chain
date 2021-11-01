import { strict as assert } from "assert";
import { RootController } from "../../src/tools/sidecar/controllers/root_controllers";


const root = new RootController()


describe("[Root] endpoint: the following fields/objects should be present", function () {

    it("docs", async function () {
        const body = await root.getRoot()

        const actualDocs = body.docs
        const expectedDocs = "https://paritytech.github.io/substrate-api-sidecar/dist"

        assert(
            actualDocs == expectedDocs,
            `Expected URL [${expectedDocs}], instead got [${actualDocs}]`
        )
    })

    it("version", async function () {
        const body = await root.getRoot()

        const actualVersion = body.version
        const expectedVersion = "11.0.0"

        assert(
            actualVersion == expectedVersion,
            `Expected version [${expectedVersion}], instead got [${actualVersion}]`
        )
    })

})
