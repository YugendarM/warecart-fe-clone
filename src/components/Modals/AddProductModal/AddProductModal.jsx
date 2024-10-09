import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Dropdown, Form, Input, InputNumber, Menu, Modal, Select, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProductModal = ({isAddModalOpen, handleAddCancel}) => {

    const [isModalOpen, setIsModalOpen] = useState(isAddModalOpen)

    const [form] = useForm()
    const { Option } = Select;

    const handleOk = () => {
        setIsModalOpen(false);
      };

      const handleCancel = () => {
        setIsModalOpen(false);
      };

      const handleFormChange = (changedValues, allValues) => {
        setWarehouseInputData(allValues);
      };
    
      const handleFormClear = () => {
        form.resetFields()
      }

      const handleSubmit = async(values) => {
        const productInputData = {
          productName: values.productName,
          productType: values.productType,
          productDescription : values.productDescription,
          price: values.price
        }
        try{
          const response = await axios.post(
            "product/add",
            productInputData,
            {
              withCredentials: true
            }
          )
    
          if(response.status === 201){
            toast.success("Product added successfully")
            setIsModalOpen(false)
          }
          
        }
        catch (error) {
          if (error.response) {
            if (error.response.status === 409) {
              toast.error("Product already exists");
            } else if (error.response.status === 500) {
              toast.error("An error occurred while adding the product");
            } else {
              toast.error(`An error occurred: ${error.response.status}`);
            }
          } else if (error.request) {
            toast.error("No response from server. Please try again.");
          } else {
            toast.error("An unexpected error occurred. Please try again.");
          }
        }
      };

      useEffect(() => {
        if(isAddModalOpen){
            setIsModalOpen(true)
        }
        else{
            setIsModalOpen(false)
        }
      }, [isAddModalOpen])

  return (
    <div>
      <Modal 
        title="Add new Product" 
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
          initialValues={{
            remember: true,
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
                message: 'Please enter the Warehouse Name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="productType" label="Product Category" rules={[{ required: true }]}>
            <Select
            placeholder="Select a Product"
            allowClear
            >
                <Option  value="book">Book</Option>
                <Option  value="mobile">Mobile</Option>
                <Option  value="pen">Pen</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Product Description"
            name="productDescription"
            rules={[
              {
                required: true,
                message: 'Please enter the Product Description!',
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
            
            <Button htmlType="button" onClick={handleFormClear}>
              Clear
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddProductModal
