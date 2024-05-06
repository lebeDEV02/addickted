import React from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { Link } from 'react-router-dom';
function Header() {
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  return (
    <>
    <Link to={location.href.includes('connect') ? '/leaderboard' : '/connect'} className='header-button background-black'>
      {location.href.includes('connect') ? 'Leaderboard' : 'Connect'}
    </Link>
    </>
  );
}

export default Header;