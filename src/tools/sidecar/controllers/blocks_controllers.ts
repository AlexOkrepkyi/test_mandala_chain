import { JsonRequest } from "../request";


export class BlocksController {

    async getById(id: string) {
        return (
            await new JsonRequest()
                .url(`http://127.0.0.1:8080/blocks/${id}`)
                .send())
            .body
    }

}