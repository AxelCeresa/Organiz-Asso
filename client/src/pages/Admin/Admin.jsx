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
    console.log('Chargement des demandes');
    await axios.get('http://localhost:4000/api/user/verifie')
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        setDemandeList(res.data);
      })
      .catch((err) => console.log(err));
  }

  const getUserList = async () => {
    console.log('Chargement des utilisateurs');
    await axios.get('http://localhost:4000/api/user')
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        setUserList(res.data);
      })
      .catch((err) => console.log(err));
  }

  const getForumList = async () => {
    console.log('Chargement des forums');
    await axios.get('http://localhost:4000/api/forum')
      .then((res) => {
        console.log('Réponse server : ');
        console.log(res.data);
        setForumList(res.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      getForumList();
      getUserList();
      getDemandeList();
    }, 1);
    return () => clearTimeout(timer);
  }, []);


  const user = useContext(UserContext);

  if (! user || user.status !== 'admin') {
    return <Navigate to='/' replace/>;
  }


  function toggleForumList() {
    console.log('Bouton liste forums cliqué');
    setIsForumListOpen(!isForumListOpen);
  }
  function toggleUserList() {
    console.log('Bouton liste utilisateurs cliqué');
    setIsUserListOpen(!isUserListOpen);
  }
  function toggleDemandeList() {
    console.log('Bouton liste demandes cliqué');
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
