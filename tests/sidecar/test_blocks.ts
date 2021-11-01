import { strict as assert } from "assert";
import { BlocksController } from "../../src/tools/sidecar/controllers/blocks_controllers";


const block = new BlocksController()


describe("[Blocks] endpoint", function () {

    it("return block by its ID", async function () {
        const body = await block.getById("0xb42e1e3711d4dd3c1b3df8d38d6c37893d17e6337a62c1c6dc1ce521199bdafa")

        const actualNumber = body.number
        const expectedNumber = 137

        assert(
            actualNumber == expectedNumber,
            `Expected block number ${expectedNumber}, instead got [${actualNumber}]`
        )
    })

})
