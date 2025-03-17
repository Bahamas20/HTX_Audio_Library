import React from 'react'
import Profile from './Profile';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import './header.css'


function Header( {handleLogout}) {

  const onLogout = () => {
    handleLogout();
  }
  
    return (
    <div className='background'>
      <div className='title'>
      <h1 className='nav-title'> HamJam </h1>
      <AudiotrackIcon className="audio-icon" />
      </div>
        <Profile onLogout={onLogout}></Profile>
    </div>
  )
}

export default Header