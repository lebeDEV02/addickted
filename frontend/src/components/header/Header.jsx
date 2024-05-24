import React, { useEffect, useState } from 'react';
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Header() {
  const [authCompleted, setAuthCompleted] = useState(localStorage.getItem('authCompleted'));
  const [explicitCompletedAuth, setExplicitCompletedAuth] = useState(false);

  const [tonConnectUi] = useTonConnectUI();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthCompleted(localStorage.getItem('authCompleted') === 'true');
    };

    const handleAuthCompleted = () => {
      setExplicitCompletedAuth(true);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authCompleted', handleAuthCompleted);


    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authCompleted', handleAuthCompleted);
    };
  }, []);

  const handleDisconnect = () => {
    tonConnectUi.disconnect();
    navigate("/connect");
    localStorage.removeItem('authCompleted');
    setExplicitCompletedAuth(false);
    window.dispatchEvent(new Event('storage')); // Dispatch custom event
  };

  return (
    <>
      {(!authCompleted && !explicitCompletedAuth) ? (
        <Link to={location.href.includes('connect') ? '/leaderboard' : '/connect'} className='header-button background-black'>
          {location.href.includes('connect') ? 'Leaderboard' : 'Connect'}
        </Link>
      ) : (
        <div className='header-button background-black' onClick={handleDisconnect}>
          Disconnect
        </div>
      )}
    </>
  );
}

export default Header;