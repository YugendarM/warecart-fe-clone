import { Tooltip } from 'antd'
import React from 'react'
import { FaSquareArrowUpRight } from 'react-icons/fa6'
import { FiAlertTriangle } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const ProductPageWarehouseCard = ({warehouse, index}) => {
  return (
    <div>
      <Link to={`/admin/warehouse/${warehouse.warehouseDetails._id}`} className={`w-full flex items-center border-b border-b-gray-200 transition hover:shadow-custom-heavy hover:transform hover:-translate-y-1 ${index%2 === 0? "bg-gray-50" : "bg-white"}`}>
        <p className='text-ellipsis overflow-hidden w-[15%] px-4 py-4 text-sm text-gray-700'>{warehouse.warehouseDetails.warehouseName}</p>
        <p className='text-ellipsis overflow-hidden w-[15%] px-4 py-4 text-sm text-gray-700'>{warehouse.warehouseDetails.location.city + ", " + warehouse.warehouseDetails.location.state + ", " + warehouse.warehouseDetails.location.country}</p>
        <p className='text-ellipsis overflow-hidden w-[15%] px-4 py-4 text-sm text-gray-700 '>{warehouse.warehouseDetails.capacity} Products</p>
        <p className='text-ellipsis overflow-hidden w-[15%] px-4 py-4 text-sm text-gray-700'>{warehouse.stockLevel} Products</p>
        <p className='text-ellipsis overflow-hidden w-[15%] px-4 py-4 text-sm text-gray-700'>{warehouse.reservedStock} Products</p>
        <p className='text-ellipsis overflow-hidden w-[15%] px-4 py-4 text-sm text-gray-700'>{warehouse.stockThreshold} Products</p>
        <div className='w-[10%] flex items-center'>
          <div className='w-1/2'>
            {
                warehouse.stockLevel < warehouse.stockThreshold &&
                <Tooltip title="Stock Alert!!" >
                <FiAlertTriangle className='text-red-700 text-2xl'/>
                </Tooltip>
            }
          </div>
          <div className='w-3/4 flex gap-5'>
            <Tooltip title="Visit Warehouse">
              <Link to={`/admin/warehouse/${warehouse.warehouseDetails._id}`}>
                  <FaSquareArrowUpRight className='text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded p-2 hover:shadow-custom-medium h-8 w-8'/> 
              </Link>
            </Tooltip> 
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductPageWarehouseCard
