import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import NoPermission from './pages/nopermission/NoPermission'
export default function IndexRouter() {
    return (
        <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login/>} />
              <Route path="/" element={<Home/>} />
              <Route path="/*" element={<NoPermission/>} />
            </Routes>
        </BrowserRouter>
    )
}
