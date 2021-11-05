import { CONFIG } from "../../../../config/env";
import { Balance } from "../../txwrapper/types";
import { get } from "../../txwrapper/utils";


export class AccountsController {

    async getById(id: string) {
        return (
            await get<Balance>(
                `${CONFIG.SIDECAR_LOCALHOST}/accounts/${id}/balance-info`
            )
        )
    }

}