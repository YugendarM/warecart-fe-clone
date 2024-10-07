import React, { useEffect, useState } from 'react'
import OrderSummaryProductCardComponent from '../../components/OrderSummaryProductCardComponent/OrderSummaryProductCardComponent'
import axios from 'axios'
import { getSocket, initiateSocketConnection } from '../../utilities/socketService'
import { useNavigate } from 'react-router-dom'

const UserCartPage = () => {
  const [orderDetails, setOrderDetails] = useState({}) 
  const [cartItemData, setCartItemData] = useState([]) 
  const [productsData, setProductsData] = useState([]) 

  const navigate = useNavigate()

  const handleQuantityChange = (productId, newQuantity) => {
    setProductsData((prevProducts) =>
      prevProducts.map((product) =>
        product.productDetails._id === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    ) 
  } 

  const getPriceDetails = async () => {
    try {
      const response = await axios.post(
        `/order/priceDetails`,
        { orderItems: productsData },
        {
          withCredentials: true,
        }
      ) 

      if (response.status === 200) {
        setOrderDetails(response.data) 
      }
    } catch (error) {
      handleError(error, "price details") 
    }
  } 

  const getAllCartItems = async () => {
    try {
      const response = await axios.get("/user/cartItems", {
        withCredentials: true,
      }) 

      if (response.data && response.data.data) {
        setCartItemData(response.data.data) 
        setProductsData(
          response.data.data.map((item) => ({
            productDetails: item,
            quantity: 1, 
          }))
        ) 
      } else {
        alert("No cart items found.") 
      }
    } catch (error) {
      handleError(error, "cart details") 
    }
  } 

  const handleError = (error, context) => {
    if (error.response) {
      const message = error.response.data.message || "Something went wrong" 
      alert(`Error fetching ${context}: ${error.response.status} ${message}`) 
    } else if (error.request) {
      alert(`No response from server for ${context}. Please try again.`) 
    } else {
      alert(`Unexpected error in fetching ${context}.`) 
    }
  } 

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
          products: productsData
      }
  })
  }

  const formatRupees = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount) 
  } 

  useEffect(() => {
    if (cartItemData.length > 0 && productsData.length > 0) {
      getPriceDetails() 
    }
  }, [productsData]) 

  useEffect(() => {
    getAllCartItems() 
  }, []) 

  useEffect(() => {
    initiateSocketConnection() 
    const socket = getSocket() 

    socket.on("cartUpdated", (updatedCart) => {
      setCartItemData(updatedCart) 
      setProductsData(
        updatedCart.map((item) => ({
          productDetails: item,
          quantity: 1, 
        }))
      ) 
    }) 

    return () => {
      socket.disconnect() 
    } 
  }, []) 

  return (
    <div className="px-56 flex gap-5 py-10 w-full">
      <div className="flex flex-col gap-4 shadow-custom-medium rounded-sm px-5 py-5 w-[70%]">
        <div className="flex flex-col ">
          <div className="flex items-center gap-4">
            <h3 className="text-gray-400 font-semibold">ORDER SUMMARY</h3>
          </div>
          <div className="py-5 flex flex-col gap-10">
            {orderDetails?.orderItems?.length > 0 ? (
              orderDetails.orderItems.map((productData, index) => (
                <OrderSummaryProductCardComponent
                  onQuantityChange={handleQuantityChange}
                  key={index}
                  productData={productData}
                />
              ))
            ) : (
              <h1 className='font-medium py-3'>No products in the cart</h1>
            )}
          </div>
        </div>
        {
          orderDetails?.orderItems?.length > 0 &&
          <div className="flex justify-end">
            <button onClick={handleCheckout} className={`rounded-sm px-6 py-2 transition bg-yellow-500 text-white hover:bg-yellow-300`}>CHECKOUT</button>
          </div>
        }
      </div>

      <div className="shadow-custom-medium rounded-sm flex flex-col w-[30%] h-full min-h-60 sticky top-10">
        <h1 className="text-gray-400 font-semibold border-b px-5 py-5 border-b-gray-200 w-full">
          PRICE DETAILS
        </h1>
        {
          orderDetails?.orderItems?.length > 0 ?
          <div className='h-full'>
            <div className="border-b border-b-gray-200 flex flex-col gap-4 py-5 ">
              <div className="flex items-center justify-between px-5">
                <p>Price ({cartItemData?.length} item)</p>
                <p>
                  {orderDetails?.priceDetails &&
                    formatRupees(orderDetails.priceDetails.totalPrice)}
                  /-
                </p>
              </div>
              {orderDetails?.priceDetails?.totalDiscount > 0 && (
                <div className="flex items-center justify-between px-5">
                  <p>Discounts</p>
                  <p className="text-green-500">
                    - {formatRupees(orderDetails.priceDetails.totalDiscount)}/-
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between px-5">
                <p>Delivery Charge</p>
                <p className="text-green-500">FREE</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-5 border-b border-b-gray-200">
              <p>Platform Fee</p>
              <p>
                {orderDetails?.priceDetails &&
                  formatRupees(orderDetails.priceDetails.platformFee)}
                /-
              </p>
            </div>
            <div className="flex items-center justify-between px-5 py-5 border-b-gray-200">
              <p className="font-semibold text-base">Total Payable</p>
              <p>
                {orderDetails?.priceDetails &&
                  formatRupees(orderDetails.priceDetails.totalPayable)}
                /-
              </p>
            </div>
            {orderDetails?.priceDetails?.totalSavings > 0 && (
              <div className="flex items-center justify-between px-5 py-5 border-b-gray-200">
                <p className="font-medium text-base text-center w-full text-green-500">
                  You will save{" "}
                  {formatRupees(orderDetails.priceDetails.totalSavings)}/- on this
                  order
                </p>
              </div>
            )}            
            </div>

            :

            <div className='w-full text-center font-medium py-3'>No products in the cart</div>
          }                               
      </div>
    </div>
  ) 
} 

export default UserCartPage 
