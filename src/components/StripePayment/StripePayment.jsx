import axios from 'axios'
import React, { useEffect, useState } from 'react'

const StripePayment = ({userData, cartAmount}) => {

    const handleStripePayment = async() => {
        try{
            const response = await axios.post("/payment/stripe/create-checkout-session", 
                {
                    cartAmount, 
                    userId: userData._id
                }
            )
            if(response.data.url){
                window.location.href = response.data.url
            }
            else{
                toast.error("Url not found")
            }
        }
        catch(error){
            console.error(error)
        }
    }

  return (
    <button onClick={handleStripePayment} className='text-white bg-blue-700 px-2 py-4 rounded-md'>Stripe Payment</button>
  )
}

export default StripePayment
