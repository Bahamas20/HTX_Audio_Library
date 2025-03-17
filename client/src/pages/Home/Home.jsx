import React from 'react'
import Header from '../../components/Header/Header'
import { useNavigate } from 'react-router-dom'
import AudioLibrary from '../../components/AudioLibrary/AudioLibrary';


function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };
    
  return (
    <div> 
    <Header handleLogout={handleLogout} />
    <AudioLibrary />
    </div>
  )
}

export default Home