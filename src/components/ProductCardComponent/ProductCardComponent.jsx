import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { MdDeleteOutline } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'antd';


const ProductCardComponent = ({product, index}) => {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const navigate = useNavigate()

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
  }

  const handleEditWarehouse = (event) => {
    event.preventDefault()
    navigate(`/admin/product/${product._id}`, { state: { openEditModal: true } })
  }

  const handleDeleteWarehouse = (event) => {
    event.preventDefault()
    navigate(`/admin/product/${product._id}`, { state: { openDeleteModal: true } })
  }

  return (
    <React.Fragment>
      <Link to={`/admin/product/${product._id}`} className={`w-full flex items-center border-b border-b-gray-200 transition hover:shadow-custom-heavy hover:transform hover:-translate-y-1 ${index%2 === 0? "bg-gray-50" : "bg-white"}`}>
        <p className='capitalize text-ellipsis overflow-hidden w-1/5 px-4 py-4 text-sm text-gray-700'>{product.productName}</p>
        <p className='capitalize text-ellipsis overflow-hidden w-1/5 px-4 py-4 text-sm text-gray-700'>{product.productType}</p>
        <p className='capitalize text-ellipsis overflow-hidden w-1/5 px-4 py-4 text-sm text-gray-700 '>{product.productDescription}</p>
        <p className='text-ellipsis overflow-hidden w-1/5 px-4 py-4 text-sm text-gray-700'>₹ {product.price}</p>
        <div className='flex items-center gap-5'>
          <Tooltip title="Edit Product">
            <button onClick={(event) => handleEditWarehouse(event)}>
              <FiEdit className='text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded p-2 hover:shadow-custom-medium h-8 w-8'/>
            </button>
          </Tooltip>
          <Tooltip title="Delete Product">
            <button onClick={(event) => handleDeleteWarehouse(event)}>
                <MdDeleteOutline className='text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded p-2 hover:shadow-custom-medium h-8 w-8'/>
            </button>
          </Tooltip>
        </div>
      </Link>
    </React.Fragment>
    
  )
}

export default ProductCardComponent
