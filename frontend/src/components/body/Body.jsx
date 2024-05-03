import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Main from "./Main";
import Connect from "./Connect";

function Body() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);


  const handleTokenResponse = async (response) => {
    try {
      if (!response.ok) {
        throw new Error("Failed to exchange code for token");
      }

      const tokenData = await response.json();
      console.log("Token Data:", tokenData);
      return tokenData;
    } catch (error) {
      console.error("Error handling token response:", error);
      throw error;
    }
  };

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch("https://api.twitter.com/2/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: "Uks4S2hsV09TZUhhSEt4Zk9WLVA6MTpjaQ",
          redirect_uri: "http://localtest.me:3000/",
          code: code,
          code_verifier:
            "a089537451d7d7242a4cbbfa8e9f8aa235c2a5c544b89a8a016230e61fb08ab8",
        }),
      });

      const data = await response.json();
      console.log(data);
      return handleTokenResponse(response);
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // exchangeCodeForToken(code)
      //   .then((tokenData) => {
      //     console.log("Token Data:", tokenData);
      //   })
      //   .catch((error) => {
      //     console.error("Error exchanging code for token:", error);
      //   });
    }
  }, []);


  return (
    <main className="w-full h-full flex overflow-hidden">
      <div className="w-full">
        <div className="pinner">
          </div>
        <div className="main-table FULL">
          <div className="main-table__inner flex flex-col items-center overflow-y-scroll FULL">
        {/* <Connect/> */}
        <Main></Main>
        </div>
        </div>
        </div>
    </main>
  );
}

export default Body;
