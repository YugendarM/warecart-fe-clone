import {  Button, Form, Input, InputNumber, Modal, Select } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ReactStars from "react-rating-stars-component";
import TextArea from 'antd/es/input/TextArea'

const ReviewModal = ({isReviewModalOpen, handleModalClose, product}) => {

    const [isModalOpen, setIsModalOpen] = useState(isReviewModalOpen)

    const [form] = Form.useForm() 

    const navigate = useNavigate()

    const handleModalDone = async(values) => {
        const reviewData = {
            rating: values.rating,
            comment: values.comment
        }
        try{
            const response = await axios.post(
                `product/review/${product?.productDetails?._id}`,
                reviewData,
                {
                withCredentials: true,
                },
                
            )
        
            if(response.status === 201){
                toast.success("Review added successfully")
                setIsModalOpen(false)
                handleModalClose()
            }            
        }
        catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                toast.error(`An error occurred: ${error.response.status}  ${error.message}`) 
                }else if (error.response.status === 400) {
                toast.error("Product already reviewed") 
                setIsModalOpen(false)
                handleModalClose()
                } else if (error.response.status === 500) {
                toast.error("An error occurred while adding the review") 
                } else {
                toast.error(`An error occurred: ${error.response.status} ${error.response.message}`) 
                }
            } else if (error.request) {
                toast.error("No response from server. Please try again.") 
            } else {
                toast.error("An unexpected error occurred. Please try again.") 
            }
        }
    }

    useEffect(() => {
        if(isReviewModalOpen){
            setIsModalOpen(true)
        }
        else{
            setIsModalOpen(false)
        }
      }, [isReviewModalOpen])

  return (
    <div>
      <Modal 
        title={`Rate and Review ${product?.productDetails?.productName}`} 
        open={isModalOpen} 
        onCancel={handleModalClose}
        footer={[]}
        
      >
        
        <Form
            form = {form}
            name="basic"
            labelCol={{
                span: 6,
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
            label="Rating"
            name="rating"
            >
                <ReactStars
                    count={5}
                    size={32}
                    isHalf={true}
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    activeColor="#ffd700"
                />
            </Form.Item>

            <Form.Item
                label="Review"
                name="comment"
            >
                <TextArea rows={4} />
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
        
      </Modal>
    </div>
  )
}

export default ReviewModal
