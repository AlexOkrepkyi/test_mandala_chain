import { CONFIG } from "../../../../config/env";
import { TransactionMaterial } from "../../txwrapper/types";
import { get, post } from "../../txwrapper/utils";
import { JsonRequest } from "../request";


export class TransactionsController {

    async getTxMaterial() {
        return (
            await get<TransactionMaterial>(
                `${CONFIG.SIDECAR_LOCALHOST}/transaction/material`
            )
        )
    }

    async postTx(tx: { tx: string }) {
        return (await post<TransactionMaterial>(
            `${CONFIG.SIDECAR_LOCALHOST}/transaction`, {
            tx: tx
        }))
    }
}
