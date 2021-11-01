import { JsonRequest } from "../request";


export class NetworkController {

    async getNodeNetwork() {
        return (
            await new JsonRequest()
                .url(`${SIDECAR_LOCALHOST}/node/network`)
                .send())
            .body
    }

}