import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RouterComponent from './components/RouterComponent/RouterComponent'
import NavbarComponent from './components/NavbarComponent/NavbarComponent'
import axios from 'axios';

const App = () => {


  axios.defaults.baseURL = "http://localhost:3500/api/v1"
  return (
    <BrowserRouter>
      <NavbarComponent/>
      <RouterComponent/>
    </BrowserRouter>
  )
}

export default App
