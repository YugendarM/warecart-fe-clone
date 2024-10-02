import React from 'react'
import { Button, Form, Input } from 'antd';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SignupPage = () => {

    const [form] = Form.useForm()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = async(values) => {
        console.log(values)
        const userData = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password
        }
        try{
            const response = await axios.post(
              "/user/signup",
              userData,
              {
                withCredentials: true
              }
            )

            if(response.status === 201){
                alert("User Signed Up")
                if(location.state){
                  navigate("/checkout", {
                    state: {
                      products: location.state.products
                    }
                  })
                }
                else{
                  navigate("/")
                }
            }
        }
        catch (error) {
            if (error.response) {
              if (error.response.status === 500) {
                alert(`${error.response.data.message}`);
              } else {
                alert(`An error occurred: ${error.response.status} ${error.response.data.message}`);
              }
            } else if (error.request) {
              alert("No response from server. Please try again.");
            } else {
              alert("An unexpected error occurred. Please try again.");
            }
          }
    }
  return (
    <div className='w-screen h-[89vh] flex justify-center items-center bg-gray-100'>
      <div className='p-10 shadow-lg bg-white rounded-lg text-lg w-[400px]'>
        <h2 className='text-3xl mb-8 font-semibold text-center'>Signup</h2>
        <Form
            form={form}
          name="signup"
          layout="vertical" // Change form layout to vertical for better alignment
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          autoComplete="off"
        >
            <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input
              className='p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-normal'
              placeholder="Enter your first name"
            />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Please input your last name!' }]}
          >
            <Input
              className='p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-normal'
              placeholder="Enter your last name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              className='p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-normal'
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
                { required: true, message: 'Please input your password!' },
                { min: 8, message: 'Password must be at least 8 characters long and maximum of 25 characters.', max: 25 },
              ]}
          >
            <Input.Password
              className='p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-normal'
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md'
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div className='flex text-xs w-full justify-center gap-1'>
          <p>Already have an account!</p>
          <Link to={"/login"} className='text-blue-500 hover:text-blue-400 underline'>Login</Link>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
