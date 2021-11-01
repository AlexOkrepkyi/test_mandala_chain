import { JsonRequest } from "../request";


export class AssetBalanceController {

    async getResponseById(id: string) {
        return await new JsonRequest()
            .url(`${SIDECAR_LOCALHOST}/accounts/${id}/asset-balance`)
            .send()
    }
    
}

export class BalanceInfoController {

    async getBodyById(id: string) {
        return (
            await new JsonRequest()
                .url(`${SIDECAR_LOCALHOST}/accounts/${id}/balance-info`)
                .send()
        ).body
    }

}