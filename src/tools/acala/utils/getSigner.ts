import { Keyring } from "@polkadot/keyring"


export function getSigner(signer: string) {

    const keyring = new Keyring({
        type: "sr25519",
    })

    return keyring.addFromUri(signer)

}