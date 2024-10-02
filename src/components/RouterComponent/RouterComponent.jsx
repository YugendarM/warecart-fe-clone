import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminPageComponent from '../../pages/Admin/AdminPageComponent/AdminPageComponent'
import LoginPage from '../../pages/LoginPage/LoginPage'
import SignupPage from '../../pages/SignupPage/SignupPage'
import UserProductsPage from '../../pages/UserProductsPage/UserProductsPage'
import HomePage from '../../pages/HomePage/HomePage'
import UserProductOverviewPage from '../../pages/UserProductOverviewPage/UserProductOverviewPage'
import UserCheckOutPage from '../../pages/UserCheckOutPage/UserCheckOutPage'
import UserWishlistPage from '../../pages/UserWishlistPage/UserWishlistPage'
import UserProfilePage from '../../pages/UserProfilePage/UserProfilePage'
import UserOrdersPage from '../../pages/UserOrdersPage/UserOrdersPage'
import UserCartPage from '../../pages/UserCartPage/UserCartPage'

const RouterComponent = () => {
  return (
    <Routes>
        <Route exact path='/' element={<HomePage/>}/>
        <Route exact path='/products' element={<UserProductsPage/>}/>
        <Route exact path='/products/:productId' element={<UserProductOverviewPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/wishlist' element={<UserWishlistPage/>}/> 
        <Route path='/profile' element={<UserProfilePage/>}/> 
        <Route path='/orders' element={<UserOrdersPage/>}/> 
        <Route path='/cart' element={<UserCartPage/>}/> 
        <Route path='/checkout' element={<UserCheckOutPage/>}/>
        <Route path='/admin/*' element={<AdminPageComponent/>}/>
      </Routes>
  )
}

export default RouterComponent
