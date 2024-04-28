import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Forum from './pages/Forum/Forum';
import Profile from './pages/Profile/Profile'
import Admin from './pages/Admin/Admin';
import NotFound from './pages/NotFound/NotFound';

import Cookies from 'js-cookie';
import { UserContext } from './components/AppContext';
import axios from 'axios';


function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUser  = async() => {
    const usidCookie = Cookies.get('usid');
    if (usidCookie) {
      await axios.get("http://localhost:4000/api/uid", {
        headers: {
          "SessionId": usidCookie.match(/^..([^.]*)/)[1]
        }
      })
        .then((res) => setUser(res.data.user))
        .catch((err) => console.log(err));
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      getUser();
    }, 1);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    // Afficher un indicateur de chargement si getUser est en cours d'exécution
    return <div>Chargement en cours...</div>;
  }


  return (
    <UserContext.Provider value={user}>
      <Router>
        <Routes>
          <Route path="/" element = <Home/> />
          <Route path="/login" element = <Login/> />
          <Route path="/signup" element = <SignUp/> />
          <Route path="/forum/:id" element = <Forum/> />
          <Route path="/profile/:id" element = <Profile/> />
          <Route path="/admin" element = <Admin/> />
          <Route path="/*" element = <NotFound/> />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
