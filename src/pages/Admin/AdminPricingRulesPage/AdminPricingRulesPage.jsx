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
import PricingRuleCardComponent from '../../../components/PricingRuleCardComponent/PricingRuleCardComponent' 
import PricingRuleAddModal from '../../../components/Modals/PricingRuleAddModal/PricingRuleAddModal' 


const AdminPricingRulesPage = () => {

  const [pricingRuleSearch, setPricingRuleSearch] = useState("")
  const [isSortOrFilterApplied, setIsSortOrFilterApplied] = useState(false)
  const [pricingRulesData, setPricingRulesData] = useState([])
  const [filteredPricingRuleData, setFilteredPricingRuleData] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const showModal = () => {
    setIsAddModalOpen(true) 
  } 

  const handleClear = () => {
    setIsSortOrFilterApplied(false)
    setPricingRuleSearch("")
  }    

  const handleAddCancel = () => {
    setIsAddModalOpen(false)
  }


  useEffect(() => {
    const getPricingRulesData = async() => {
      try{
        const response = await axios.get(
          "pricingRule/",
          {
            withCredentials: true
          }
        )
        setFilteredPricingRuleData(response.data.data)
        setPricingRulesData(response.data.data)
      }
      catch (error) {
        console.error('Error fetching orders data:', error) 
      }
    }
    getPricingRulesData()
    
  },[])

  useEffect(() => {
    const searchQuery = pricingRuleSearch.trim().toLowerCase() 
    if(pricingRuleSearch.length !== 0){
      setIsSortOrFilterApplied(true)
    }
    else{
      setIsSortOrFilterApplied(false)
    }
    const filteredData = Array.isArray(pricingRulesData) && pricingRulesData.length > 0 &&
    pricingRulesData.filter((rule) =>
      rule.name.toLowerCase().includes(searchQuery) ||
      rule.condition.toLowerCase().includes(searchQuery) ||
      rule.customerType.some((type) => 
        type.toLowerCase().includes(searchQuery)
      ) ||
      rule.threshold && rule.threshold.toString().includes(searchQuery) ||
      rule.discountPercentage && rule.discountPercentage.toString().includes(searchQuery)

    ) 
    setFilteredPricingRuleData(filteredData) 
  }, [pricingRuleSearch, pricingRulesData])
  

  useEffect(() => {
    initiateSocketConnection()
    const socket = getSocket()

    socket.on("pricingRuleAdded", (addedPricingRule) => {
      setPricingRulesData((prevState) => [...prevState, addedPricingRule])
    })

    socket.on("pricingRuleUpdated", (updatedPricingRule) => {
        setPricingRulesData((prevState) =>
            prevState.map((rule) =>
            rule._id === updatedPricingRule._id ? updatedPricingRule : rule
            )
        )
    })

    socket.on("pricingRuleDeleted", (deletedPricingRule) => {
        setPricingRulesData((prevState) => 
          prevState.filter((rule) => rule._id !== deletedPricingRule._id)
        ) 
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
              title: "Pricing Rules",
            },
          ]}
        />
      </div>

      <div className=' shadow-custom-medium rounded-md w-full flex flex-col h-[75vh]'>
        <div className='flex items-center justify-between px-5 py-5'>
          <h1 className='text-2xl font-medium text-headerText'>Pricing Rules</h1>
          <button 
            className='bg-primaryBlue text-white rounded-md px-2 py-1.5 flex items-center gap-2'
            onClick={showModal}
          >
            <FaPlus /> Add Pricing Rule
          </button>
        </div>

        <div className=' search-filter-container  flex items-center justify-between px-5'>
          <div className='rounded-md py-1 px-2 shadow-custom-light flex items-center gap-2 w-1/2'>
            <IoSearch className='text-xl text-gray-400'/>
            <input 
              className=' focus:outline-none w-full' 
              type='search' 
              name='search' 
              placeholder='Search Pricing Rule'
              value={pricingRuleSearch}
              onChange={(event) => setPricingRuleSearch(event.target.value)}
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
            <h1 className='w-[14%]  py-3 px-4 text-sm font-semibold'>Rule</h1>
            <h1 className='w-[14%]  py-3 px-4 text-sm font-semibold'>Condition</h1>
            <h1 className='w-[14%]  py-3 px-4 text-sm font-semibold'>Threshold</h1>
            <h1 className='w-[14%]  py-3 px-4 text-sm font-semibold'>Discount Percentage</h1>
            <h1 className='w-[14%]  py-3 px-4 text-sm font-semibold'>Customer Type</h1>
            <h1 className='w-[14%]  py-3 px-4 text-sm font-semibold'>Active status</h1>
          </div>
          <div className='overflow-y-scroll h-[50vh] no-scrollbar'>
          {
            Array.isArray(filteredPricingRuleData) && filteredPricingRuleData.length > 0 ?
            filteredPricingRuleData?.map((rule, index) => (
              <PricingRuleCardComponent rule={rule} key={index} index={index}/>
            // <></>
            ))
            : <div>No data found</div>
          }
          </div>
        </div>  
      </div>

    <PricingRuleAddModal isAddModalOpen={isAddModalOpen} handleAddCancel={handleAddCancel}/>
    </div>
  )
}

export default AdminPricingRulesPage
