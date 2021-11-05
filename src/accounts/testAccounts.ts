import { Keyring } from "@polkadot/api";


export class TestAccounts {
    
    async getAlice() {
        const alice = new Keyring().addFromUri(
            '//Alice',
            { name: 'Alice' },
            'sr25519'
        );
        return alice
    }

    async getBob() {
        const bob = new Keyring().addFromUri(
            '//Bob',
            { name: 'Bob' },
            'sr25519'
        );
        return bob;
    }

}