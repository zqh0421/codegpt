import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import NoPermission from './pages/nopermission/NoPermission'
import './components/PromptEditor/NewEditor'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/codegpt_test" element={localStorage?.token ? <Home/> : <Login/>} />
        <Route path="/*" element={<NoPermission/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;