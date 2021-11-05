import { cleanEnv, url } from "envalid";


export const CONFIG = cleanEnv(process.env, {
    SIDECAR_LOCALHOST: url({
        default: "http://127.0.0.1:8080",
        desc: "substrate-api-sidecar endpoints"
    })
})
