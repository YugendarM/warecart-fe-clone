import { Breadcrumb, Button } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { TbLayoutDashboardFilled } from 'react-icons/tb'
import { Link, useLocation, useParams } from 'react-router-dom'
import ProductPageWarehouseCard from '../../components/ProductPageWarehouseCard/ProductPageWarehouseCard'
import ProductEditModal from '../../components/Modals/ProductEditModal/ProductEditModal'
import ProductDeleteModal from '../../components/Modals/ProductDeleteModal/ProductDeleteModal'
import { getSocket, initiateSocketConnection } from '../../utilities/socketService'
import { toast } from 'react-toastify'

const ProductPage = () => {
    
    const [productData, setProductData] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const {productId} = useParams()
    const location = useLocation()

    const handleEditCancel = () => {
        setIsEditModalOpen(false)
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false)
    }

    useEffect(() => {

        if(location.state && location.state.openEditModal){
            setIsEditModalOpen(true)
        }
        else{
            setIsEditModalOpen(false)
        }
        if(location.state && location.state.openDeleteModal){
            setIsDeleteModalOpen(true)
        }
        else{
            setIsDeleteModalOpen(false)
        }

        const getProductData = async() => {
            try{
                const response = await axios.get(
                    `/product/${productId}`,
                    {
                        withCredentials: true
                    }
                )
                if(response.status === 200){
                    setProductData(response.data)
                }
            }
            catch (error) {
                if (error.response) {
                  if (error.response.status === 404) {
                    toast.error("Product Not Found");
                  } else if (error.response.status === 500) {
                    toast.error("An error occurred while fetching the product");
                  } else {
                    toast.error(`An error occurred: ${error.response.status}`);
                  }
                } else if (error.request) {
                    toast.error("No response from server. Please try again.");
                } else {
                    toast.error("An unexpected error occurred. Please try again.");
                }
              }
        }
        getProductData()
    }, [])

    useEffect(() => {
        initiateSocketConnection()
        const socket = getSocket()

        socket.on("productUpdated", (updatedProduct) => {
            setProductData((prevState) => ({
                ...prevState,
                productData: updatedProduct
            }))
        })

        return () => {
            socket.disconnect()
        }
    }, [])

  return (
    <div>
      <div>
        <Breadcrumb className='text-headerText text-base'
                items={[
                    {
                    title: <Link to={"/admin/dashboard"}><TbLayoutDashboardFilled className='text-xl'/></Link>,
                    },
                    {
                    title: <Link to={"/admin/product"}>Products</Link>,
                    },
                    {
                    title: <p className='capitalize'>{productData && productData.productData && productData.productData.productName}</p>,
                    },
                ]}
                />
            {
            productData !== null ? 
            <div className='shadow-custom-medium rounded-md w-full flex flex-col min-h-[78vh] px-5 py-5'>
                
                <div className='flex items-center justify-between '>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-3xl font-bold text-gray-800'>{productData.productData.productName}</h1>
                        <h3 className='text-gray-600'>{productData.productData.productDescription}</h3>
                    </div>
                    <div className='flex items-center gap-3'>
                    <Button type='primary' onClick={() => setIsEditModalOpen(true)}><FaEdit className='text-base' />Edit</Button>
                    <Button onClick={() => setIsDeleteModalOpen(true)} color='danger' variant='solid'><MdDelete className='text-base' />Delete</Button>
                    </div>
                    
                </div>

                <div className='flex gap-20 py-5'>
                    <div className='flex items-end gap-2'>
                        <h4 className='text-base text-gray-700 font-medium'>Price: </h4>
                        <span className='text-3xl font-semibold'>₹ {productData.productData.price}<span className='text-base text-gray-600 font-medium'></span></span>
                    </div>
                    <div className='flex items-end gap-2'>
                        <h4 className='text-base text-gray-700 font-medium'>Category: </h4>
                        <span className='text-3xl font-semibold capitalize'>{productData.productData.productType}<span className='text-base text-gray-600 font-medium'></span></span>
                    </div>
                </div>

                <div className='pt-5'>
                    <h1 className='text-2xl font-bold text-gray-800'>Available In Warehouse:</h1>
                    <div className='flex items-center border-b border-b-gray-400'>
                        <h1 className='w-[15%] py-3 px-4 text-sm font-semibold'>Warehouse</h1>
                        <h1 className='w-[15%] py-3 px-4 text-sm font-semibold'>Location</h1>
                        <h1 className='w-[15%] py-3 px-4 text-sm font-semibold'>Warehouse Capacity</h1>
                        <h1 className='w-[15%] py-3 px-4 text-sm font-semibold'>Available Stock</h1>
                        <h1 className='w-[15%] py-3 px-4 text-sm font-semibold'>Reserved Stock</h1>
                        <h1 className='w-[15%] py-3 px-4 text-sm font-semibold'>Threshold</h1>
                    </div>
                    <div className='overflow-y-scroll no-scrollbar'>
                        {
                            productData.availableIn && productData.availableIn.length !== 0 ?
                            productData.availableIn.map((warehouse, index) => (
                                <ProductPageWarehouseCard warehouse={warehouse} key={index} index={index}/>
                            ))
                            :
                            <div className='w-full h-full flex justify-start items-center text-xl font-semibold'>Product Not available in any warehouse</div>
                        }
                    </div>
                </div>
            </div>
            :
            <div className='h-full w-full flex items-center justify-center text-2xl font-semibold'>Warehouse Not found</div>
        }
        {
            productData && productData.productData &&
            <div>
                <ProductEditModal product={productData.productData} isEditModelOpen={isEditModalOpen} handleEditCancel={handleEditCancel}/>
                <ProductDeleteModal product={productData.productData} isDeleteModalOpen={isDeleteModalOpen} handleDeleteCancel={handleDeleteCancel}/>
            </div>
        }
        </div>
    </div>
  )
}

export default ProductPage
