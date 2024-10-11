import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RouterComponent from './components/RouterComponent/RouterComponent'
import NavbarComponent from './components/NavbarComponent/NavbarComponent'
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const initialOptions = {
      clientId: "AY-w0A-44cu0sngWn5ZmX8_TpVwxua_6LMJWm0YWyiVlJfY4m4TF76m8_ruRVOqg8W93Ag71XJijqx1X",
      currency: "USD",
      intent: "capture",
  };

  axios.defaults.baseURL = "http://localhost:3500/api/v1"
  return (
    <PayPalScriptProvider options={initialOptions}>
      <BrowserRouter>
        <NavbarComponent/>
        <RouterComponent/>
      </BrowserRouter>
      <ToastContainer/>
    </PayPalScriptProvider>
    
  )
}

export default App
