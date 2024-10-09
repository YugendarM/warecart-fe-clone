import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { FaBoxOpen, FaCartShopping, FaHeart, FaRegHeart } from 'react-icons/fa6'
import { IoPowerSharp } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Form, Input, InputNumber, Radio } from 'antd' 
import { toast } from 'react-toastify'

const UserProfilePage = () => {

    const navigate = useNavigate()
    const [userData, setUserData] = useState({})
    const [isEditOpen, setIsEditOpen] = useState(false)

    const [form] = Form.useForm() 


    const handleLogout = async() => {
        try{
            const response = await axios.post(
                '/user/logout',
                {}, 
            {
                withCredentials: true
            })
      
            if(response.status === 200){
              toast.success("User Loged out")
              navigate("/")
            }
            
          }
          catch (error) {
            if (error.response) {
              if (error.response.status === 500) {
                toast.error("An error occurred while Logging out");
              }
              else if (error.response.status === 204) {
                toast.error(`An error occurred: ${error.response.status} ${error.response.data.message}`);
              } else {
                toast.error(`An error occurred: ${error.response.status} ${error.response.data.message}`);
              }
            } else if (error.request) {
              toast.error("No response from server. Please try again.");
            } else {
              toast.error("An unexpected error occurred. Please try again.");
            }
          }
    }


    const getUserDetails = async () => {
      try {
          const response = await axios.get("/user/getUserDetails", { withCredentials: true }) 
          if (response.status === 200) {
              setUserData(response.data) 
          }
      } catch (error) {
          if (error.response) {
            toast.error(`Error: ${error.response.status} - ${error.response.data.message}`) 
          } else {
            toast.error("An unexpected error occurred in fetching user details. Please try again.") 
          }
      }
  } 

  const handleEditProfile = async(values) => {
    try {
      const response = await axios.put(`/user/updateUserAddress`, {
          addressFirstLine: values.addressFirstLine,
          addressSecondLine: values.addressSecondLine,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
          phoneNo: values.phoneNo,
      }, { withCredentials: true }) 

      if (response.status === 200) {
          toast.success("User updated successfully") 
          getUserDetails() 
          setIsEditOpen(false)
      }
    } catch (error) {
        if (error.response) {
          toast.error(`Error: ${error.response.status} - ${error.response.data.message}`) 
        } else {
          toast.error("An unexpected error occurred. Please try again.") 
        }
    }
  }

    useEffect(() => {
      getUserDetails()
    }, [])
    
  return (
    <div className='px-56 flex gap-5 py-10 w-full'>
      <div className='w-[30%] flex flex-col gap-6 min-h-[80vh]'>

        <div className='rounded-sm bg-white shadow-custom-medium flex items-center gap-6 px-4 py-4 '>
          <div className='h-12 w-12 rounded-full'>
            <img className='h-full w-full object-cover rounded-full' src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png'/>
          </div>
          <div>
            <p className='text-xs text-gray-700'>Hello,</p>
            <p className='text-base font-medium'>{userData?.firstName} {userData?.lastName}</p>
          </div>
        </div>

        <div className='rounded-sm bg-white shadow-custom-medium flex flex-col items-center h-full'>
          <button onClick = {() => setIsEditOpen(true)} className='w-full text-center flex items-center justify-start gap-4 text-gray-500 font-medium text-base py-4 px-6 hover:text-blue-500'><AiFillEdit className='text-blue-500 text-2xl'/>Edit Profile</button>
          <button onClick={handleLogout} className='border-y border-y-gray-300 w-full text-center flex items-center justify-start gap-4 text-gray-500 font-medium text-base py-4 px-6 hover:text-blue-500'><IoPowerSharp className='text-blue-500 text-2xl'/>Logout</button>
        </div>
      </div>

      <div className='w-[70%] rounded-sm bg-white shadow-custom-medium flex flex-col gap-6 px-4 py-4'>
        <div className=' '>
          <div>
            <h1 className='text-3xl font-semibold text-gray-800'>{userData?.firstName} {userData?.lastName}</h1>
            <p className='text-base text-gray-500'>{userData?.email}</p>
          </div>
        </div>

        {
          isEditOpen ? 
            <div className='w-full'>
              <h1 className='text-lg font-medium text-gray-600'>Edit Profile</h1>
                <Form
                    initialValues={userData}
                    form={form}
                    name="basic"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 16 }}
                    style={{ width: 500 }}
                    onFinish={handleEditProfile}
                    autoComplete="off"
                >
                    <Form.Item label="Address First Line" name="addressFirstLine" rules={[{ required: true, message: 'Please enter the Address First Line!' }]}>
                        <Input style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Address Second Line" name="addressSecondLine" rules={[{ required: true, message: 'Please enter the Address Second Line!' }]}>
                        <Input style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="City" name="city" rules={[{ required: true, message: 'Please enter the City!' }]}>
                        <Input style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="State" name="state" rules={[{ required: true, message: 'Please enter the State!' }]}>
                        <Input style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Pincode" name="pincode" rules={[{ required: true, message: 'Please enter the Pincode!' }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phoneNo" rules={[{ required: true, message: 'Please enter the Phone Number!' }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 17, span: 10 }} style={{ gap: "20px" }}>
                        <Button htmlType="button" onClick={() => form.resetFields()}>
                            Clear
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </div>
          :
          <>
            {
              userData?.phoneNo &&
              <div>
                <p className='text-gray-500 text-sm '>Phone Number: </p>
                <p className='text-gray-800 font-medium text-lg'>+91 {userData?.phoneNo}</p>
              </div>
            }

            {
              userData?.addressFirstLine &&
              <div>
                <p className='text-gray-500 text-sm '>Address: </p>
                <div>
                  <p className='text-gray-800 font-medium text-base'>{userData?.addressFirstLine+", "}</p>
                  <p className='text-gray-800 font-medium text-base'>{userData?.addressSecondLine+ ", "}</p>
                  <p className='text-gray-800 font-medium text-base'>{userData?.city}{", "+userData?.state}{"," + userData?.country? userData?.country : null} </p>
                  <p className='text-gray-800 font-semibold text-base'>{userData?.pincode} </p>
                </div>
              </div>
            }
          </>
        }

        <div className='flex flex-col gap-6'>
          <div className='grid grid-cols-2 gap-12'>
            <Link to={"/cart"} className='border-2 border-gray-300 py-2 px-4 rounded-sm text-blue-500 text-base flex items-center gap-4 w-full hover:border-gray-500 transition hover:bg-blue-50'><FaCartShopping  className='text-blue-500 text-2xl' />My Cart</Link>
            <Link to={"/orders"} className='border-2 border-gray-300 py-2 px-4 rounded-sm text-blue-500 text-base flex items-center gap-4 w-full hover:border-gray-500 transition hover:bg-blue-50'><FaBoxOpen  className='text-blue-500 text-2xl' />My Orders</Link>

          </div>

          <div className='grid grid-cols-2 gap-12'>
            <Link to={"/wishlist"} className='border-2 border-gray-300 py-2 px-4 rounded-sm text-blue-500 text-base flex items-center gap-4 w-full hover:border-gray-500 transition hover:bg-blue-50'><FaHeart  className='text-blue-500 text-2xl' />My Wishlist</Link>
          </div>
        </div>


      </div>

    </div>
  )
}

export default UserProfilePage
