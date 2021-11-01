import { JsonRequest } from "../request";


export class RootController {

    async getRoot() {
        return (
            await new JsonRequest()
                .url(`${SIDECAR_LOCALHOST}`)
                .send())
            .body
    }

}