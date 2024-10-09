import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import InventoryCardComponent from '../../components/InventoryCardComponent/InventoryCardComponent'
import { Breadcrumb, Button } from 'antd'
import { FaEdit, FaPlus } from 'react-icons/fa'
import { MdDelete, MdOutlineDeleteOutline } from 'react-icons/md'
import WarehouseEditModal from '../../components/Modals/WarehouseEditModal/WarehouseEditModal'
import WarehouseDeleteModal from '../../components/Modals/WarehouseDeleteModal/WarehouseDeleteModal'
import { TbLayoutDashboardFilled } from 'react-icons/tb'
import AddInventoryModal from '../../components/Modals/AddInventoryModal/AddInventoryModal'
import { getSocket, initiateSocketConnection } from '../../utilities/socketService'
import { toast } from 'react-toastify'

const WarehousePage = () => {

    const [warehouseData, setWarehouseData] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    const {warehouseId} = useParams()
    const location = useLocation()

    const handleEditCancel = () => {
      setIsEditModalOpen(false)
    }

    const handleDeleteCancel = () => {
      setIsDeleteModalOpen(false)
    }

    const handleAddCancel = () => {
      setIsAddModalOpen(false)
    }
    
    useEffect(() => {
      if(location.state && location.state.openAddModal){
        setIsAddModalOpen(true)
      }
      else{
        setIsAddModalOpen(false)
      }
      if(location.state && location.state.openEditModal){
        setIsEditModalOpen(true)
      }
      else{
        setIsEditModalOpen(false)
      }
      if(location.state && location.state.openDeleteModal){
        setIsDeleteModalOpen(true)
      }
      else{
        setIsDeleteModalOpen(false)
      }
        const getWarehouseData = async() => {
            try{
                const response = await axios.get(
                  `/warehouse/${warehouseId}`,
                  {
                    withCredentials: true
                  }
                )
                if(response.status === 200){
                    setWarehouseData(response.data)
                }
            }
            catch (error) {
                if (error.response) {
                  if (error.response.status === 404) {
                    toast.error("Warehouse Not Found");
                  } else if (error.response.status === 500) {
                    toast.error("An error occurred while fetching the warehouse");
                  } else {
                    toast.error(`An error occurred: ${error.response.status}`);
                  }
                } else if (error.request) {
                  toast.error("No response from server. Please try again.");
                } else {
                  toast.error("An unexpected error occurred. Please try again.");
                }
              }
        }
        getWarehouseData()
      },[location.state])
      
    useEffect(() => {
      initiateSocketConnection()
      const socket = getSocket()
  
      socket.on("warehouseUpdated", (updatedWarehouse) => {
        setWarehouseData(prevState => ({
          ...prevState,  
          warehouseData: updatedWarehouse
      }));
      })

      socket.on("inventoryAdded", (addedProductWithDetail) => {
        setWarehouseData(prevState => ({
          ...prevState,  
          availableProducts:[...prevState.availableProducts, addedProductWithDetail]  
        }));
      })

      socket.on("inventoryDeleted", (deletedInventory) => {
        setWarehouseData(prevState => ({
          ...prevState,  
          availableProducts: prevState.availableProducts.filter((inventory) => 
            inventory._id !== deletedInventory._id
          )  
        }));
      })

      socket.on("inventoryUpdated", (updatedInventoryWithDetail) => {
        setWarehouseData(prevState => ({
          ...prevState,
          availableProducts: prevState.availableProducts.map(inventory => 
            inventory._id === updatedInventoryWithDetail._id
              ? updatedInventoryWithDetail 
              : inventory 
          )
        }));
      });
  
      return () => {
        socket.disconnect()
      }
    },[])

  return (
    <div>
      <Breadcrumb className='text-headerText text-base'
              items={[
                {
                  title: <Link to={"/admin/dashboard"}><TbLayoutDashboardFilled className='text-xl'/></Link>,
                },
                {
                  title: <Link to={"/admin/warehouse"}>Warehouse</Link>,
                },
                {
                  title: warehouseData && warehouseData.warehouseData && warehouseData.warehouseData.warehouseName,
                },
              ]}
            />
      {
        warehouseData !== null ? 
        <div className='shadow-custom-medium rounded-md w-full flex flex-col min-h-[78vh] px-5 py-5'>
            
            <div className='flex items-center justify-between '>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-3xl font-bold text-gray-800'>{warehouseData.warehouseData.warehouseName}</h1>
                    <h3 className='text-gray-600'>{warehouseData.warehouseData.location.city + "," + warehouseData.warehouseData.location.state + "," + warehouseData.warehouseData.location.country}</h3>
                </div>
                <div className='flex items-center gap-3'>
                  <Button onClick={() => setIsEditModalOpen(true)}><FaEdit className='text-base' />Edit</Button>
                  <Button type='primary' onClick={() => setIsAddModalOpen(true)}><FaPlus className='text-base' />Add Products</Button>
                  <Button onClick={() => setIsDeleteModalOpen(true)} color='danger' variant='solid'><MdDelete className='text-base' />Delete</Button>
                </div>
                
            </div>

            <div className='flex gap-20 py-5'>
              <div className='flex items-end gap-2'>
                  <h4 className='text-base text-gray-700 font-medium'>Capacity: </h4>
                  <span className='text-3xl font-semibold'>{warehouseData.warehouseData.capacity}<span className='text-base text-gray-600 font-medium'>Products</span></span>
              </div>
              <div className='flex items-end gap-2'>
                  <h4 className='text-base text-gray-700 font-medium'>InStock:</h4>
                  <span className='text-3xl font-semibold'>{warehouseData.inStock}<span className='text-base text-gray-600 font-medium'>Products</span></span>
              </div>
              <div className='flex items-end gap-2'>
                  <h4 className='text-base text-gray-700 font-medium'>Available Space:</h4>
                  <span className='text-3xl font-semibold'>{warehouseData.warehouseData.capacity - warehouseData.inStock}<span className='text-base text-gray-600 font-medium'>Products</span></span>
              </div>
            </div>

            <div className='pt-5'>
                <h1 className='text-2xl font-bold text-gray-800'>Stocked Products</h1>
                <div className='flex items-center border-b border-b-gray-400'>
                    <h1 className='w-1/6 py-3 px-4 text-sm font-semibold'>Product</h1>
                    <h1 className='w-1/6 py-3 px-4 text-sm font-semibold'>Category</h1>
                    <h1 className='w-1/6 py-3 px-4 text-sm font-semibold'>Stock Level</h1>
                    <h1 className='w-1/6 py-3 px-4 text-sm font-semibold'>Reserved Stock</h1>
                    <h1 className='w-1/6 py-3 px-4 text-sm font-semibold'>Stock Threshold</h1>
                </div>
                <div className='overflow-y-scroll no-scrollbar'>
                    {
                        warehouseData.availableProducts && warehouseData.availableProducts.length !== 0 ?
                        warehouseData.availableProducts.map((inventory, index) => (
                            <InventoryCardComponent inventory={inventory} key={index} index={index}/>
                        ))
                        :
                        <div>No product stocked in this warehouse</div>
                    }
                </div>
            </div>
        </div>
        :
        <div className='h-full w-full flex items-center justify-center text-2xl font-semibold'>Warehouse Not found</div>
      }
      {
        warehouseData && warehouseData.warehouseData &&
        <div>
          <WarehouseEditModal warehouse={warehouseData.warehouseData} isModalOpen={isEditModalOpen} handleCancel={handleEditCancel}/>
          <WarehouseDeleteModal warehouse={warehouseData.warehouseData} isDeleteModalOpen={isDeleteModalOpen} handleDeleteCancel={handleDeleteCancel}/>
          <AddInventoryModal warehouse={warehouseData.warehouseData._id} spaceAvailable={warehouseData.warehouseData.capacity - warehouseData.inStock} isAddModalOpen={isAddModalOpen} handleAddCancel={handleAddCancel}/>
        </div>
      }
    </div>
  )
}

export default WarehousePage
