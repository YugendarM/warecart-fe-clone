import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const UserProfilePage = () => {

    const navigate = useNavigate()

    const handleLogout = async() => {
        try{
            const response = await axios.post(
                '/user/logout',
                {}, 
            {
                withCredentials: true
            })
      
            if(response.status === 200){
              alert("User Loged out")
              navigate("/")
            }
            
          }
          catch (error) {
            if (error.response) {
              if (error.response.status === 500) {
                alert("An error occurred while Logging out");
              }
              else if (error.response.status === 204) {
                alert(`An error occurred: ${error.response.status} ${error.response.data.message}`);
              } else {
                alert(`An error occurred: ${error.response.status} ${error.response.data.message}`);
              }
            } else if (error.request) {
              alert("No response from server. Please try again.");
            } else {
              alert("An unexpected error occurred. Please try again.");
            }
          }
    }
  return (
    <div>
      UserProfilePage

      <button onClick={handleLogout}>Logout</button>
      <Link to={"/cart"}>Cart</Link>
    </div>
  )
}

export default UserProfilePage
