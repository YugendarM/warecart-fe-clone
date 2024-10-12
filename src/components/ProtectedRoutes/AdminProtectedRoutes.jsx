import axios from "axios"  
import React, { useEffect, useState } from "react"  
import { Outlet, Navigate } from "react-router-dom"  

const AdminProtectedRoutes = () => {
  const [user, setUser] = useState(null)   
  const [loading, setLoading] = useState(true)    

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get("/user/getUserDetails", { withCredentials: true })  
        if (response.status === 200) {
            setUser(response.data)   
        }
      } catch (error) {
        if (error.response) {
        }
      } finally {
        setLoading(false)   
      }
    }  

    getUserDetails()  
  }, [])  

  if (loading) {
    return <div className="flex justify-center items-center w-screen h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-[6px] border-blue-500 border-b-gray-300"></div>
            </div>    
  }

  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/" />  
}  

export default AdminProtectedRoutes  
