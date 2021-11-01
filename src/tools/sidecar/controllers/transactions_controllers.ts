import { JsonRequest } from "../request";


export class TransactionsController {

    async getTxMaterial() {
        return (
            await new JsonRequest()
                .url(`${SIDECAR_LOCALHOST}/transaction/material`)
                .send())
            .body
    }


    async submitTxThenReturnResponse(tx: { tx: string }) {
        return (await new JsonRequest()
            .url(`${SIDECAR_LOCALHOST}/transaction`)
            .method("POST")
            .body(tx)
            .send()
        ).body
    }

}
