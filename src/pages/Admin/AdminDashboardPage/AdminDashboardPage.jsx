import axios from 'axios' 
import React, { useEffect, useState } from 'react'
import { IoEye } from "react-icons/io5" 
import { VscVerifiedFilled } from "react-icons/vsc" 
import { FaHeart } from "react-icons/fa6" 
import { IoBagHandle } from "react-icons/io5" 
import { HiUserGroup } from "react-icons/hi2" 
import { BsChevronDown, BsChevronUp } from 'react-icons/bs' 
import { Link, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie' 
import CategoryPieCharts from '../../../components/Charts/CategoryPieCharts/CategoryPieCharts' 
import MonthwishPurchasedBarChart from '../../../components/Charts/MonthwishPurchasedBarChart/MonthwishPurchasedBarChart' 
import MonthwisePurchaseLineChart from '../../../components/Charts/MonthwisePurchaseLineChart/MonthwisePurchaseLineChart' 
import TopPerformingProductsBarChart from '../../../components/Charts/TopPerformingProductsBarChart/TopPerformingProductsBarChart' 
import ProductPopularityByRegion from '../../../components/Charts/ProductPopularityByRegion/ProductPopularityByRegion' 

const AdminDashboardPage = () => {

  const [analyticsData, setAnalyticsData] = useState({ views: [], addToCarts: [], purchases: [] }) 
  const [tabContext, setTabContext] = useState("users")
  const [optionOpen, setOptionOpen] = useState(false)
  const [option, setOption] = useState("Today")
  const [averageProductViews, setAverageProductViews] = useState(0)
  const [bestSellingProduct, setBestSellingProduct] = useState({})
  const [mostLikedProduct, setMostLikedProduct] = useState({})
  const [usersAndProductsCount, setUsersAndProductsCount] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false) 

  const {pathname} = useLocation()

  const getAverageProductView = async() => {
    try{
      const response = await axios.get(
        "/userActivity/analytics/average-views",
        {
          withCredentials: true
        }
      )
      if(response.status === 200){
          setAverageProductViews(response.data.averageViews)
      }
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          alert("An error occurred while fetching average product views") 
        } else {
          alert(`An error occurred: ${error.response.status} ${error.response.data.message}`) 
        }
      } else if (error.request) {
        alert("No response from server. Please try again.") 
      } else {
        alert("An unexpected error occurred. Please try again.") 
      }
    }
  }

  const getBestSellingProduct = async() => {
    try{
      const response = await axios.get(
        "/userActivity/analytics/best-selling-product",
        {
          withCredentials: true
        }
      )

      if(response.status === 200){
        setBestSellingProduct(response.data)
      }
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          alert("An error occurred while fetching best selling product") 
        } else {
          alert(`An error occurred: ${error.response.status} ${error.response.data.message}`) 
        }
      } else if (error.request) {
        alert("No response from server. Please try again.") 
      } else {
        alert("An unexpected error occurred. Please try again.") 
      }
    }
  }

  const getMostLikedProduct = async() => {
    try{
      const response = await axios.get(
        "/userActivity/analytics/most-liked-product",
        {
          withCredentials: true
        }
      )

      if(response.status === 200){
        setMostLikedProduct(response.data)
      }
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          alert("An error occurred while fetching most liked product") 
        } else {
          alert(`An error occurred: ${error.response.status} ${error.response.data.message}`) 
        }
      } else if (error.request) {
        alert("No response from server. Please try again.") 
      } else {
        alert("An unexpected error occurred. Please try again.") 
      }
    }
  }

  const getProductsAndUsersCount = async() => {
    try{
      const response = await axios.get(
        "/userActivity/analytics/counts",
        {
          withCredentials: true
        }
      )

      if(response.status === 200){
        setUsersAndProductsCount(response.data)
      }
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          alert("An error occurred while fetching product and user count") 
        } else {
          alert(`An error occurred: ${error.response.status} ${error.response.data.message}`) 
        }
      } else if (error.request) {
        alert("No response from server. Please try again.") 
      } else {
        alert("An unexpected error occurred. Please try again.") 
      }
    }
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response = await axios.get('/userActivity/analytics', 
        {
          withCredentials: true
        }
      ) 
      setAnalyticsData(response.data) 
    } 
    fetchAnalytics() 
    if(isLoggedIn){
      getAverageProductView()
      getBestSellingProduct()
      getMostLikedProduct()
      getProductsAndUsersCount()
    }
  }, [isLoggedIn]) 

  useEffect(() => {
    const sessionToken = Cookies.get('SessionID') 
    if (sessionToken) {
      setIsLoggedIn(true) 
    } else {
      setIsLoggedIn(false) 
    }
  }, [pathname])   

  return (
    <div className='flex flex-col gap-10 w-full h-[95vh] py-5 md:py-5 overflow-y-scroll no-scrollbar px-5'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ga w-full gap-6'>
        <div className='rounded-lg hover:transform hover:-translate-y-2 transition shadow-custom-medium hover:shadow-custom-heavy p-5 w-full flex flex-col gap-3'>
            <IoEye className='text-primaryBlue text-3xl'/>
            <h1 className='text-lg font-bold'>Average Product Views</h1>
            <div className='flex flex-col gap-2'>
              <p className='font-medium text-2xl'>{averageProductViews}<span className='font-medium text-xs text-gray-500'> views per product</span></p>
            </div>
        </div>

        <Link 
        to={
          option === "Today" ? `/admin/product/${bestSellingProduct?.bestSellingToday ? bestSellingProduct?.bestSellingToday?.productDetails?._id : null}` : 
          option === "This Month" ? `/admin/product/${bestSellingProduct?.bestSellingMonth ? bestSellingProduct?.bestSellingMonth?.productDetails?._id : null}` :  
          option === "This Year" ? `/admin/product/${bestSellingProduct?.bestSellingYear ? bestSellingProduct?.bestSellingYear?.productDetails?._id : null}` :  
          null
        } 
        className='relative rounded-lg hover:transform hover:-translate-y-2 transition shadow-custom-medium hover:shadow-custom-heavy p-5 w-full flex flex-col gap-3'>
            <VscVerifiedFilled className='text-primaryBlue text-3xl'/>
            <h1 className='text-lg font-bold'>Best selling Product</h1>
            {
              option && option === "Today" ? 
              ( bestSellingProduct?.bestSellingToday?.productDetails?
                <div className='flex flex-col'>
                  <p className='font-semibold text-gray-800 text-2xl'>{bestSellingProduct?.bestSellingToday?.productDetails?.productName}</p>
                  <div className='flex items-center justify-between'>
                    <p className='font-normal text-gray-500 text-sm'>{bestSellingProduct?.bestSellingToday?.productDetails?.productDescription}</p>
                    <p className='font-normal text-gray-500 text-sm'><span className='text-lg font-medium text-gray-800'>{bestSellingProduct?.bestSellingToday?.totalSales}</span> Purchases</p>
                  </div>
                </div>
                :
                <p className='text-gray-500'>No Sales Today</p>
              )
              :
              option && option === "This Month" ?
              ( bestSellingProduct?.bestSellingMonth?.productDetails?
                <div className='flex flex-col'>
                  <p className='font-semibold text-gray-800 text-2xl'>{bestSellingProduct?.bestSellingMonth?.productDetails?.productName}</p>
                  <div className='flex items-center justify-between'>
                    <p className='font-normal text-gray-500 text-sm'>{bestSellingProduct?.bestSellingMonth?.productDetails?.productDescription}</p>
                    <p className='font-normal text-gray-500 text-sm'><span className='text-lg font-medium text-gray-800'>{bestSellingProduct?.bestSellingMonth?.totalSales}</span> Purchases</p>
                  </div>
                </div>
                :
                <p className='text-gray-500'>No Sales This Month</p>
              )
              :
              option && option === "This Year" ? 
              ( bestSellingProduct?.bestSellingYear?.productDetails?
                <div className='flex flex-col'>
                  <p className='font-semibold text-gray-800 text-2xl'>{bestSellingProduct?.bestSellingYear?.productDetails?.productName}</p>
                  <div className='flex items-center justify-between'>
                    <p className='font-normal text-gray-500 text-sm'>{bestSellingProduct?.bestSellingYear?.productDetails?.productDescription}</p>
                    <p className='font-normal text-gray-500 text-sm'><span className='text-lg font-medium text-gray-800'>{bestSellingProduct?.bestSellingYear?.totalSales}</span> Purchases</p>
                  </div>
                </div>
                :
                <p className='text-gray-500'>No Sales This Year</p>
              )

              : null
            }
            <div className='absolute -top-4 right-6'>
              <button className=' bg-primaryBlue justify-between text-white rounded-md px-4 py-1.5 flex items-center font-medium w-36 text-center' 
                      onClick={(event) => {
                        event.preventDefault()
                        setOptionOpen((prev) => !prev)
                      }}>
                {option} <span>{optionOpen ? <BsChevronUp/> : <BsChevronDown />}</span>
              </button>
              {
                optionOpen && 
                <div className='flex flex-col text-xs font-medium bg-white shadow-md rounded-md border my-2'>
                  {
                    ["Today", "This Month", "This Year"].map((option, index) => (
                      <button key={index} className='hover:bg-primaryBlue text-left px-2 w-full py-1 hover:text-white' 
                              onClick={(event) => {
                                event.preventDefault()
                                setOption(option)  
                                setOptionOpen(false)
                              } }>{option}</button>
                    ))
                  }
                </div>
              }
            </div>
        </Link>

        <Link to={`/admin/product/${mostLikedProduct?.productDetails ? mostLikedProduct.productDetails._id : null}`} className='rounded-lg hover:transform hover:-translate-y-2 transition shadow-custom-medium hover:shadow-custom-heavy p-5 w-full flex flex-col gap-3'>
            <FaHeart className='text-primaryBlue text-2xl'/>
            <h1 className='text-lg font-bold'>Most liked</h1>
            <div className='flex flex-col'>
              <p className='font-semibold text-gray-800 text-2xl'>{mostLikedProduct?.productDetails?.productName}</p>
              <div className='flex items-center justify-between'>
                <p className='font-normal text-gray-500 text-sm'>{mostLikedProduct?.productDetails?.productDescription}</p>
                <p className='font-normal text-gray-500 text-sm'><span className='text-lg font-medium text-gray-800'>{mostLikedProduct?.wishlistCount}</span> Counts</p>
              </div>
            </div>
        </Link>

        <div className='rounded-lg hover:transform hover:-translate-y-2 transition shadow-custom-medium hover:shadow-custom-heavy p-5 w-full flex flex-col gap-2'>
            <div className='flex items-center justify-around'>
              <HiUserGroup className='text-primaryBlue text-2xl w-1/2 cursor-pointer' onClick={() => setTabContext("users")}/>
              <IoBagHandle className='text-primaryBlue text-2xl w-1/2 cursor-pointer' onClick={() => setTabContext("products")}/>
            </div>
            <div className='flex'>
              <div className={`w-1/2 h-[3px] transition ${tabContext === "users" ? "bg-primaryBlue" : null}`}></div>
              <div className={`w-1/2 h-[3px] transition ${tabContext === "products" ? "bg-primaryBlue" : null}`}></div>
              <div></div>
            </div>
            <h1 className='text-lg font-bold capitalize'>{tabContext}</h1>
            <div className='flex flex-col gap-2'>
              <p className='text-4xl font-extrabold text-gray-500'>{tabContext === "users" ? usersAndProductsCount?.numberOfUsers : usersAndProductsCount?.numberOfProducts}</p>
            </div>
        </div>
      </div>

      <div className='flex flex-col gap-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-6'>
          <div className='flex flex-col bg-white shadow-custom-medium rounded-lg p-6 gap-3'>
            <h1 className='text-2xl font-semibold text-left'>Purchase based on Categories</h1>
            <CategoryPieCharts/>
          </div>

          <div className='flex flex-col bg-white shadow-custom-medium rounded-lg p-6 gap-3'>
            <h1 className='text-2xl font-semibold text-left'>Monthly Product Activity</h1>
            {/* <MonthwisePurchaseLineChart/> */}
            <MonthwishPurchasedBarChart/>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-6'>
          <div className='flex flex-col bg-white shadow-custom-medium rounded-lg p-6 gap-3'>
            <h1 className='text-2xl font-semibold text-left'>Top Performing Products</h1>
            <TopPerformingProductsBarChart/>
          </div>

          <div className='flex flex-col bg-white shadow-custom-medium rounded-lg p-6 gap-3'>
            <h1 className='text-2xl font-semibold text-left'>Products Popularity By Region </h1>
            <ProductPopularityByRegion/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
