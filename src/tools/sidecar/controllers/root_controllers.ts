import { CONFIG } from "../../../../config/env";
import { Root } from "../../txwrapper/types";
import { get } from "../../txwrapper/utils";


export class RootController {

    async getRoot() {
        return (
            await get<Root>(
                `${CONFIG.SIDECAR_LOCALHOST}`
            )
        )
    }
    
}