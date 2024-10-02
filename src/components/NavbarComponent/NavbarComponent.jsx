import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie';

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
    <div className='h-20 bg-blue-50 w-full flex px-5 md:px-20 lg:px-56 py-5 items-center justify-between'>
      <Link to={"/"}>
        <h1 className='text-2xl font-bold'>WareCart</h1>
      </Link>
      <div>
        <nav className='md:flex items-center gap-8 hidden '>
          <Link to={"/"} className={`text-xl font-semibold py-2 transition ${pathname === "/" ? "text-blue-600 border-b-[3px] border-b-blue-600" : "text-gray-800 border-none"}`}>Home</Link>
          <Link to={"/products"} className={`text-xl font-semibold py-2 transition ${pathname.includes("/products")  ? "text-blue-600 border-b-[3px] border-b-blue-600" : "text-gray-800 border-none"}`}>Products</Link>
          {
            isLoggedIn ? 
            <>
              <Link to={"/wishlist"} className={`text-xl font-semibold py-2 transition ${pathname.includes("/wishlist") ? "text-blue-600 border-b-[3px] border-b-blue-600" : "text-gray-800 border-none"}`}>Wishlist</Link>
              <Link to={"/profile"} className={`text-xl font-semibold py-2 transition ${pathname.includes("/profile") ? "text-blue-600 border-b-[3px] border-b-blue-600" : "text-gray-800 border-none"}`}>Profile</Link>
            </>
            :
            <>
              <Link to={"/login"} className={`text-xl font-semibold py-2 transition ${pathname.includes("/login") ? "text-blue-600 border-b-[3px] border-b-blue-600" : "text-gray-800 border-none"}`}>Login</Link>
              <Link to={"/signup"} className={`text-xl font-semibold py-2 transition ${pathname.includes("/signup") ? "text-blue-600 border-b-[3px] border-b-blue-600" : "text-gray-800 border-none"}`}>signup</Link>
            </>
          }
        </nav>
      </div>
    </div>
  )
}

export default NavbarComponent
