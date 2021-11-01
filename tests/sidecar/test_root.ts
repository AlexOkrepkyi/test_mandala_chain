import got from "got";
import { strict as assert } from "assert";


describe("[Root] endpoint: the following fields/objects should be present", function () {

    it("docs", async function () {
        const response = await got("http://127.0.0.1:8080")
        const body = JSON.parse(response.body)

        const actualDocs = body.docs
        const expectedDocs = "https://paritytech.github.io/substrate-api-sidecar/dist"

        assert(
            actualDocs == expectedDocs,
            `Expected URL [${expectedDocs}], instead got [${actualDocs}]`
        )
    })

    it("version", async function () {
        const response = await got("http://127.0.0.1:8080")
        const body = JSON.parse(response.body)

        const actualVersion = body.version
        const expectedVersion = "11.0.0"

        assert(
            actualVersion == expectedVersion,
            `Expected version [${expectedVersion}], instead got [${actualVersion}]`
        )
    })

})
