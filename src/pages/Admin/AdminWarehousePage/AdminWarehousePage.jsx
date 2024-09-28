import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Dropdown, Form, Input, Menu, Modal, Space } from 'antd';
import { Link } from 'react-router-dom';
import { TbLayoutDashboardFilled } from 'react-icons/tb';
import { FaPlus } from 'react-icons/fa6';
import { IoChevronDown, IoSearch } from 'react-icons/io5';
import WarehouseCardComponent from '../../../components/WarehouseCardComponent/WarehouseCardComponent';
import axios from 'axios';


const AdminWarehousePage = () => {

  const [warehouseSearch, setWarehouseSearch] = useState("")
  const [isSortOrFilterApplied, setIsSortOrFilterApplied] = useState(false)
  const [warehousesData, setWarehousesData] = useState([])
  const [filteredWarehouseData, setFilteredWarehouseData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [warehouseInputData, setWarehouseInputData] = useState({})

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async(values) => {
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
      const response = await axios.post(
        "warehouse/add",
        warehouseInputData)

      if(response.status === 201){
        alert("Warehouse added successfully")
        setIsModalOpen(false)
      }
      
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          alert("Warehouse already exists");
        } else if (error.response.status === 500) {
          alert("An error occurred while adding the warehouse");
        } else {
          alert(`An error occurred: ${error.response.status}`);
        }
      } else if (error.request) {
        alert("No response from server. Please try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleFormChange = (changedValues, allValues) => {
    setWarehouseInputData(allValues);
  };

  const handleFormClear = () => {
    form.resetFields()
  }

  const handleClear = () => {
    setIsSortOrFilterApplied(false)
    setWarehouseSearch("")
  }

  useEffect(() => {
    const getWarehousesData = async() => {
      try{
        const response = await axios.get("warehouse/")
        setFilteredWarehouseData(response.data)
        setWarehousesData(response.data)
      }
      catch (error) {
        console.error('Error fetching warehouse data:', error);
      }
    }
    getWarehousesData()
    
  },[])

  useEffect(() => {
    const searchQuery = warehouseSearch.trim().toLowerCase();
    if(warehouseSearch.length !== 0){
      setIsSortOrFilterApplied(true)
    }
    else{
      setIsSortOrFilterApplied(false)
    }
    const filteredData = Array.isArray(warehousesData) && warehousesData.length > 0 &&
      warehousesData.filter((warehouse) =>
      warehouse.warehouseName.toLowerCase().includes(searchQuery) || 
      warehouse.location.city.toLowerCase().includes(searchQuery) ||
      warehouse.location.state.toLowerCase().includes(searchQuery) ||
      warehouse.location.country.toLowerCase().includes(searchQuery) 
    );
    setFilteredWarehouseData(filteredData);
  }, [warehouseSearch, warehousesData])

  return (
    <div className='w-full'>
      <div className='breadcrum-container'>
        <Breadcrumb className='text-headerText text-base'
          items={[
            {
              title: <Link to={"/admin/dashboard"}><TbLayoutDashboardFilled className='text-xl'/></Link>,
            },
            {
              title: "Warehouses",
            },
          ]}
        />
      </div>

      <div className=' shadow-custom-medium rounded-md w-full flex flex-col h-[75vh]'>
        <div className='flex items-center justify-between px-5 py-5'>
          <h1 className='text-2xl font-medium text-headerText'>Warehouses</h1>
          <button 
            className='bg-primaryBlue text-white rounded-md px-2 py-1.5 flex items-center gap-2'
            onClick={showModal}
          >
            <FaPlus /> Add New Warehouse
          </button>
        </div>

        <div className=' search-filter-container  flex items-center justify-between px-5'>
          <div className='rounded-md py-1 px-2 shadow-custom-light flex items-center gap-2 w-1/2'>
            <IoSearch className='text-xl text-gray-400'/>
            <input 
              className=' focus:outline-none w-full' 
              type='search' 
              name='search' 
              placeholder='Search Warehouse'
              value={warehouseSearch}
              onChange={(event) => setWarehouseSearch(event.target.value)}
            />
          </div>
          <div className='flex items-center gap-4'>
            {/* <Space direction="vertical">
              <Space wrap>
                <Dropdown menu={sortMenu} placement="bottom" arrow className='border-none shadow-custom-light text-gray-500 w-28'>
                  <Button>{sortButtonContent ? sortButtonContent : "Sort by "}<IoChevronDown className='text-sm'/></Button>
                </Dropdown>
              </Space>
            </Space> */}
            <button 
              className={`flex items-center gap-2 rounded-md shadow-custom-light px-4 py-1.5 text-sm ${isSortOrFilterApplied ? "bg-primaryBlue text-white " : 'bg-white text-gray-300 cursor-not-allowed'}`}
              onClick={handleClear}
            > 
              Clear 
            </button>
          </div>
        </div>  

        <div className='px-5 w-full'>
          <div className='flex items-center border-b border-b-gray-400'>
            <h1 className='w-1/5 py-3 px-4 text-sm font-semibold'>Warehouse</h1>
            <h1 className='w-1/5 py-3 px-4 text-sm font-semibold'>Location</h1>
            <h1 className='w-1/5 py-3 px-4 text-sm font-semibold'>Capacity</h1>
            <h1 className='w-1/5 py-3 px-4 text-sm font-semibold'>InStock</h1>
          </div>
          <div className='overflow-y-scroll h-[50vh] no-scrollbar'>
          {
            Array.isArray(filteredWarehouseData) && filteredWarehouseData.length > 0 ?
            filteredWarehouseData?.map((warehouse, index) => (
              <WarehouseCardComponent warehouse={warehouse} key={index}/>
            ))
            : <div>No data found</div>
          }
          </div>
        </div>  
      </div>

      <Modal 
        title="Add new Vendor" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
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
          onValuesChange={handleFormChange}
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

export default AdminWarehousePage
