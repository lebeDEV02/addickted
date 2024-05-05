import {Account, ConnectAdditionalRequest, TonProofItemReplySuccess} from "@tonconnect/ui";

class BackendAuth {
    baseURL = 'http://localhost:8080';

    async generatePayload() {
        try {
            console.log(`${this.baseURL}/wallet/auth/generate`);

            const response = await (
                await fetch(`${this.baseURL}/wallet/auth/generate`, {
                    method: 'GET'
                })
            ).json();
            console.log(response)
            return { tonProof: response.payload };
        } catch (e) {
            console.error(e);
            return;
        }
    }

    async checkProof(proof, account) {
        try {
            const requestBody = {
                address: account.address,
                network: account.chain,
                proof: {
                    ...proof,
                    state_init: account.walletStateInit
                }
            }

            const response = await (
                await fetch(`${this.baseURL}/wallet/auth/verify`, {
                    method: 'POST',
                    body: JSON.stringify(requestBody)
                })
            ).json()

            return  response?.token;
        } catch (e) {
            console.log(e);
        }
    }
}

export const backendAuth = new BackendAuth();