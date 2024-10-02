import React from 'react'
import { Button, Form, Input } from 'antd';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const [form] = Form.useForm()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSignUpButton = (event) => {
      event.preventDefault()
      if(location.state){
        navigate("/signup", {
          state: {
            products: location.state.products 
          }
        })
      }
      else{
        navigate("/signup")
      }
    }

    const handleSubmit = async(values) => {
        console.log(values)
        const userData = {
            email: values.email,
            password: values.password
        }
        try{
            const response = await axios.post(
              "/user/login", 
              userData,
              {
                withCredentials: true
              }
            )

            if(response.status === 200){
                alert("User logged In")
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
                alert("An error occurred while Login");
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
        <h2 className='text-3xl mb-8 font-semibold text-center'>Login</h2>
        <Form
            form={form}
          name="login"
          layout="vertical" // Change form layout to vertical for better alignment
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          autoComplete="off"
        >

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
          <p>Don't have an account!</p>
          <button onClick={(event) => handleSignUpButton(event)} to={"/signup"} className='text-blue-500 hover:text-blue-400 underline'>Signup</button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
