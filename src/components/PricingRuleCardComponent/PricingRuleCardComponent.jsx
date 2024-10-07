import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { MdDeleteOutline } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'antd'   
import PricingRuleEditModal from '../Modals/PricingRuleEditModal/PricingRuleEditModal'   
import PricingRuleDeleteModal from '../Modals/PricingRuleDeleteModal/PricingRuleDeleteModal'   


const PricingRuleCardComponent = ({rule, index}) => {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const navigate = useNavigate()

  const handleEditCancel = () => {
    setIsEditModalOpen(false)   
  }   
  
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
  }

  const handleEditPricingRule = (event) => {
    setIsEditModalOpen(true)
  }

  const handleDeletePricingRule = (event) => {
    setIsDeleteModalOpen(true)
  }

  return (
    <React.Fragment>
      <div className={`w-full flex items-center border-b border-b-gray-200 transition ${index%2 === 0? "bg-gray-50" : "bg-white"}`}>
        <p className='capitalize text-ellipsis overflow-hidden w-[14%] px-4 py-4 text-sm text-gray-700'>{rule.name}</p>
        <p className='capitalize text-ellipsis overflow-hidden w-[14%] px-4 py-4 text-sm text-gray-700'>{rule.condition}</p>
        <p className='capitalize text-ellipsis overflow-hidden w-[14%] px-4 py-4 text-sm text-gray-700'>{rule.threshold ? rule.threshold + " Nos" : "None"}</p>
        <p className='capitalize text-ellipsis overflow-hidden w-[14%] px-4 py-4 text-sm text-gray-700'>{rule.discountPercentage}%</p>
        <p className='capitalize text-ellipsis overflow-hidden w-[14%] px-4 py-4 text-sm text-gray-700 '>{rule.customerType.length > 0 ? rule.customerType.join(",") : "All"}</p>
        <p className='text-ellipsis overflow-hidden w-[14%] px-4 py-4 text-sm text-gray-700'>{rule.active ? "Active" : "Inactive"}</p>
        <div className='flex items-center gap-5 w-[16%]'>
          <Tooltip title="Edit Pricing Rule">
            <button onClick={() => handleEditPricingRule()}>
              <FiEdit className='text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded p-2 hover:shadow-custom-medium h-8 w-8'/>
            </button>
          </Tooltip>
          <Tooltip title="Delete Pricing Rule">
            <button onClick={() => handleDeletePricingRule()}>
                <MdDeleteOutline className='text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded p-2 hover:shadow-custom-medium h-8 w-8'/>
            </button>
          </Tooltip>
        </div>
      </div>

      <PricingRuleEditModal rule={rule} isEditModalOpen={isEditModalOpen} handleEditCancel={handleEditCancel}/>
      <PricingRuleDeleteModal rule={rule} isDeleteModalOpen={isDeleteModalOpen} handleDeleteCancel={handleDeleteCancel}/>
    </React.Fragment>
    
  )
}

export default PricingRuleCardComponent
