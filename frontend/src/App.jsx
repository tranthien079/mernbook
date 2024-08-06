import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from './util/axios.customize'
import { Outlet } from 'react-router-dom'
import { AuthContext } from './components/Context/AuthContext'
import { Spin, Row, Col } from 'antd'
import LayoutAdmin from './components/Layout/LayoutAdmin'
import './index.css'

function App() {
  const { setAuth, setAppLoading } = useContext(AuthContext);
 
  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        const res = await axios.get('/v1/api/account');
        if (res && !res.message) {
          setAuth({
            isAuthenticated: true,
            user: {
              _id: res?._id,
              email: res?.email,
              user_name: res?.name,
              role: res?.role,
              avatar: res?.avatar ?? "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg"
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch account:", error);
      } finally {
        setAppLoading(false);
      }
    };
  
    fetchAccount();
  }, [setAppLoading, setAuth]);
  
  return (
    <div>
     {/* {appLoading ? (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          <Spin />
        </div>
      ) : (
        
      )} */}
      <>
          <LayoutAdmin />
        </>
    </div>
  )
}

export default App
