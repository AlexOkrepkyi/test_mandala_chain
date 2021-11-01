import got from "got";
import { strict as assert } from "assert";
import { TransactionsController } from "../../src/tools/sidecar/controllers/transactions_controllers";


const tx = new TransactionsController()


describe("[Transaction] endpoint", function () {

    it("[material] expected genesis hash should be returned", async function () {
        const response = await got("http://127.0.0.1:8080/transaction/material")
        const body = JSON.parse(response.body)

        const actualGenesisHash = body.genesisHash
        const expectedGenesisHash = "0x9da09e60416d8ffe8e8c50f576b6e555468f1c83e50117f19fb88d1202f57f2e"

        assert(
            actualGenesisHash == expectedGenesisHash,
            `Expected [${expectedGenesisHash}], instead got [${actualGenesisHash}]`
        )
    })

})
