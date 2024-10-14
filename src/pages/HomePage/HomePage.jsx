import React, { useEffect, useState } from 'react'
import landerbg from "../../assets/landing_bg.jpg"
import { FaArrowRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import axios from 'axios'

const HomePage = () => {

  const [topProducts, setTopProducts] = useState([])

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0, 
    }).format(amount);
    };

  const getTopProducts = async() => {
    try{
      const response = await axios.get(
        "/userActivity/analytics/top-performing-products",
        {
          withCredentials: true
        }
      )
      if(response.status === 200){
        setTopProducts(response.data)
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
    getTopProducts()
  }, [])

  return (
    <div className='absolute'>
      <img src={landerbg} className='h-screen w-screen relative -top-20 -z-20 ' />
      <div className='absolute top-36 left-0 px-5 md:px-20 lg:px-56 flex flex-col gap-5 w-full'>
        <h1 className='text-6xl  text-gray-800'>Online Shopping</h1>
        <h4 className='text-xl  text-gray-800 max-w-[600px]'>Shop the best, straight from the source. Quality products, great prices, and effortless shopping—all in one place.</h4>
        <Link to={"/products"} className='bg-blue-400 rounded-full text-white px-5 py-2 w-48 flex items-center justify-center gap-4 hover:bg-blue-300'>Explore Now <FaArrowRight /></Link>
      </div>

      <div className='px-5 md:px-20 lg:px-56 flex flex-col gap-5'>
        <h1 className='text-2xl font-medium'>Top Products</h1>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 z-40'>
        {
          topProducts?.length > 0 &&
          topProducts?.map((product, index) => (
            <Link key={index} to={`/products/${product?._id}`} className='shadow-custom-medium rounded-sm'>
              <div className='h-40 w-full'>
                <img className="h-full w-full object-cover border " src={product?.imageUrls?.length>0 ? product?.imageUrls?.[0] :"https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"}/>
              </div>
              <div className='px-4 py-4'>
                <p className='text-lg font-medium whitespace-nowrap text-ellipsis overflow-hidden'>{product?.productName}</p>
                <p className='text-sm text-gray-400 font-normal whitespace-nowrap text-ellipsis overflow-hidden'>{product?.productDescription}</p>
                <p className='text-base text-gray-800 font-medium text-end pt-3'>{formatRupees(product?.price)}</p>
              </div>
            </Link>
          ))
        }
        </div>
      </div>

      <div className='px-5 md:px-20 lg:px-56 flex items-center gap-5 z-50'>
        <div className='h-[500px]'>
          <img className='h-full' src='https://static.vecteezy.com/system/resources/previews/012/714/985/non_2x/best-deal-banner-label-icon-flat-design-illustration-on-white-background-vector.jpg'/>
        </div>
        <div className='flex flex-col gap-6'>
          <p className='text-3xl max-w-[500px]'>Grab the best deals of the sale. Get Exciting offers on all products.</p>
          <Link to={"/products"} className='bg-blue-400 rounded-full text-white px-5 py-2 w-48 flex items-center justify-center gap-4 hover:bg-blue-300'>Shop Now <FaArrowRight /></Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
