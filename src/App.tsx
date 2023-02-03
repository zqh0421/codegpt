import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import NoPermission from './pages/nopermission/NoPermission'
import { io } from "socket.io-client"

const socket = io('http://localhost:7777')

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/codegpt_test" element={localStorage?.token ? <Home socket={socket} /> : <Login/>} />
        <Route path="/*" element={<NoPermission/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;