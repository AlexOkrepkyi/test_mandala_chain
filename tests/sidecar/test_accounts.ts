import { TokenSymbol } from "@acala-network/txwrapper-acala";
import { strict as assert } from "assert";
import { AccountsController } from "../../src/tools/sidecar/controllers/accounts_controllers";


const balanceInfo = new AccountsController()


describe("Sidecar [accounts] endpoint", function () {

    it("[balance] free balance should be positive", async function () {
        const response = await balanceInfo.getById("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")

        const actualTokenSymbol = response.tokenSymbol
        const expectedTokenSymbol = TokenSymbol.ACA
        const actualFree = response.free

        assert(
            actualTokenSymbol == expectedTokenSymbol,
            `Expected token symbol [${expectedTokenSymbol}], instead found [${actualTokenSymbol}]`
        )

        assert(
            actualFree > 0,
            `Expected positive account balance of a [${expectedTokenSymbol}] token, instead found [${actualFree}]`
        )
    })

})
