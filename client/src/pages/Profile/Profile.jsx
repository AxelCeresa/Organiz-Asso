import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import MessagesList from '../../components/MessagesList/MessagesList';
import UserInfos from './UserInfos/UserInfos'
import './Profile.css'

import { UidContext } from '../../components/AppContext';

function Profile(props) {
  const [messageList, setMessageList] = useState([]);
  const [user, setUser] = useState(null);

  const uid = useContext(UidContext);
  let { id } = useParams();

  const getMessageList = async () => {
    await axios.get(`http://localhost:4000/api/message/user/${id}`)
      .then((res) => setMessageList(res.data))
      .catch((err) => console.log(err));
  };


  const getUser = async () => {
    await axios.get(`http://localhost:4000/api/user/${id}`)
      .then((res) => setUser(res.data))
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

    return () => clearTimeout(timer);
  }, []);


  if (uid) {
    return <Navigate to='/' replace/>;
  }


  return (
    <div>
      <Header user={user}/>
      <div className="wrapper">
        <SideBar />
        <main className="main-content">
          <UserInfos user={user} />
          <MessagesList user={user} messageList={messageList} />
        </main>
      </div>
    </div>
  );
}

export default Profile;
