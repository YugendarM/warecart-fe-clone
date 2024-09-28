import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Dropdown, Form, Input, InputNumber, Menu, Modal, Select, Space, Tooltip } from 'antd';
import axios from 'axios';

const AddInventoryModal = ({warehouse, isAddModalOpen, handleAddCancel, spaceAvailable}) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [productList, setProductList] = useState([])

    const [form] = Form.useForm();
    const { Option } = Select;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async(values) => {
    console.log('Success:', values);
    const inventoryInputData = {
      stockLevel: values.stockLevel,
      stockThreshold: values.stockThreshold,
      productId: values.product,
      warehouseId: warehouse
    }
    console.log(inventoryInputData)
    try{
      const response = await axios.post(
        `inventory/add`,
        inventoryInputData)

      if(response.status === 201){
        alert("Inventory added successfully")
        setIsModalOpen(false)
      }
      
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          alert("An error occurred while adding the Inventory");
        } else {
          alert(`An error occurred: ${error.response.status} ${error.response.data.message}`);
        }
      } else if (error.request) {
        console.log(error.request);
        alert("No response from server. Please try again.");
      } else {
        console.log('Error', error.message);
        alert("An unexpected error occurred. Please try again.");
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
        const response = await axios.get("/product")
        console.log(response)
        const productDetails = response.data.map((product) => {
            return {productName: product.productName, productType: product.productType, _id: product._id}
        })
        console.log(productDetails)
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
                        productList.map((product) => (
                            <Option value={product._id}><div className='text-sm font-semibold flex  items-center w-full'><p className='w-1/2'>{product.productName} </p><span className='text-xs text-gray-500 w-1/2'>Category:  <span className='capitalize text-gray-800 text-sm'>{product.productType}</span></span></div></Option>
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
