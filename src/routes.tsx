import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import NoPermission from './pages/nopermission/NoPermission'
export default function IndexRouter() {
    return (
        <BrowserRouter>
            <Routes>
              <Route path="/codegpt_test" element={localStorage?.token ? <Home /> : <Login />} />
              <Route path="/*" element={<NoPermission/>} />
            </Routes>
        </BrowserRouter>
    )
}
