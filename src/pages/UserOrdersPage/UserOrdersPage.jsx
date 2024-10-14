import axios from 'axios'
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

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
                          <Link to={`/products/${product?.productDetails?._id}`} key={index} className='flex items-start gap-4 border py-3 px-3 text-sm'>
                            <div className='h-24 w-[12%]'>
                              <img src={product?.productDetails?.imageUrls?.length > 0 ? product?.productDetails?.imageUrls?.[0] : "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"} className='border object-cover h-full w-full'/>
                            </div>
                            <div className='w-[50%] flex flex-col gap-1'>
                              <p className='text-sm text-ellipsis overflow-hidden whitespace-nowrap'>{product?.productDetails?.productName}</p>
                              <p className='text-xs text-gray-400  text-ellipsis overflow-hidden whitespace-nowrap'>{product?.productDetails?.productDescription}</p>
                              <div className='flex items-center gap-5'>
                                <p className='text-sm text-gray-500 py-3 capitalize'>Category: {product?.productDetails?.productType}</p>
                                <p className='text-sm text-gray-500 py-3'>Price: {formatRupees(product?.productDetails?.price)}</p>
                                <p className='text-sm text-gray-500 py-3'>{product?.quantity} {` ${product?.quantity <= 1 ? "No" : "Nos"}`}</p>
                              </div>
                            </div>
                            <div className='w-[15%] flex gap-2 items-center'>
                              <p className='text-sm'>{formatRupees(product?.price * product?.quantity)}</p>
                            </div>
                            <div className='w-[20%]'>
                              <p className='font-medium'>Delivery on {deliveryDate(order?.createdAt)}</p>
                              <p className='text-xs text-gray-500'>{`${order?.paymentInfo?.paymentStatus === "completed" ? "Your payment has been confirmed" : "Your payment is pending"}`}</p>
                              <p className='text-xs text-gray-500 capitalize'>{order?.paymentInfo?.paymentMethod === "cod" ? "Cash on delivery" : order?.paymentInfo?.paymentMethod}</p>
                            </div>
                          </Link>
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
