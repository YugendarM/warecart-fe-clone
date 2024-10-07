import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { MdDeleteOutline } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'antd';


const ProductCardComponent = ({order, index}) => {

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0, 
    }).format(amount);
    };

    const navigate = useNavigate()

    const navigateProduct = (event, product) => {
        event.preventDefault()
        navigate(`/admin/product/${product.product._id}`)
    }

  return (
    <React.Fragment>
      <Link to={`/admin/orders/${order._id}`} className={`w-full flex items-center border-b border-b-gray-200 transition hover:shadow-custom-heavy hover:transform hover:-translate-y-1 ${index%2 === 0? "bg-gray-50" : "bg-white"}`}>
        <p className='capitalize text-ellipsis text-center overflow-hidden w-[17%] px-4 py-4 text-sm text-gray-700'>{order.user.firstName + " " + order.user.lastName}</p>
        <p className='capitalize text-ellipsis text-center overflow-hidden w-[17%] px-4 py-4 text-sm text-gray-700'>{order.products.map((product, index) => (<span onClick={(event) => navigateProduct(event, product)} key={index} className='text-blue-500 underline inline-block hover:text-blue-400'>{product.product.productName}</span>))}</p>
        <p className='capitalize text-ellipsis text-center overflow-hidden w-[16%] px-4 py-4 text-sm text-gray-700 '>{formatRupees(order.payableAmount)}</p>
        <p className='capitalize text-ellipsis text-center overflow-hidden w-[17%] px-4 py-4 text-sm text-gray-700'>{order.orderStatus}</p>
        <p className='capitalize text-ellipsis text-center overflow-hidden w-[17%] px-4 py-4 text-sm text-gray-700'>{order.paymentInfo.paymentMethod}</p>
        <p className='capitalize text-ellipsis text-center overflow-hidden w-[17%] px-4 py-4 text-sm text-gray-700'>{order.paymentInfo.paymentStatus}</p>
      </Link>
    </React.Fragment>
    
  )
}

export default ProductCardComponent
