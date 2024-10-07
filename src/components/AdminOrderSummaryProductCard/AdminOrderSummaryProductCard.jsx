import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { MdDeleteOutline } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'antd'   
import PricingRuleEditModal from '../Modals/PricingRuleEditModal/PricingRuleEditModal'   
import PricingRuleDeleteModal from '../Modals/PricingRuleDeleteModal/PricingRuleDeleteModal'   
import { IoBagHandle } from 'react-icons/io5'


const AdminOrderSummaryProductCard = ({product, index}) => {

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0, // Adjust if you want decimals
    }).format(amount);
};

  return (
    <React.Fragment>
      <div className={`w-full flex items-center border-b border-b-gray-200 transition ${index%2 === 0? "bg-gray-50" : "bg-white"}`}>
        <p className='capitalize text-ellipsis overflow-hidden w-[18%] px-4 py-4 text-sm text-gray-700'>{product.product.productName}</p>
        <p className='capitalize text-ellipsis overflow-hidden w-[18%] px-4 py-4 text-sm text-gray-700'>{product.product.productType}</p>
        <p className='capitalize text-ellipsis overflow-hidden w-[18%] px-4 py-4 text-sm text-gray-700'>{formatRupees(product.product.price)}</p>
        <p className='capitalize text-ellipsis overflow-hidden w-[18%] px-4 py-4 text-sm text-gray-700'>{product.quantity}</p>
        <p className='capitalize text-ellipsis overflow-hidden w-[18%] px-4 py-4 text-sm text-gray-700 '>{formatRupees(product.price * product.quantity)}</p>
        <div className='flex items-center gap-5 w-[16%]'>
          <Tooltip title="Visit Product">
            <Link to={`/admin/product/${product.product._id}`}>
              <IoBagHandle className='text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded p-2 hover:shadow-custom-medium h-8 w-8'/>
            </Link>
          </Tooltip>
        </div>
      </div>
    </React.Fragment>
    
  )
}

export default AdminOrderSummaryProductCard
