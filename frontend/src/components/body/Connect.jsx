import React, { useEffect } from "react";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { useBackendAuth } from "../../hooks/useBackendAuth";

function Connect({ authCompleted, setAuthCompleted, termsAccepted, ...props }) {
    const [tonConnectUi] = useTonConnectUI();
    const userFriendlyAddress = useTonAddress();
  
    useBackendAuth();
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = localStorage.getItem('dapp-auth-token');
      const oauthToken = urlParams.get("oauth_token");
      const oauthVerifier = urlParams.get("oauth_verifier");
  
      if (!authCompleted && code && oauthToken && oauthVerifier) {
        exchangeCodeForToken(code, { oauth_token: oauthToken, oauth_verifier: oauthVerifier })
          .then((tokenData) => {
            localStorage.setItem('authCompleted', true);
            setAuthCompleted(true);
          })
          .catch((error) => {
            console.error("Error exchanging code for token:", error);
          });
      }
    }, [authCompleted, setAuthCompleted]);
  
    const exchangeCodeForToken = async (code, bodyData) => {
      try {
        const response = await fetch("https://api-leaderboard.addickted.xyz/go-api/oauth2/twitter/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${code}`
          },
          body: JSON.stringify(bodyData)
        });
        if (!response.ok) {
          throw new Error("Failed to exchange code for token");
        }
        const tokenData = await response.json();
        return tokenData;
      } catch (error) {
        throw error;
      }
    };
  
    const handleTwitterAuthClick = async () => {
      try {
        const response = await fetch("https://api-leaderboard.addickted.xyz/go-api/oauth2/twitter/callback");
        const data = await response.json();
        const redirectUrl = data.url;
        window.location.href = redirectUrl;
      } catch (error) {
        console.error("Error:", error);
      }
    };
  return (
    <div className="w-full flex flex-col justify-start text-black connect">
      <div className="flex flex-col w-full justify-center items-center">
        <h1 className="text-xl connect__title">
          heal yourself with $DICK
        </h1>
        <div className="connect__description">
          <div className="relative max-w-fit">
            <p className="">
              Create content about DICK. More views equals more $DICK.
              Leaderboard is updated every 20 min.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 mx-4 text-md lg:text-lg flex">
        <p className="verify">Verify Your Eligibility</p>
      </div>
      <div className="mt-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start">
            <div className="flex w-full items-start gap-9">
              <span className="title-lg step">1</span>
              <div className="flex flex-col items-start gap-4">
                <p>CONNECT WALLET</p>
                <a
                  className={`button flex background-black justify-center w-full ${
                    userFriendlyAddress ? "pointer-events-none opacity-70" : ""
                  }`}
                  onClick={() => {
                    tonConnectUi.openModal();
                  }}
                >
                  CONNECT WALLET
                </a>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col relative ${
              !userFriendlyAddress ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start w-full gap-9">
              <span className="title-lg step">2</span>
              <div className="flex flex-col items-start gap-4">
                <p>CONNECT TWITTER</p>
                <a
                  className={`button flex background-black justify-center w-full ${
                    !userFriendlyAddress ? "pointer-events-none" : ""
                  }`}
                  onClick={handleTwitterAuthClick}
                >
                  CONNECT TWITTER
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connect;
