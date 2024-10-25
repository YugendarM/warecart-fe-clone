import React, { useState } from "react" 
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js" 
import { useNavigate } from "react-router-dom" 
import axios from "axios" 
import { toast } from "react-toastify"

function PaypalPayment({cartAmount, orderDetails}) {


  const navigate = useNavigate()

  const processOrder = async(transactionId) => {
    const orderData = {
      products: orderDetails.orderItems.map((item) => {
        return {
          product: item.productDetails._id,
          quantity: item.quantity,
          price: item.productDetails.price
        }
      }),
        platformFee: orderDetails.priceDetails.platformFee,
        totalAmount: orderDetails.priceDetails.totalPrice,
        discountedAmount: orderDetails.priceDetails.totalDiscount,
        payableAmount : orderDetails.priceDetails.totalPayable,
        paymentInfo: {
          paymentMethod: "paypal",
          paymentStatus: "completed",
          transactionId: transactionId
        }
    }

    try {
      const response = await axios.post(`/order/add`, 
        orderData,
        { withCredentials: true }) 

        if (response.status === 201) {
          toast.success('Order placed Successfully') 
            navigate("/orders")
          try {
            await Promise.all(orderDetails.orderItems.map(item =>
              axios.post(
                '/userActivity/track',
                {
                  action: 'purchase',
                  productId: item.productDetails._id, 
                  additionalInfo: { quantity: item.quantity, paymentMethod: paymentMethod },
                },
                {
                  withCredentials: true,
                }
              )
            )) 
            
          } catch (error) {
            console.error('Error tracking user activity:', error) 
          }
        }
    } catch (error) {
        if (error.response) {
          toast.error(`Error while placing the order: ${error.response.status} - ${error.response.data.message}`) 
        } else {
          toast.error("An unexpected error occurred while placing the order. Please try again.") 
        }
    }

}

  return (
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={async () => {
          return fetch(`http://localhost:3500/api/v1/payment/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cart: orderDetails.priceDetails?.totalPayable,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data?.id) {
                return data.id 
              }
              throw new Error("Failed to create order") 
            })
            .catch((error) => {
              console.error("Error creating order:", error) 
            }) 
        }}
        onApprove={async (data, actions) => {
          try {
            const response = await fetch(
              `http://localhost:3500/api/v1/payment/api/orders/${data.orderID}/capture`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            ) 
        
            const orderData = await response.json() 
        
            const errorDetail = orderData?.details?.[0] 
        
            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
              return actions.restart() 
            } 
            else if (errorDetail) {
              throw new Error(`${errorDetail.description} (${orderData.debug_id})`) 
            } 
            else {
              const transaction = orderData.purchase_units[0].payments.captures[0] 
              if(transaction.status === "COMPLETED"){
                processOrder(transaction.id)
                
              }
            }
          } catch (error) {
            console.error(error) 
          }
        }}
        
      />
  ) 
}

export default PaypalPayment 
