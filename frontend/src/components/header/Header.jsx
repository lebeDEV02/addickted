import React from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
function Header() {
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  return (
    <></>
    // <header className='relative flex h-24 justify-end mt-4 px-4'>
    //         <TonConnectButton className="my-button-class" style={{ float: "right" }}/>
    //         <div className='text-grey-light'>
    //             <span>User-friendly address: {userFriendlyAddress}</span>
    //             <span>Raw address: {rawAddress}</span>
    //         </div>
    // </header>
  );
}

export default Header;