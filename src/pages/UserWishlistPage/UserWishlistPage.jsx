import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserProductCard from '../../components/UserProductCard/UserProductCard'
import { getSocket, initiateSocketConnection } from '../../utilities/socketService'
import { toast } from 'react-toastify'

const UserWishlistPage = () => {

  const [wishlistData, setWishlistData] = useState([])
  const [userData, setUserData] = useState([])

  const isProductWishListed = (productId) =>{
    if(userData?.wishlist){
      return userData.wishlist.includes(productId)
    }
  }

  useEffect(() => {
    const getAllWishlistedProducts = async() => {
      try{
        const response = await axios.get(
          "/user/wishlist",
          {
            withCredentials: true
          }
        )

        if(response.status === 200){
          setWishlistData(response.data.data)
        }
        
      }
      catch (error) {
        if (error.response) {
          if (error.response.status === 500) {
            console.error("An error occurred while fetching order data");
          } else {
            console.error(`An error occurred: ${error.response.status} ${error.response.data.message}`);
          }
        } else if (error.request) {
          console.error("No response from server. Please try again.");
        } else {
          console.error("An unexpected error occurred. Please try again.");
        }
      }
    }

    const getUserData = async() => {
      try{
        const response = await axios.get(
          "/user/getUserDetails",
          {
            withCredentials: true
          }
        )
  
        if(response.status === 200){
          setUserData(response.data)
        }
        
      }
      catch (error) {
        if (error.response) {
          if (error.response.status === 500) {
            toast.error("An error occurred while fetching User data");
          } else {
            toast.error(`An error occurred: ${error.response.status} ${error.response.data.message}`);
          }
        } else if (error.request) {
          toast.error("No response from server. Please try again.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
      
  }

    getUserData() 
    getAllWishlistedProducts()
  }, [])

  useEffect(() => {
    initiateSocketConnection()
    const socket = getSocket()

    socket.on("wishlistUpdated", (updatedWishlist) => {
      setWishlistData(updatedWishlist)
    })

    return () => {
        socket.disconnect()
    }
    
}, [])


  return (
    <div className='px-5 md:px:20 lg:px-56 py-10'>
      {
        wishlistData && Array.isArray(wishlistData) && wishlistData.length > 0 ?

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 py-10'>
          {
              wishlistData?.map((product, index) => (
                  <UserProductCard isProductWishListed={isProductWishListed(product._id)} key={index} product={product}/>
              ))
          }
        </div>

        :

        <div className='flex flex-col justify-center items-center h-[70vh] w-full'>
          <p className='text-2xl font-semibold'>No products found on wishlist</p>
          <Link to={"/products"} className='text-blue-500 hover:text-blue-300 underline text-lg '>Explore Products</Link>
        </div>
      }
    </div>
  )
}

export default UserWishlistPage
