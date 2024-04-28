import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import NewMessage from '../../components/NewMessage/NewMessage';
import MessagesList from '../../components/MessagesList/MessagesList';
import './Forum.css'

import { UserContext } from '../../components/AppContext';

function Forum(props) {
  const [messageList, setMessageList] = useState([]);
  const [forum, setForum] = useState(null);

  const user = useContext(UserContext);
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


  if (! user) {
    return <Navigate to='/' replace />;
  }


  return (
    <div>
      <Header />
      <div className="wrapper">
        <SideBar />
        {forum === null ? (
          <p>Chargement du forum</p>
        ) : (
        <main className="main-content">
              <NewMessage forumId={id} getMessageList={getMessageList} />
              <h2>{forum.name}</h2>
              <MessagesList messageList={messageList}/>
        </main>
        )}
      </div>
    </div>
  );
}

export default Forum;
