import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Main from "./Main";
import Connect from "./Connect";
import { backendAuth } from "../../hooks/backend-auth";
import { BackendTokenContext } from "../../hooks/BackendTokenContext";
function Body() {

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [token, setToken] = useState(null);
  const [authCompleted, setAuthCompleted] = useState(localStorage.getItem('authCompleted'));

  return (
    <BackendTokenContext.Provider value={{ token, setToken }}>
      <main className="w-full h-full flex overflow-hidden">
        <div className="w-full">
          <div className="pinner"></div>
          <div className={`main-table ${authCompleted ? "FULL" : "large"}`}>
            <div className={`main-table__inner flex flex-col items-center overflow-y-scroll ${authCompleted ? "FULL" : "large"}`}>
              {!authCompleted && <Connect authCompleted={authCompleted} setAuthCompleted={setAuthCompleted} />}
              {authCompleted && <Main></Main>}
            </div>
          </div>
        </div>
      </main>
    </BackendTokenContext.Provider>
  );
}

export default Body;
