import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Dropdown, Form, Input, InputNumber, Menu, Modal, Select, Space, Tooltip } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddInventoryModal = ({warehouse, isAddModalOpen, handleAddCancel, spaceAvailable}) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [productList, setProductList] = useState([])

    const [form] = Form.useForm();
    const { Option } = Select;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async(values) => {
    const inventoryInputData = {
      stockLevel: values.stockLevel,
      stockThreshold: values.stockThreshold,
      productId: values.product,
      warehouseId: warehouse
    }
    try{
      const response = await axios.post(
        `inventory/add`,
        inventoryInputData,
        {
          withCredentials: true
        }
      )

      if(response.status === 201){
        toast.success("Inventory added successfully")
        form.resetFields()
        handleAddCancel()
      }
      
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          toast.error("An error occurred while adding the Inventory");
        } else {
          toast.error(`An error occurred: ${error.response.status} ${error.response.data.message}`);
        }
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }

  useEffect(() => {
    if(isAddModalOpen){
        setIsModalOpen(true)
    }
    else{
        setIsModalOpen(false)
    }
  }, [isAddModalOpen])

  useEffect(() => {
    const getProductData = async() => {
        const response = await axios.get(
          "/product", 
          {
            withCredentials: true
          }
        )
        const productDetails = response.data.map((product) => {
            return {productName: product.productName, productType: product.productType, _id: product._id}
        })
        setProductList(productDetails)
    }
    getProductData()
  }, [])

  return (
    <div>
      <Modal 
            title="Add New Inventory" 
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={handleAddCancel}
            footer={[]}
          >
            <Form
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
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item name="product" label="Product" rules={[{ required: true }]}>
                <Select
                placeholder="Select a Product"
                // onChange={onGenderChange}
                allowClear
                >
                    {
                        productList.length > 0 && 
                        productList.map((product, index) => (
                            <Option  value={product._id}><div className='text-sm font-semibold flex gap-2 items-center w-full text-ellipsis overflow-hidden' key={index}><p className='w-1/2 text-ellipsis overflow-hidden'>{product.productName} </p><span className='text-xs text-gray-500 w-1/2'>Category:  <span className='capitalize text-gray-800 text-sm'>{product.productType}</span></span></div></Option>
                        ))
                    }
                </Select>
                </Form.Item>

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
                    max={spaceAvailable}
                    style={{ width: '100%' }} 
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
                    min={0} 
                    style={{ width: '100%' }} 
                    />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 16,
                  span: 16,
                }}
                className=''
              >
                
                <Button htmlType="button" onClick={() => form.resetFields()}>
                  Clear
                </Button>
                <Button type="primary" htmlType="submit">
                  Add
                </Button>
              </Form.Item>
            </Form>
          </Modal>
    </div>
  )
}

export default AddInventoryModal
