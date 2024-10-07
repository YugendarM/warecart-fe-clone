import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, DatePicker, Dropdown, Form, Input, InputNumber, Menu, Modal, Radio, Select, Space } from 'antd' 
import { useForm } from 'antd/es/form/Form' 
import axios from 'axios' 
import moment from 'moment' 

const PricingRuleAddModal = ({isAddModalOpen, handleAddCancel}) => {

    const [isModalOpen, setIsModalOpen] = useState(isAddModalOpen)
    
      const [form] = Form.useForm() 
      const { Option } = Select 
    
      const handleOk = () => {
        setIsModalOpen(false) 
      } 
    
      const handleSubmit = async(values) => {
        const pricingRuleInputData = {
          name: values.name,
          condition: values.condition,
          threshold: values.threshold,
          discountPercentage: values.discountPercentage,
          customerType: values.customerType,
          active: values.active,
          startDate: values.startDate,
          endDate: values.endDate
        }
        try{
          const response = await axios.post(
            `pricingRule/add/`,
            pricingRuleInputData,
            {
              withCredentials: true
            }
          )
    
          if(response.status === 201){
            alert("Pricing Rule added successfully")
            setIsModalOpen(false)
            handleAddCancel()
          }
          
        }
        catch (error) {
          if (error.response) {
            if (error.response.status === 404) {
              alert("Pricing rule does not exists") 
            } else if (error.response.status === 500) {
              alert("An error occurred while adding the pricing rule") 
            } else {
              alert(`An error occurred: ${error.response.status}`) 
            }
          } else if (error.request) {
            alert("No response from server. Please try again.") 
          } else {
            alert("An unexpected error occurred. Please try again.") 
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

  return (
    <div>
      <Modal 
        title={`Add Pricing Rule`} 
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
          <Form.Item
            label="Pricing Rule Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please enter the Pricing Rule Name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="condition" label="Condition" rules={[{ required: true }]}>
            <Select
                placeholder="Select a Condition"
                allowClear
                >
                    <Option  value="volume">Volume</Option>
                    <Option  value="promotion">Promotion</Option>
                    <Option  value="customerType">Customer Type</Option>
                    <Option  value="price">Price</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Discount Percentage"
            name="discountPercentage"
            rules={[
              {
                required: true,
                message: 'Please enter the Discount Percentage!',
              },
            ]}
          >
            <InputNumber
            min={0}
            style={{ width: '100%' }}/>
          </Form.Item>

          <Form.Item
            label="Quantitiy Threshold"
            name="threshold"
          >
            <InputNumber
            min={0}
            style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="customerType" label="Customer Type" >
            <Select
                mode="multiple"
                placeholder="Select a Condition"
                allowClear
                >
                    <Option  value="Regular">Regular</Option>
                    <Option  value="VIP">VIP</Option>
                    <Option  value="Gold">Gold Type</Option>
                    <Option  value="Silver">Silver</Option>
            </Select>
          </Form.Item>

          <Form.Item name="active" label="Active Status" rules={[{ required: true}]}>
            <Radio.Group >
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Inactive</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="startDate" label="Start date">
            <DatePicker
                disabledDate={(current) => current && current < moment().endOf('day')}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"    
                placeholder="Select a date"
            />
          </Form.Item>

          <Form.Item name="endDate" label="End date" >
            <DatePicker
                disabledDate={(current) => current && current < moment().endOf('day')}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"     
                placeholder="Select a date" 
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 16,
              span: 16,
            }}
            className=''
          >
            
            <Button htmlType="button" onClick={handleAddCancel}>
              Cancel
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

export default PricingRuleAddModal
