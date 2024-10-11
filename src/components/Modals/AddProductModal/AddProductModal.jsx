import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Dropdown, Form, Input, InputNumber, Menu, Modal, Select, Space, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';

const AddProductModal = ({isAddModalOpen, handleAddCancel}) => {

    const [isModalOpen, setIsModalOpen] = useState(isAddModalOpen)

    const [fileList, setFileList] = useState([]);

    const [form] = useForm()
    const { Option } = Select;

    const handleOk = () => {
        setIsModalOpen(false);
      };

      const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
      };

      const beforeUpload = (file) => {
        setFileList((prevList) => [...prevList, file]);
        return false; // Prevent automatic upload
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

        const formData = new FormData()
        formData.append('productName', values.productName)
        formData.append('productType', values.productType)
        formData.append('productDescription', values.productDescription)
        formData.append('price', values.price)
        fileList.forEach((file, index) => {
          console.log(`File ${index}:`, file); // Debugging file structure
          // console.log(`File ${index} originFileObj:`, file.originFileObj);
          formData.append('images', file);
        });

        console.log(formData)
        try{
          const response = await axios.post(
            "product/add",
            formData,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
            
          )
    
          if(response.status === 201){
            toast.success("Product added successfully")
            setIsModalOpen(false)
            handleAddCancel()
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
            name="images"
            label="Images"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload name="logo"
          listType="picture"
          beforeUpload={beforeUpload}
          fileList={fileList}
          onRemove={(file) => {
            setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
          }}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
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
