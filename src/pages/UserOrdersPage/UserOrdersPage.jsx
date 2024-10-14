import axios from 'axios'
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import ReviewModal from '../../components/Modals/ReviewModal/ReviewModal'
import OrdersPageProductCard from '../../components/OrdersPageProductCard/OrdersPageProductCard'

const UserOrdersPage = () => {

  const [orderData, setOrderData] = useState([])

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(amount) 
  }

  function formatOrderDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  }

  function deliveryDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    const options = { month: 'short', day: '2-digit' };
    const newDate = date.toLocaleDateString('en-US', options);  
    return newDate;
  }
  
  const handleReviewProduct = async(event) => {
    event.preventDefault()
    setIsReviewModalOpen(true)
  }

  const handleModalClose = () => {
    setIsReviewModalOpen(false)
  }

  const getOrderDetails = async() => {
    try{
      const response = await axios.get(
        "/order/user",
        {
          withCredentials: true
        }
      )
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
      <h1 className='text-3xl font-medium pb-4'>Your Orders</h1>

      {
        orderData?.length > 0 ?
        <div className='flex flex-col gap-5'>
          {
            orderData?.map((order, index) => (
              <div key={index}>
                <div className='flex flex-col gap-5 bg-white shadow-custom-medium px-3 py-5'>
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-2'>
                      <p className='line-through text-gray-500'>{formatRupees((order?.totalAmount + order?.platformFee))}</p>
                      <p>{formatRupees(order?.payableAmount)}</p>
                    </div>
                    <p>Order placed on {formatOrderDate(order?.createdAt)}</p>
                  </div>
                  {
                    order?.products?.length > 0 &&
                    <div className='flex flex-col gap-4'>
                      {
                        order?.products?.map((product, index) => (
                          <OrdersPageProductCard product={product} order={order} key={index}/>
                        ))
                      }
                    </div>
                  }
                </div>
              </div>
              ))
          }
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
