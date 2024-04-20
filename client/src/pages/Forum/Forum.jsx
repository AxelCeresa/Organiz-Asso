import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import NewMessage from '../../components/NewMessage/NewMessage';
import MessagesList from '../../components/MessagesList/MessagesList';
import './Forum.css'

import { UidContext } from '../../components/AppContext';

function Forum(props) {
  const [messageList, setMessageList] = useState([]);
  const [forum, setForum] = useState(null);

  const uid = useContext(UidContext);
  let { id } = useParams();

  const getMessageList = async () => {
    await axios.get(`http://localhost:4000/api/message/forum/${id}`)
      .then((res) => setMessageList(res.data))
      .catch((err) => console.log(err));
  };


  const getForum = async () => {
    await axios.get(`http://localhost:4000/api/forum/${id}`)
      .then((res) => setForum(res.data))
      .catch((err) => {
        if (err.response.data.status === 400){
          window.location = '/notFound';
        }
        console.log(err)
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getForum();
      getMessageList();
    }, 1);

    return () => clearTimeout(timer);
  }, []);


  if (uid) {
    return <Navigate to='/' replace />;
  }


  const user = {
    _id: "660f12cef48869f0c8bdbf44",
    login: "AxelC",
    lastname: "Ceresa",
    firstname: "Axel",
    status: "member"
  };

  return (
    <div>
      <Header user={user}/ >
      <div className="wrapper">
        <SideBar />
        {forum === null ? (
          <p>Chargement du forum</p>
        ) : (
        <main className="main-content">
              <NewMessage user={user} forumId={id} getMessageList={getMessageList} />
              <h2>{forum.name}</h2>
              <MessagesList user={user} messageList={messageList}/>
        </main>
        )}
      </div>
    </div>
  );
}

export default Forum;
