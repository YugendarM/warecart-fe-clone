import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Dropdown, Form, Input, Menu, Modal, Space } from 'antd';
import { Link } from 'react-router-dom';
import { TbLayoutDashboardFilled } from 'react-icons/tb';
import { FaPlus } from 'react-icons/fa6';
import { IoChevronDown, IoSearch } from 'react-icons/io5';
import WarehouseCardComponent from '../../../components/WarehouseCardComponent/WarehouseCardComponent';
import axios from 'axios';
import ProductCardComponent from '../../../components/ProductCardComponent/ProductCardComponent';
import AddProductModal from '../../../components/Modals/AddProductModal/AddProductModal';


const AdminProductsPage = () => {

  const [productSearch, setProductSearch] = useState("")
  const [isSortOrFilterApplied, setIsSortOrFilterApplied] = useState(false)
  const [productsData, setProductsData] = useState([])
  const [filteredProductData, setFilteredProductData] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [warehouseInputData, setWarehouseInputData] = useState({})

  const [form] = Form.useForm();

  const showModal = () => {
    setIsAddModalOpen(true);
  };

  const handleClear = () => {
    setIsSortOrFilterApplied(false)
    setProductSearch("")
  }    

  const handleAddCancel = () => {
    setIsAddModalOpen(false)
  }


  useEffect(() => {
    const getProductsData = async() => {
      try{
        const response = await axios.get("product/")
        setFilteredProductData(response.data)
        setProductsData(response.data)
      }
      catch (error) {
        console.error('Error fetching product data:', error);
      }
    }
    getProductsData()
    
  },[])

  useEffect(() => {
    const searchQuery = productSearch.trim().toLowerCase();
    if(productSearch.length !== 0){
      setIsSortOrFilterApplied(true)
    }
    else{
      setIsSortOrFilterApplied(false)
    }
    const filteredData = Array.isArray(productsData) && productsData.length > 0 &&
    productsData.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery) ||
      product.productDescription.toLowerCase().includes(searchQuery) 

    );
    setFilteredProductData(filteredData);
  }, [productSearch, productsData])

  return (
    <div className='w-full'>
      <div className='breadcrum-container'>
        <Breadcrumb className='text-headerText text-base'
          items={[
            {
              title: <Link to={"/admin/dashboard"}><TbLayoutDashboardFilled className='text-xl'/></Link>,
            },
            {
              title: "Products",
            },
          ]}
        />
      </div>

      <div className=' shadow-custom-medium rounded-md w-full flex flex-col h-[75vh]'>
        <div className='flex items-center justify-between px-5 py-5'>
          <h1 className='text-2xl font-medium text-headerText'>Products</h1>
          <button 
            className='bg-primaryBlue text-white rounded-md px-2 py-1.5 flex items-center gap-2'
            onClick={showModal}
          >
            <FaPlus /> Add New Product
          </button>
        </div>

        <div className=' search-filter-container  flex items-center justify-between px-5'>
          <div className='rounded-md py-1 px-2 shadow-custom-light flex items-center gap-2 w-1/2'>
            <IoSearch className='text-xl text-gray-400'/>
            <input 
              className=' focus:outline-none w-full' 
              type='search' 
              name='search' 
              placeholder='Search Product'
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
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
            <h1 className='w-1/5 py-3 px-4 text-sm font-semibold'>Product</h1>
            <h1 className='w-1/5 py-3 px-4 text-sm font-semibold'>Category</h1>
            <h1 className='w-1/5 py-3 px-4 text-sm font-semibold'>Description</h1>
            <h1 className='w-1/5 py-3 px-4 text-sm font-semibold'>Price</h1>
          </div>
          <div className='overflow-y-scroll h-[50vh] no-scrollbar'>
          {
            Array.isArray(filteredProductData) && filteredProductData.length > 0 ?
            filteredProductData?.map((product, index) => (
              <ProductCardComponent product={product} key={index}/>
              // <></>
            ))
            : <div>No data found</div>
          }
          </div>
        </div>  
      </div>

      <AddProductModal handleAddCancel={handleAddCancel} isAddModalOpen={isAddModalOpen}/>
    </div>
  )
}

export default AdminProductsPage
