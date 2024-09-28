import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Dropdown, Form, Input, Menu, Modal, Space, Tooltip } from 'antd';
import axios from 'axios';

const WarehouseEditModal = ({warehouse, isModalOpen, handleCancel}) => {

    const [isEditModelOpen, setIsEditModelOpen] = useState(isModalOpen)

    console.log("from " + isEditModelOpen)
    console.log("from nn" + isModalOpen)

  const initialValues = {
    warehouseName: warehouse.warehouseName,
    city: warehouse.location.city,
    state: warehouse.location.state,
    country: warehouse.location.country,
    capacity: warehouse.capacity
  }

  const [form] = Form.useForm();

  const handleOk = () => {
    setIsEditModelOpen(false);
  };

  const handleSubmit = async(values) => {
    console.log('Success:', values);
    const warehouseInputData = {
      warehouseName: values.warehouseName,
      location: {
        city: values.city,
        state: values.state,
        country: values.country
      },
      capacity: values.capacity
    }
    try{
      const response = await axios.put(
        `warehouse/update/${warehouse._id}`,
        warehouseInputData)

      if(response.status === 200){
        alert("Warehouse updated successfully")
        setIsEditModelOpen(false)
      }
      
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert("Warehouse does not exists");
        } else if (error.response.status === 500) {
          alert("An error occurred while adding the warehouse");
        } else {
          alert(`An error occurred: ${error.response.status}`);
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
    if(isModalOpen){
        setIsEditModelOpen(true)
    }
    else{
        setIsEditModelOpen(false)
    }
  }, [isModalOpen])
  
  return (
    <div>
      <Modal 
        title="Add new Vendor" 
        open={isEditModelOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
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
            label="Warehouse Name"
            name="warehouseName"
            rules={[
              {
                required: true,
                message: 'Please enter the Warehouse Name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[
              {
                required: true,
                message: 'Please enter the City!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="State"
            name="state"
            rules={[
              {
                required: true,
                message: 'Please enter the State!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[
              {
                required: true,
                message: 'Please enter the Country!',
              },
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[
              {
                type: Number,
                required: true,
                message: 'Please enter the Capacity!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 16,
              span: 16,
            }}
            className=''
          >
            
            <Button htmlType="button" onClick={handleCancel}>
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

export default WarehouseEditModal
