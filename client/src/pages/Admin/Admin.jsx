import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import SideBar from '../../components/SideBar/SideBar';
import ForumList from './components/ForumList/ForumList';
import UserList from './components/UserList/UserList';
import DemandeList from './components/DemandeList/DemandeList';

import axios from 'axios';

import './Admin.css'

import { UserContext } from '../../components/AppContext';


function Admin(props) {
  const [isForumListOpen, setIsForumListOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isDemandeListOpen, setIsDemandeListOpen] = useState(false);

  const [demandeList, setDemandeList] = useState([]);
  const [forumList, setForumList] = useState([]);
  const [userList, setUserList] = useState([]);

  const getDemandeList = async () => {
    await axios.get('http://localhost:4000/api/user/verifie')
      .then((res) => setDemandeList(res.data))
      .catch((err) => console.log(err));
  }

  const getUserList = async () => {
    await axios.get('http://localhost:4000/api/user')
      .then((res) => setUserList(res.data))
      .catch((err) => console.log(err));
  }

  const getForumList = async () => {
    await axios.get('http://localhost:4000/api/forum')
      .then((res) => setForumList(res.data))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getForumList();
    getUserList();
    getDemandeList();
  }, []);


  const user = useContext(UserContext);

  if (! user || user.status !== 'admin') {
    return <Navigate to='/' replace/>;
  }


  function toggleForumList() {
    setIsForumListOpen(!isForumListOpen);
  }
  function toggleUserList() {
    setIsUserListOpen(!isUserListOpen);
  }
  function toggleDemandeList() {
    setIsDemandeListOpen(!isDemandeListOpen);
  }


  return (
    <div>
      <Header />
      <div className="wrapper">
        <SideBar />
        <main className="main-content">
          <h1>Panneau d'administration</h1>
          <div className="list" onClick={toggleForumList}>
            <h3>Voir la liste des Forums</h3>
          </div>
          <div className="list" onClick={toggleUserList}>
            <h3>Voir la liste des utilisateurs</h3>
          </div>
          <div className="list" onClick={toggleDemandeList}>
            <h3>Voir la liste des demandes</h3>
          </div>
          <ForumList isOpen={isForumListOpen} onClose={toggleForumList}  forumList={forumList} getForumList={getForumList} />
          <UserList isOpen={isUserListOpen} onClose={toggleUserList} userList={userList} getUserList={getUserList} />
          <DemandeList isOpen={isDemandeListOpen} onClose={toggleDemandeList} demandeList={demandeList} getDemandeList={getDemandeList} getUserList={getUserList} />
        </main>
      </div>
    </div>
  );
}

export default Admin;
