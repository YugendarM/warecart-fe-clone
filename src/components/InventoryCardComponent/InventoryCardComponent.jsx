import React, { useEffect, useState } from 'react'
import { CiSquarePlus } from 'react-icons/ci'
import { FaRegPlusSquare } from 'react-icons/fa'
import { FiAlertTriangle, FiEdit } from 'react-icons/fi'
import { MdDeleteOutline, MdOutlineShoppingBag } from 'react-icons/md'
import { Link, useAsyncError } from 'react-router-dom'
import { Breadcrumb, Button, Dropdown, Form, Input, InputNumber, Menu, Modal, Space, Tooltip } from 'antd';
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

const InventoryCardComponent = ({inventory, index}) => {
    
    const [isEditModalOpen, setEditIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const initialValues = {
      stockLevel: inventory.stockLevel,
      reservedStock: inventory.reservedStock,
      stockThreshold: inventory.stockThreshold
    }
  
    const [form] = Form.useForm();

    const handleEditOk = () => {
      setEditIsModalOpen(false);
    };
  
    const handleEditCancel = () => {
      setEditIsModalOpen(false);
    };

    const handleEditSubmit = async(values) => {
      const inventoryInputData = {
        stockLevel: values.stockLevel,
        reservedStock: values.reservedStock,
        stockThreshold: values.stockThreshold,
      }
      try{
        const response = await axios.put(
          `inventory/update/${inventory._id}`,
          inventoryInputData,
          {
            withCredentials: true
          }
        )

        if(response.status === 200){
          toast.success("Inventory updated successfully")
          setEditIsModalOpen(false)
        }
        
      }
      catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            toast.error("Inventory does not exists");
          } else if (error.response.status === 500) {
            toast.error("An error occurred while adding the Inventory");
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

    const handleEditWarehouse = (event) => {
      event.preventDefault()
      setEditIsModalOpen(true)
    }
  
    const handleDeleteWarehouse = (event) => {
      event.preventDefault()
      setIsDeleteModalOpen(true)
    }

    const handleDeleteConform = async() => {
      try{
        const response = await axios.delete(
          `inventory/delete/${inventory._id}`,
          {
            withCredentials: true
          }
        )

        if(response.status === 200){
          toast.success("Inventory deleted successfully")
          setIsDeleteModalOpen(false)
        }
        
      }
      catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            toast.error("Inventory does not exists");
          } else if (error.response.status === 500) {
            toast.error("An error occurred while deleting the inventory");
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

  return (
    <div>
      <div className={`w-full flex items-center border-b border-b-gray-200 transition  ${index%2 === 0? "bg-gray-50" : "bg-white"}`}>
        <p className='text-ellipsis overflow-hidden w-1/6 px-4 py-4 text-sm text-gray-700'>{inventory.productDetails.productName}</p>
        <p className='capitalize text-ellipsis overflow-hidden w-1/6 px-4 py-4 text-sm text-gray-700'>{inventory.productDetails.productType}</p>
        <p className='text-ellipsis overflow-hidden w-1/6 px-4 py-4 text-sm text-gray-700'>{inventory.stockLevel}</p>
        <p className='text-ellipsis overflow-hidden w-1/6 px-4 py-4 text-sm text-gray-700 '>{inventory.reservedStock}</p>
        <p className='text-ellipsis overflow-hidden w-1/6 px-4 py-4 text-sm text-gray-700'>{inventory.stockThreshold}</p>
        <div className='flex items-center justify-around w-1/6'>
          <div className='w-1/4'>
          {
            inventory.stockLevel < inventory.stockThreshold &&
            <Tooltip title="Stock Alert!!" >
              <FiAlertTriangle className='text-red-700 text-2xl'/>
            </Tooltip>
          }
          </div>
          <div className='w-3/4 flex gap-5'>
            <Tooltip title="Edit Inventory">
              <button onClick={(event) => handleEditWarehouse(event)}>
                <FiEdit className='text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded p-2 hover:shadow-custom-medium h-8 w-8'/>
              </button>
            </Tooltip>
            <Tooltip title="Delete Invertory">
              <button onClick={(event) => handleDeleteWarehouse(event)}>
                  <MdDeleteOutline className='text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded p-2 hover:shadow-custom-medium h-8 w-8'/>
              </button>
            </Tooltip>
            <Tooltip title="Visit Product">
              <Link to={`/admin/product/${inventory.productDetails._id}`}>
                  <MdOutlineShoppingBag className='text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded p-2 hover:shadow-custom-medium h-8 w-8'/> 
              </Link>
            </Tooltip> 
          </div>
        </div>
      </div>
      <Modal 
        title="Update inventory" 
        open={isEditModalOpen} 
        onOk={handleEditOk} 
        onCancel={handleEditCancel}
        footer={[]}
      >
        <Form
          initialValues={initialValues}
          form = {form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          onFinish={handleEditSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Stock Level"
            name="stockLevel"
            rules={[
              {
                required: true,
                message: 'Please enter the Stock Level!',
              },
            ]}
          >
            <InputNumber 
              min={0}
              style={{ width: '100%' }} // Full width style
              placeholder="Enter stock level"
            />
          </Form.Item>

          <Form.Item
            label="Reserved Stock"
            name="reservedStock"
            rules={[
              {
                required: true,
                message: 'Please enter the Reserved Stock!',
              },
            ]}
          >
            <InputNumber 
              min={0} // Set the minimum value to 0
              style={{ width: '100%' }} // Full width style
              placeholder="Enter reserved stock level"
            />
          </Form.Item>

          <Form.Item
            label="Stock Threshold"
            name="stockThreshold"
            rules={[
              {
                required: true,
                message: 'Please enter the Stock Threshold!',
              },
            ]}
          >
            <InputNumber 
              min={0} // Set the minimum value to 0
              style={{ width: '100%' }} // Full width style
              placeholder="Enter stock threshold level"
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 16,
              span: 16,
            }}
            className=''
          >
            
            <Button htmlType="button" onClick={handleEditCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal 
        title="Are you sure?" 
        open={isDeleteModalOpen} 
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[]}
        
      >
        <p>Do you really want to delete this product in the inventory?</p>
        <div className='flex justify-end gap-4 py-5'>
            <Button htmlType="button" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" variant="solid" onClick={() => handleDeleteConform()}>
              Delete
            </Button>

        </div>
      </Modal>
    </div>
  )
}

export default InventoryCardComponent
