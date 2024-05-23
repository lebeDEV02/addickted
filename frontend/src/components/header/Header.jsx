import React, { useEffect, useState } from 'react';
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Header() {
  const [authCompleted, setAuthCompleted] = useState(localStorage.getItem('authCompleted'));
  const [tonConnectUi] = useTonConnectUI();
  const navigate = useNavigate();

  // Effect to handle custom storage event
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthCompleted(localStorage.getItem('authCompleted') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    console.log('authCompleted changed:', authCompleted);
  }, [authCompleted]);

  const handleDisconnect = () => {
    tonConnectUi.disconnect();
    navigate("/connect");
    localStorage.removeItem('authCompleted');
    window.dispatchEvent(new Event('storage')); // Dispatch custom event
  };

  return (
    <>
      {!authCompleted ? (
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