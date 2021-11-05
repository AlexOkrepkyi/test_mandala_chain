import { CONFIG } from "../../../../config/env";
import { Nodes } from "../../txwrapper/types";
import { get } from "../../txwrapper/utils";


export class NetworkController {

    async getNetwork() {
        return (
            await get<Nodes>(
                `${CONFIG.SIDECAR_LOCALHOST}/node/network`
            )
        )
    }

}