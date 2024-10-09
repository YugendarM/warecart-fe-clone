import axios from 'axios'
import React, {useState, useEffect} from 'react'

const UserOrdersPage = () => {

  const [orderData, setOrderData] = useState([])

  const getOrderDetails = async() => {
    try{
      const response = await axios.get(
        "/order/user",
        {
          withCredentials: true
        }
      )
      console.log(response)
      if(response.status === 200){
        setOrderData(response.data)
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

  useEffect(() => {
    getOrderDetails()
  }, [])

  return (
    <div className='px-5 md:px:20 lg:px-56 py-10'>
      <h1>Your Orders</h1>

      {
        orderData?.length > 0 ?
        <div >

        </div>
        
        :

        <div>
          <h1>No orders yet</h1>
        </div>
      }
    </div>
  )
}

export default UserOrdersPage
