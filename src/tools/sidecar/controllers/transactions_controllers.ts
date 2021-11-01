import { JsonRequest } from "../request";


export class TransactionsController {

    async submitTransactionReturnResponse(tx: { tx: string }) {
        return (await new JsonRequest()
            .url(`http://127.0.0.1:8080/transaction`)
            .method("POST")
            .body(tx)
            .send()
        ).body
    }

}