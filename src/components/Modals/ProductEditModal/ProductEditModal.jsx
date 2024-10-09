import React, { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductEditModal = ({product, isEditModelOpen, handleEditCancel}) => {

    const [isModalOpen, setIsModalOpen] = useState(isEditModelOpen)

    const initialValues = {
        productName: product.productName,
        productType: product.productType,
        productDescription: product.productDescription,
        price: product.price,
      }
    
      const [form] = Form.useForm();
      const { Option } = Select;
    
      const handleOk = () => {
        setIsModalOpen(false);
      };
    
      const handleSubmit = async(values) => {
        const productInputData = {
          productName: values.productName,
          productType: values.productType,
          productDescription: values.productDescription,
          price: values.price,
        }
        try{
          const response = await axios.put(
            `product/update/${product._id}`,
            productInputData,
            {
              withCredentials: true
            }
          )
    
          if(response.status === 200){
            toast.success("Product updated successfully")
            handleEditCancel()
          }
          
        }
        catch (error) {
          if (error.response) {
            if (error.response.status === 404) {
              toast.error("Product does not exists");
            } else if (error.response.status === 500) {
              toast.error("An error occurred while editing the product");
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

      useEffect(() => {
        if(isEditModelOpen){
            setIsModalOpen(true)
        }
        else{
            setIsModalOpen(false)
        }
      }, [isEditModelOpen])

  return (
    <div>
      <Modal 
        title={`Edit ${product.productName}`} 
        open={isModalOpen} 
        onOk={handleOk} 
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
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[
              {
                required: true,
                message: 'Please enter the Product Name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="productType" label="Category" rules={[{ required: true }]}>
            <Select
                placeholder="Select a Product"
                // onChange={onGenderChange}
                allowClear
                >
                    <Option  value="book">Book</Option>
                    <Option  value="mobile">Mobile</Option>
                    <Option  value="pen">Pen</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="productDescription"
            rules={[
              {
                required: true,
                message: 'Please enter the Description!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: 'Please enter the Price!',
              },
            ]}
          >
            <InputNumber
            min={0}
            style={{ width: '100%' }} />
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
    </div>
  )
}

export default ProductEditModal
