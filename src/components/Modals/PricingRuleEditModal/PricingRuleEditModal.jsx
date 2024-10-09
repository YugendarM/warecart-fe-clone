import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Form, Input, InputNumber, Modal, Radio, Select } from 'antd' 
import axios from 'axios' 
import moment from 'moment' 
import { toast } from 'react-toastify'


const PricingRuleEditModal = ({rule, isEditModalOpen, handleEditCancel}) => {

    const [isModalOpen, setIsModalOpen] = useState(isEditModalOpen)

    const initialValues = {
        name: rule.name,
        condition: rule.condition,
        threshold: rule.threshold ? rule.threshold : null,
        discountPercentage: rule.discountPercentage,

        customerType: rule.customerType,
        active: rule.active,
        startDate: rule.startDate ? moment(rule.startDate) : null,
        endDate: rule.endDate ? moment(rule.endDate) : null
      }
    
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
          const response = await axios.put(
            `pricingRule/update/${rule._id}`,
            pricingRuleInputData,
            {
              withCredentials: true
            }
          )
    
          if(response.status === 200){
            toast.success("Pricing Rule updated successfully")
            setIsModalOpen(false)
            handleEditCancel()
          }
          
        }
        catch (error) {
          if (error.response) {
            if (error.response.status === 404) {
              toast.error("Product does not exists") 
            } else if (error.response.status === 500) {
              toast.error("An error occurred while updating the pricing rule") 
            } else {
              toast.error(`An error occurred: ${error.response.status}`) 
            }
          } else if (error.request) {
            toast.error("No response from server. Please try again.") 
          } else {
            toast.error("An unexpected error occurred. Please try again.") 
          }
        }
      }

      useEffect(() => {
        if(isEditModalOpen){
            setIsModalOpen(true)
        }
        else{
            setIsModalOpen(false)
        }
      }, [isEditModalOpen])

  return (
    <div>
      <Modal 
        title={`Edit ${rule.name}`} 
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
                // onChange={onGenderChange}
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
                // onChange={onGenderChange}
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
                format="YYYY-MM-DD"     // Format for displaying the date
                placeholder="Select a date" // Placeholder for the input field
            />
          </Form.Item>

          <Form.Item name="endDate" label="End date" >
            <DatePicker
                disabledDate={(current) => current && current < moment().endOf('day')}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"     // Format for displaying the date
                placeholder="Select a date" // Placeholder for the input field
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
    </div>
  )
}

export default PricingRuleEditModal
