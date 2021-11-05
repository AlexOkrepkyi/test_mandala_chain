import { strict as assert } from "assert";
import { TransactionsController } from "../../src/tools/sidecar/controllers/transactions_controllers";


const tx = new TransactionsController()


describe("Sidecar [transactions] endpoint", function () {

    it("[material] expected genesis hash should be returned", async function () {
        const response = await tx.getTxMaterial()

        const actualGenesisHash = response.genesisHash
        const expectedGenesisHash = "0xa99d872682b0453c0d5e1fca2694fb08dc4d627101783eb8aaffa6d33c7f78c6"

        assert(
            actualGenesisHash == expectedGenesisHash,
            `Expected [${expectedGenesisHash}], instead got [${actualGenesisHash}]`
        )
    })

})
