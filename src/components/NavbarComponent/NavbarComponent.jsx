import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie';
import logo from "../../assets/warecart_logo.png"

const NavbarComponent = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {pathname} = useLocation()

  useEffect(() => {
    const sessionToken = Cookies.get('SessionID');
    if (sessionToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]);  

  return (
    <div className={`z-30 w-full flex px-5 md:px-20 lg:px-56 py-2 items-center justify-between ${pathname === "/" ? null : "bg-blue-50"}`}>
      <Link to={"/"}>
        <img src={logo} className='h-20 w-20'/>
      </Link>
      <div>
        <nav className='md:flex items-center gap-8 hidden '>
          <Link to={"/"} className={`text-lg font-medium py-2 transition ${pathname === "/" ? "text-blue-600 " : "text-gray-800 border-none"}`}>Home</Link>
          <Link to={"/products"} className={`text-lg font-medium py-2 transition ${pathname.includes("/products") ? "text-blue-600 " : "text-gray-800 border-none"}`}>Products</Link>
          {
            isLoggedIn ? 
            <>
              <Link to={"/wishlist"} className={`text-lg font-medium py-2 transition ${pathname.includes("/wishlist") ? "text-blue-600 " : "text-gray-800 border-none"}`}>Wishlist</Link>
              <Link to={"/profile"} className={`text-lg font-medium py-2 transition ${pathname.includes("/profile") ? "text-blue-600 " : "text-gray-800 border-none"}`}>Profile</Link>
            </>
            :
            <>
              <Link to={"/login"} className={`text-lg font-medium py-2 transition ${pathname.includes("/login") ? "text-blue-600 " : "text-gray-800 border-none"}`}>Login</Link>
              <Link to={"/signup"} className={`text-lg font-medium py-2 transition ${pathname.includes("/signup") ? "text-blue-600 " : "text-gray-800 border-none"}`}>Signup</Link>
            </>
          }
        </nav>
      </div>
    </div>
  )
}

export default NavbarComponent
