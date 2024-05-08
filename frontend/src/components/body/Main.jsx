import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

function Main({ authCompleted, setAuthCompleted, ...props }) {
  const [leaderboard, setLeaderboard] = useState(null);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountData, setAccountData] = useState(undefined);

  useEffect(() => {
    fetchLeaderboardData();
    fetchAccountData();
  }, []);

  useEffect(() => {
    if(!leaderboard?.length) return;

    if (searchQuery.length === 0) {
        setFilteredLeaderboard(leaderboard);
        return;
    }

    const filteredData = leaderboard?.filter((row) =>
      row.twitter_handle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLeaderboard(filteredData);
  }, [searchQuery, leaderboard]);

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

  const fetchLeaderboardData = () => {
    fetch("https://api-leaderboard.addickted.xyz/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data);
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  };

  const fetchAccountData = () => {
    const authToken = localStorage.getItem("dapp-auth-token");
    if (!authToken) return;

    fetch("https://api-leaderboard.addickted.xyz/go-api/account", {
      headers: {
        Authorization: authToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.tweets_count === null) {
            setAccountData(null);
            return;
        }
        setAccountData({
          twitter_username: data.twitter_username,
          tweets_count: data.tweets_count,
          views_count: data.views_count,
        });
      })
      .catch((error) => console.error("Error fetching account data:", error));
  };

  return (
    <div className="w-full flex flex-col items-center justify-start px-9 main">
        <Outlet/>
      <div className="w-full flex flex-col gap-8 items-center">
        <div className="flex flex-col w-full justify-center items-center pt-20 pb-8 px-12 about-text">
          <h1 className="title-lg">airdrop 1</h1>
          <div className="mt-4 text-xs lg:text-lg text-center">
            <div className="relative max-w-fit">
              <p className="about-text__description">
                Create content about DICK. More views equals more $DICK.
                Leaderboard is updated every 20 min.
              </p>
            </div>
          </div>
        </div>
        {accountData === null && (
            <div className="w-full">
                <p className="user-stats">Your stats:</p>
            <div>You need to connect your Twitter account</div>
            </div>
        )}
        {accountData && (
          <div className="w-full">
            <p className="user-stats">Your stats:</p>
            <table className="w-full leaderboard">
              <thead>
                <tr>
                  {["USER", "TWEETS", "VIEWS"].map((header, index) => (
                    <th key={index} className="">
                      <div className="relative max-w-fit">
                        <p className="pt-0.5 pl-0.5 lh-lg text-pink">
                          {header}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.values(accountData).map((value, columnIndex) => (
                      <td
                      key={columnIndex}
                      className={`px-1 lg:px-4 pt-4 text-left w-${
                        columnIndex === 0 ? "3/5" : "1/5"
                      }`}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div className="search-input w-2/3 text-sm sm:text-xs md:text-sm lg:text-base xl:text-sm 2xl:text-base uppercase text-nowrap lh-lg text-center">
          <input
            type="text"
            className="w-full px-2 bg-transparent outline-none search-input__bar"
            placeholder="Search by handle"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full">
          <table className="w-full leaderboard">
            <thead>
              <tr>
                {["RANK", "USER", "TWEETS", "VIEWS"].map((header, index) => (
                  <th key={index} className="">
                    <div className="relative max-w-fit">
                      <p className="pt-0.5 pl-0.5 lh-lg text-pink">{header}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
                {filteredLeaderboard === null && <p>Loading...</p>}
              {filteredLeaderboard !== null && (filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, columnIndex) => (
                      <td
                        key={columnIndex}
                        className={`px-1 lg:px-4 pt-4 text-left w-${
                          columnIndex === 1 ? "2/5" : "1/5"
                        }`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Main;
