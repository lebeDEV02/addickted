import React from 'react';
import { Link } from 'react-router-dom';
function Header() {
  const authCompleted = localStorage.getItem('authCompleted');

  return (
    <>
      {!authCompleted ? (
        <Link to={location.href.includes('connect') ? '/leaderboard' : '/connect'} className='header-button background-black'>
          {location.href.includes('connect') ? 'Leaderboard' : 'Connect'}
        </Link>
      ) : null}
    </>
  );
}

export default Header;