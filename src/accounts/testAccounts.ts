import { Keyring } from "@polkadot/api";


export class TestAccounts {
    
    async getAlice() {
        return account("//Alice")
    }

    async getBob() {
        return account("//Bob");
    }

}


function account(name: string) {
    const bob = new Keyring().addFromUri(
        name,
        { name: 'Bob' },
        'sr25519'
    );
    return bob;
}
