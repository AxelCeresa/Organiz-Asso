import React, { useState } from 'react';
import SearchResult from './SearchResult/SearchResult';

import axios from 'axios';

import './Search.css'

function Search(props) {
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState([]);

  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toggleSearchResult = () => {
    setIsSearchResultOpen(!isSearchResultOpen);
    setUserList([]);
    setMessageList([]);
  }

  const getUserList = async () => {
    await axios.post('http://localhost:4000/api/user/search', { "text": text })
      .then((res) => {
        console.log('Réponse serveur pour les users: ');
        console.log(res.data);
        setUserList(res.data);
      })
      .catch((err) => console.log(err));
  }

  const getMessageList = async () => {
    await axios.post(`http://localhost:4000/api/message/search`,
      { "text": text,
        "startDate": startDate,
        "endDate": endDate
      })
      .then((res) => {
        console.log('Réponse serveur pour les messages : ');
        console.log(res.data);
        setMessageList(res.data);
      })
      .catch((err) => console.log(err));
  }


  const handleSearch = async () => {
    if (text){
      console.log('Bouton rechercher cliqué');
      toggleSearchResult();
      await getUserList();
      await getMessageList();
    }
  }

  return (
      <div className="search">
        <input type="text" placeholder=" 🔎 Recherche..." onChange={(e) => setText(e.target.value)} required/>
        <button className='submit' type="submit" onClick={handleSearch}>Rechercher</button>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <SearchResult isOpen={isSearchResultOpen} onClose={toggleSearchResult} userList={userList} messageList={messageList} />
      </div>
  );
}

export default Search;
