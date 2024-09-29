import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminPageComponent from '../../pages/Admin/AdminPageComponent/AdminPageComponent'
import LoginPage from '../../pages/LoginPage/LoginPage'
import SignupPage from '../../pages/SignupPage/SignupPage'

const RouterComponent = () => {
  return (
    <Routes>
        <Route exact path='/' element={<div>This is home</div>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/admin/*' element={<AdminPageComponent/>}/>
      </Routes>
  )
}

export default RouterComponent
