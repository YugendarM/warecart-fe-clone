import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminPageComponent from '../../pages/Admin/AdminPageComponent/AdminPageComponent'

const RouterComponent = () => {
  return (
    <Routes>
        <Route exact path='/' element={<div>This is home</div>}/>
        <Route path='/admin/*' element={<AdminPageComponent/>}>
            
        </Route>
      </Routes>
  )
}

export default RouterComponent
