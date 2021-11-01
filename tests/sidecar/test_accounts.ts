import { strict as assert } from "assert";
import { AssetBalanceController, BalanceInfoController } from "../../src/tools/sidecar/controllers/accounts_controllers";


const assetBalance = new AssetBalanceController()
const balanceInfo = new BalanceInfoController()


describe("[Accounts] endpoint", function () {

    it("[asset-balance] status should return 200 status code", async function () {
        const response = await assetBalance.getResponseById("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")

        const actualStatusCode = response.statusCode
        const expectedStatusCode = 200

        assert(
            actualStatusCode == expectedStatusCode,
            `Expected status code [${expectedStatusCode}], instead found [${actualStatusCode}]`
        )
    })

    it("[balance] free balance should be positive", async function () {
        const body = await balanceInfo.getBodyById("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")

        const actualTokenSymbol = body.tokenSymbol
        const expectedTokenSymbol = "UNIT"
        const actualFree = body.free

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
