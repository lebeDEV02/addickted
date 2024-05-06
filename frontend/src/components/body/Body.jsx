import React, { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Router,
} from "react-router-dom";
import Main from "./Main";
import Connect from "./Connect";
import { BackendTokenContext } from "../../hooks/BackendTokenContext";

function Body({ activate }) {
  const [authCompleted, setAuthCompleted] = useState(
    localStorage.getItem("authCompleted")
  );
  const [token, setToken] = useState(null);

  return (
    <BackendTokenContext.Provider value={{ token, setToken }}>
      <main className="w-full h-full flex overflow-hidden">
        <div className="w-full">
          <div className="pinner"></div>
          <div className={`main-table ${authCompleted ? "full" : "large"}`}>
            <img class="cloud-1" src="./cloud-1.png"></img>
            <img class="cloud-2" src="./cloud-2.png"></img>
            <img class="cloud-3" src="./cloud-3.png"></img>
            <div
              className={`main-table__inner flex flex-col items-center overflow-y-scroll ${
                authCompleted ? "full" : "large"
              }`}
            >
              {activate === "leaderboard" && <Main />}
              {activate === "connect" && (
                <Connect
                  authCompleted={authCompleted}
                  setAuthCompleted={setAuthCompleted}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </BackendTokenContext.Provider>
  );
}

export default Body;
