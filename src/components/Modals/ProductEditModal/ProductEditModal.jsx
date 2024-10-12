import React, { useEffect, useState } from 'react' 
import { Button, Form, Input, InputNumber, Modal, Select, Upload } from 'antd' 
import axios from 'axios' 
import { toast } from 'react-toastify' 
import { UploadOutlined } from '@ant-design/icons' 

const ProductEditModal = ({ product, isEditModelOpen, handleEditCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(isEditModelOpen) 
  const [fileList, setFileList] = useState([]) 

  const initialValues = {
    productName: product.productName,
    productType: product.productType,
    productDescription: product.productDescription,
    price: product.price,
  } 

  const [form] = Form.useForm() 
  const { Option } = Select 

  const handleOk = () => {
    setIsModalOpen(false) 
  } 

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e 
    }
    return e && e.fileList 
  } 

  const beforeUpload = (file) => {
    setFileList((prevList) => [...prevList, file]) 
    return false  
  } 

  const handleSubmit = async (values) => {
    const productInputData = {
      productName: values.productName,
      productType: values.productType,
      productDescription: values.productDescription,
      price: values.price,
      existingImages: fileList
        .filter((file) => file.status === 'done')?.map((file) => file.url || file.response.url),
    } 

    const newImages = fileList.filter((file) => file.status !== 'done') 

    const formData = new FormData() 
    formData.append("productName", values.productName)
    formData.append("productDescription", values.productDescription)
    formData.append("productType", values.productType)
    formData.append("price", values.price)
    newImages.forEach((file) => {
      formData.append('images', file)  
    }) 

    try {
      const response = await axios.put(
        `product/update/${product._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      ) 

      if (response.status === 200) {
        toast.success('Product updated successfully') 
        handleEditCancel() 
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          toast.error('Product does not exist') 
        } else if (error.response.status === 500) {
          toast.error('An error occurred while editing the product') 
        } else {
          toast.error(`An error occurred: ${error.response.status}`) 
        }
      } else if (error.request) {
        toast.error('No response from server. Please try again.') 
      } else {
        toast.error('An unexpected error occurred. Please try again.') 
      }
    }
  } 


  useEffect(() => {
    if (isEditModelOpen) {
      setIsModalOpen(true) 
    } else {
      setIsModalOpen(false) 
    }
  }, [isEditModelOpen]) 

  useEffect(() => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      const formattedImages = product?.imageUrls?.map((url, index) => ({
        uid: index,
        name: `Image-${index + 1}`,
        status: 'done',
        url, 
      })) 
      setFileList(formattedImages) 
    }
  }, [product.imageUrls]) 

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
          form={form}
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

          <Form.Item
            name="productType"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a Product" allowClear>
              <Option value="book">Book</Option>
              <Option value="mobile">Mobile</Option>
              <Option value="pen">Pen</Option>
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
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="images"
            label="Images"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture"
              beforeUpload={beforeUpload}
              fileList={fileList}
              defaultFileList = {fileList}
              onRemove={(file) => {
                setFileList((prevList) =>
                  prevList.filter((item) => item.uid !== file.uid)
                ) 
              }}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 16,
              span: 16,
            }}
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
