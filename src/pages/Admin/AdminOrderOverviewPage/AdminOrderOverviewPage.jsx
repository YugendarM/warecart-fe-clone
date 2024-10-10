import { Breadcrumb, Button } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { TbLayoutDashboardFilled } from 'react-icons/tb'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getSocket, initiateSocketConnection } from '../../../utilities/socketService'
import AdminOrderSummaryProductCard from '../../../components/AdminOrderSummaryProductCard/AdminOrderSummaryProductCard'
import { toast } from 'react-toastify'
// import ProductEditModal from '../../components/Modals/ProductEditModal/ProductEditModal'
// import ProductDeleteModal from '../../components/Modals/ProductDeleteModal/ProductDeleteModal'
// import ProductPageWarehouseCard from '../../../components/ProductPageWarehouseCard/ProductPageWarehouseCard'

const AdminOrderOverviewPage = () => {
    
    const [orderData, setOrderData] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const {orderId} = useParams()
    const location = useLocation()

    const handleEditCancel = () => {
        setIsEditModalOpen(false)
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false)
    }

    const formatRupees = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0, // Adjust if you want decimals
        }).format(amount);
    };

    useEffect(() => {

        const getOrderData = async() => {
            try{
                const response = await axios.get(
                    `/order/${orderId}`,
                    {
                        withCredentials: true
                    }
                )
                if(response.status === 200){
                    setOrderData(response.data.data)
                }
            }
            catch (error) {
                if (error.response) {
                  if (error.response.status === 404) {
                    toast.error("Order Not Found");
                  } else if (error.response.status === 500) {
                    toast.error("An error occurred while fetching the order");
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
        getOrderData()
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
                    title: <Link to={"/admin/product"}>Orders</Link>,
                    },
                    {
                    title: <p className='capitalize'>{orderData && orderData._id}</p>,
                    },
                ]}
                />
            {
            orderData !== null ? 
            <div className='shadow-custom-medium rounded-md w-full flex flex-col gap-8 min-h-[78vh] px-5 py-5'>
                <div className='flex items-center justify-between '>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-3xl font-bold text-gray-800'>Order Summary</h1>
                        <div className='flex items-end gap-2'>
                            <h4 className='text-base text-gray-500 font-medium'>Status: </h4>
                            <span className='text-base text-gray-500 font-medium capitalize'>{orderData.orderStatus}<span className='text-base text-gray-600 font-medium'></span></span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <div className='flex gap-20'>
                        <div className='flex items-end gap-2'>
                            <h4 className='text-base text-gray-700 font-medium'>Total Amount: </h4>
                            <span className='text-3xl font-semibold'>{formatRupees(orderData.totalAmount)}<span className='text-base text-gray-600 font-medium'></span></span>
                        </div>
                        <div className='flex items-end gap-2'>
                            <h4 className='text-base text-gray-700 font-medium'>Discount Amount: </h4>
                            <span className='text-3xl font-semibold capitalize'>{formatRupees(orderData.discountedAmount)}<span className='text-base text-gray-600 font-medium'></span></span>
                        </div>
                        <div className='flex items-end gap-2'>
                            <h4 className='text-base text-gray-700 font-medium'>Amount Payable: </h4>
                            <span className='text-3xl font-semibold'>{formatRupees(orderData.payableAmount)}<span className='text-base text-gray-600 font-medium'></span></span>
                        </div>
                    </div>

                    <div className='flex items-center gap-20'>
                        <div>
                            <div className='flex items-end gap-2'>
                                <h4 className='text-base text-gray-700 font-medium'>Payment Method: </h4>
                                <span className='text-2xl font-semibold capitalize'>{orderData.paymentInfo.paymentMethod}<span className='text-base text-gray-600 font-medium'></span></span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <h4 className='text-sm text-gray-500 font-medium'>Status: </h4>
                                <span className='text-sm text-gray-500 font-medium capitalize'>{orderData.paymentInfo.paymentStatus}<span className='text-base text-gray-600 font-medium'></span></span>
                            </div>
                        </div>
                        <div>
                            <div className='flex items-end gap-2'>
                                <h4 className='text-base text-gray-700 font-medium'>Platform Fee: </h4>
                                <span className='text-2xl font-semibold capitalize'>{formatRupees(orderData.platformFee)}<span className='text-base text-gray-600 font-medium'></span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className='text-xl font-bold text-gray-800 flex gap-4 items-center'>Shipping Info: <span className='text-sm text-gray-500 font-medium inline-block'>{orderData.shippingInfo.shippingMethod} Delivery</span></h1>
                    {
                        orderData.user.addressFirstLine &&
                        <div>
                            <p className='capitalize text-lg font-medium text-gray-700'>{orderData.user.firstName} {orderData.user.lastName}</p>
                            <p className='text-base font-medium text-gray-700'>+91 {orderData.shippingInfo.phoneNo},</p>
                            <p className='text-sm text-gray-600'>{orderData.shippingInfo.addressFirstLine},</p>
                            <p className='text-sm text-gray-600'>{orderData.shippingInfo.addressSecondLine},</p>
                            <p className='text-sm text-gray-600'>{orderData.shippingInfo.city}, {orderData.user.state} | {orderData.shippingInfo.pincode}</p>
                            <p className='text-sm text-gray-600'></p>
                            <p>{orderData.shippingInfo.country && orderData.shippingInfo.country}</p>
                        </div>
                    }
                </div>

                <div className='py-5'>
                    <h1 className='text-2xl font-bold text-gray-800'>Products Ordered: </h1>
                    <div className='flex items-center border-b border-b-gray-400'>
                        <h1 className='w-[18%] py-3 px-4 text-sm font-semibold'>Product</h1>
                        <h1 className='w-[18%] py-3 px-4 text-sm font-semibold'>Category</h1>
                        <h1 className='w-[18%] py-3 px-4 text-sm font-semibold'>Price</h1>
                        <h1 className='w-[18%] py-3 px-4 text-sm font-semibold'>Quantity</h1>
                        <h1 className='w-[18%] py-3 px-4 text-sm font-semibold'>Total Price</h1>
                        <h1 className='w-[16%] py-3 px-4 text-sm font-semibold'></h1>
                    </div>
                    <div className='overflow-y-scroll no-scrollbar'>
                        {
                            orderData.products && orderData.products.length !== 0 ?
                            orderData.products.map((product, index) => (
                                <AdminOrderSummaryProductCard product={product} index={index} key={index}/>
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
        </div>
    </div>
  )
}

export default AdminOrderOverviewPage
