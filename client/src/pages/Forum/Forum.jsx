import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
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

  const location = useLocation();
  const user = useContext(UserContext);
  let { id } = useParams();

  const getMessageList = async () => {
    console.log('Chargement messages');
    setMessageList([]);
    await axios.get(`http://localhost:4000/api/message/forum/${id}`)
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        setMessageList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getForum = async () => {
    console.log('Chargement forum');
    await axios.get(`http://localhost:4000/api/forum/${id}`)
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        setForum(res.data);
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
      getForum();
      getMessageList();
    }, 1);

    return () => clearTimeout(timer);
  }, [location.pathname]);


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
              <MessagesList messageList={messageList} getMessageList={getMessageList} />
        </main>
        )}
      </div>
    </div>
  );
}

export default Forum;
