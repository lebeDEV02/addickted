import React, { useEffect } from "react";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";

function Connect({ showModal, modalToggler, termsAccepted, ...props }) {
  const [tonConnectUi] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Exchange the code for an access token
    if (code) {
    //   exchangeCodeForToken(code)
    //     .then((tokenData) => {
    //       // Handle the token data (e.g., store the access token)
    //       console.log("Token Data:", tokenData);
    //     })
    //     .catch((error) => {
    //       // Handle errors
    //       console.error("Error exchanging code for token:", error);
    //     });
    }
  }, []);

  const handleTwitterAuthClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/oauth2/twitter/callback");
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
        <p>Verify Your Eligibility</p>
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
                    userFriendlyAddress ? "pointer-events-none" : ""
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
