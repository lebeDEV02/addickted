import {Account, ConnectAdditionalRequest, TonProofItemReplySuccess} from "@tonconnect/ui";

class BackendAuth {
    baseURL = 'https://api-leaderboard.addickted.xyz/go-api';

    async generatePayload() {
        try {
            const response = await (
                await fetch(`${this.baseURL}/wallet/auth/generate`, {
                    method: 'GET'
                })
            ).json();
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