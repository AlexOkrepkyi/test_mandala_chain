import got from "got";
import { JsonRequest } from "../request";


export class AssetBalanceController {

    async getResponseById(id: string) {
        return await new JsonRequest()
            .url(`http://127.0.0.1:8080/accounts/${id}/asset-balance`)
            .send()
    }
    
}

export class BalanceInfoController {

    async getBodyById(id: string) {
        return (
            await new JsonRequest()
                .url(`http://127.0.0.1:8080/accounts/${id}/balance-info`)
                .send()
        ).body
    }

}