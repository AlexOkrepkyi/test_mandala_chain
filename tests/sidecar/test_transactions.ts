import { strict as assert } from "assert";
import { TransactionsController } from "../../src/tools/sidecar/controllers/transactions_controllers";


const tx = new TransactionsController()


describe("[Transaction] endpoint", function () {

    it("submit transaction", async function () {

        // hardcoded example to test its feasibility
        const txToSubmit = { tx: "0x9da09e60416d8ffe8e8c50f576b6e555468f1c83e50117f19fb88d1202f57f2e" }
        const response = await tx.submitTxThenReturnResponse(txToSubmit)

        const actualStatusCode = response.statusCode
        const expectedStatusCode = 200

        assert(
            actualStatusCode == expectedStatusCode,
            `Expected status code [${expectedStatusCode}], instead found [${actualStatusCode}]`
        )
    })

    it("[material] expected genesis hash should be returned", async function () {
        const body = await tx.getTxMaterial()

        const actualGenesisHash = body.genesisHash
        const expectedGenesisHash = "0x9da09e60416d8ffe8e8c50f576b6e555468f1c83e50117f19fb88d1202f57f2e"

        assert(
            actualGenesisHash == expectedGenesisHash,
            `Expected [${expectedGenesisHash}], instead got [${actualGenesisHash}]`
        )
    })

})
