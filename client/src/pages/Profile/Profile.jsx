import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import MessagesList from '../../components/MessagesList/MessagesList';
import UserInfos from './UserInfos/UserInfos'
import './Profile.css'

import { UserContext } from '../../components/AppContext';

function Profile(props) {
  const [messageList, setMessageList] = useState([]);
  const [userProfil, setUserProfil] = useState(null);

  const location = useLocation();
  const user = useContext(UserContext);
  let { id } = useParams();

  const getMessageList = async () => {
    console.log('Chargement messages');
    await axios.get(`http://localhost:4000/api/message/user/${id}`)
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        setMessageList(res.data);
      })
      .catch((err) => console.log(err));
  };


  const getUser = async () => {
    console.log('Chargement utilisateur');
    await axios.get(`http://localhost:4000/api/user/${id}`)
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        setUserProfil(res.data);
      })
      .catch((err) => {
        if (err.response.data.status === 400){
          window.location = '/notFound';
        }
        console.log(err)
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getUser();
      getMessageList();
    }, 1);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);


  if (! user) {
    return <Navigate to='/' replace/>;
  }

  return (
    <div>
      <Header />
      <div className="wrapper">
        <SideBar />
        <main className="main-content">
          <UserInfos user={userProfil} />
          <MessagesList messageList={messageList} />
        </main>
      </div>
    </div>
  );
}

export default Profile;
