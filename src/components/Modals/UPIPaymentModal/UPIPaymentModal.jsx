import {  Button, Form, Input, InputNumber, Modal, Select } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const UPIPaymentModal = ({isUPIpaymentModalOpen, handleModalClose, paymentMethod, orderDetails}) => {

    const [isModalOpen, setIsModalOpen] = useState(isUPIpaymentModalOpen)
    const [isUpiDone, setUpiDone] = useState(false)

    const [form] = Form.useForm() 

    const navigate = useNavigate()

    const processOrder = async(paymentMethod) => {
        const orderData = {
          products: orderDetails.orderItems.map((item) => {
            return {
              product: item.productDetails._id,
              quantity: item.quantity,
              price: item.productDetails.price
            }
          }),
            platformFee: orderDetails.priceDetails.platformFee,
            totalAmount: orderDetails.priceDetails.totalPrice,
            discountedAmount: orderDetails.priceDetails.totalDiscount,
            payableAmount : orderDetails.priceDetails.totalPayable,
            paymentInfo: {
              paymentMethod: paymentMethod,
              paymentStatus: paymentMethod === "cash" ? "pending" : "completed",
            }
        }
    
        try {
          const response = await axios.post(`/order/add`, 
            orderData,
            { withCredentials: true }) 
    
          if (response.status === 201) {
            await Promise.all(orderDetails.orderItems.map(item =>
                axios.post(
                  '/userActivity/track',
                  {
                    action: 'purchase',
                    productId: item.productDetails._id, // Track each product
                    additionalInfo: { quantity: item.quantity, paymentMethod: paymentMethod },
                  },
                  {
                    withCredentials: true,
                  }
                )
              )) 
            toast.success("Order placed succesfully")
            handleModalClose()
            setIsModalOpen(false)
            navigate("/orders")
          }
        } catch (error) {
            if (error.response) {
              toast.error(`Error while placing the order: ${error.response.status} - ${error.response.data.message}`) 
            } else {
              toast.error("An unexpected error occurred while placing the order. Please try again.") 
            }
        }
    }

    const handleModalDone = () => {
        if(isUpiDone){
            processOrder(paymentMethod)
        }
        else{
            setUpiDone(true)
        }
    }

    useEffect(() => {
        if(isUPIpaymentModalOpen){
            setIsModalOpen(true)
        }
        else{
            setIsModalOpen(false)
        }
      }, [isUPIpaymentModalOpen])

  return (
    <div>
      <Modal 
        title="UPI Payment" 
        open={isModalOpen} 
        onCancel={handleModalClose}
        footer={[]}
        
      >
        {
            isUpiDone ? 
            <div className='flex flex-col gap-10 items-center'>
                <div className='flex flex-col items-center w-full gap-4'>
                    <p className='text-lg '>Request sent to the Entered UPI id</p>
                    <p className='text-lg font-medium'>Open UPI payment app and proceed the payment</p>
                </div>
                <Button className='w-40' type='primary' htmlType="button" onClick={handleModalDone}>
                Done
                </Button>
            </div>
            :
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
            onFinish={handleModalDone}
            autoComplete="off"
            >
            <Form.Item
                label="UPI ID"
                name="upiId"
                rules={[
                {
                    required: true,
                    message: 'Please enter the UPI ID',
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
                
                <Button htmlType="button" onClick={handleModalClose}>
                Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                Done
                </Button>
            </Form.Item>
            </Form>
        }
      </Modal>
    </div>
  )
}

export default UPIPaymentModal
