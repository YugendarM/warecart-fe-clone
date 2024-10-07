import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'antd' 
import { Link } from 'react-router-dom' 
import { TbLayoutDashboardFilled } from 'react-icons/tb' 
import { FaPlus } from 'react-icons/fa6' 
import axios from 'axios' 
import ProductCardComponent from '../../../components/ProductCardComponent/ProductCardComponent' 
import AddProductModal from '../../../components/Modals/AddProductModal/AddProductModal' 
import { getSocket, initiateSocketConnection } from '../../../utilities/socketService' 
import { IoSearch } from 'react-icons/io5' 
import OrderCardComponent from '../../../components/OrderCardComponent/OrderCardComponent' 


const AdminOrdersPage = () => {

  const [orderSearch, setOrderSearch] = useState("")
  const [isSortOrFilterApplied, setIsSortOrFilterApplied] = useState(false)
  const [ordersData, setOrdersData] = useState([])
  const [filteredOrdersData, setFilteredOrdersData] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const showModal = () => {
    setIsAddModalOpen(true) 
  } 

  const handleClear = () => {
    setIsSortOrFilterApplied(false)
    setOrderSearch("")
  }    

  const handleAddCancel = () => {
    setIsAddModalOpen(false)
  }


  useEffect(() => {
    const getOrdersData = async() => {
      try{
        const response = await axios.get(
          "order/",
          {
            withCredentials: true
          }
        )
        setFilteredOrdersData(response.data.data)
        setOrdersData(response.data.data)
      }
      catch (error) {
        console.error('Error fetching orders data:', error) 
      }
    }
    getOrdersData()
    
  },[])

  useEffect(() => {
    const searchQuery = orderSearch.trim().toLowerCase() 
    if(orderSearch.length !== 0){
      setIsSortOrFilterApplied(true)
    }
    else{
      setIsSortOrFilterApplied(false)
    }
    const filteredData = Array.isArray(ordersData) && ordersData.length > 0 &&
    ordersData.filter((order) =>
      order.user.firstName.toLowerCase().includes(searchQuery) ||
      order.products.some((product) => 
        product.product.productName.toLowerCase().includes(searchQuery)
      ) ||
      order.payableAmount.toString().includes(searchQuery)

    ) 
    setFilteredOrdersData(filteredData) 
  }, [orderSearch, ordersData])
  

  useEffect(() => {
    initiateSocketConnection()
    const socket = getSocket()

    socket.on("orderAdded", (addedOrder) => {
      setOrdersData((prevState) => [...prevState, addedOrder])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className='w-full'>
      <div className='breadcrum-container'>
        <Breadcrumb className='text-headerText text-base'
          items={[
            {
              title: <Link to={"/admin/dashboard"}><TbLayoutDashboardFilled className='text-xl'/></Link>,
            },
            {
              title: "Orders",
            },
          ]}
        />
      </div>

      <div className=' shadow-custom-medium rounded-md w-full flex flex-col h-[75vh]'>
        <div className='flex items-center justify-between px-5 py-5'>
          <h1 className='text-2xl font-medium text-headerText'>Orders</h1>
        </div>

        <div className=' search-filter-container  flex items-center justify-between px-5'>
          <div className='rounded-md py-1 px-2 shadow-custom-light flex items-center gap-2 w-1/2'>
            <IoSearch className='text-xl text-gray-400'/>
            <input 
              className=' focus:outline-none w-full' 
              type='search' 
              name='search' 
              placeholder='Search Order'
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.target.value)}
            />
          </div>
          <div className='flex items-center gap-4'>
            {/* <Space direction="vertical">
              <Space wrap>
                <Dropdown menu={sortMenu} placement="bottom" arrow className='border-none shadow-custom-light text-gray-500 w-28'>
                  <Button>{sortButtonContent ? sortButtonContent : "Sort by "}<IoChevronDown className='text-sm'/></Button>
                </Dropdown>
              </Space>
            </Space> */}
            <button 
              className={`flex items-center gap-2 rounded-md shadow-custom-light px-4 py-1.5 text-sm ${isSortOrFilterApplied ? "bg-primaryBlue text-white " : 'bg-white text-gray-300 cursor-not-allowed'}`}
              onClick={handleClear}
            > 
              Clear 
            </button>
          </div>
        </div>  

        <div className='px-5 w-full'>
          <div className='flex items-center border-b border-b-gray-400'>
            <h1 className='w-[17%] text-center py-3 px-4 text-sm font-semibold'>User</h1>
            <h1 className='w-[17%] text-center py-3 px-4 text-sm font-semibold'>Products</h1>
            <h1 className='w-[16%] text-center py-3 px-4 text-sm font-semibold'>Payable Amount</h1>
            <h1 className='w-[17%] text-center py-3 px-4 text-sm font-semibold'>Order Status</h1>
            <h1 className='w-[17%] text-center py-3 px-4 text-sm font-semibold'>Payment Method</h1>
            <h1 className='w-[17%] text-center py-3 px-4 text-sm font-semibold'>Payment Status</h1>
          </div>
          <div className='overflow-y-scroll h-[50vh] no-scrollbar'>
          {
            Array.isArray(filteredOrdersData) && filteredOrdersData.length > 0 ?
            filteredOrdersData?.map((order, index) => (
              <OrderCardComponent order={order} key={index} index={index}/>
            // <></>
            ))
            : <div>No data found</div>
          }
          </div>
        </div>  
      </div>

      {/* <AddProductModal handleAddCancel={handleAddCancel} isAddModalOpen={isAddModalOpen}/> */}
    </div>
  )
}

export default AdminOrdersPage
