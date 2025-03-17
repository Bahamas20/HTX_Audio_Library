import React, { useState, useEffect } from 'react';
import './profile.css'


const Profile = ({onLogout}) => {
    const [firstName, setFirstName] = useState("admin");
    
    useEffect(() => {
      const storedFirstName = localStorage.getItem("username") || "admin";
      
      setFirstName(storedFirstName);
    }, []); 

    const getInitials = (name) => {
      return name[0].toUpperCase();
    }
  return (
    <div className='profile'>
        <div className='profile-icon'>
            {getInitials(firstName)}
        </div>
        <div>
            <p className='profile-text'>{firstName}</p>
            <button className='logout-button' onClick={onLogout}> Logout </button>
        </div>
    </div>
  )
}

export default Profile