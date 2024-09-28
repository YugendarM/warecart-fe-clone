import { Button, Modal } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const WarehouseDeleteModal = ({warehouse, isDeleteModalOpen, handleDeleteCancel}) => {

    const [isModalOpen, setIsModalOpen] = useState(isDeleteModalOpen)

    const handleDeleteConform = async() => {
        console.log("handleconform")
        try{
          const response = await axios.delete(`warehouse/delete/${warehouse._id}`)
    
          if(response.status === 200){
            alert("Warehouse deleted successfully")
            setIsModalOpen(false)
          }
          
        }
        catch (error) {
          if (error.response) {
            if (error.response.status === 404) {
              alert("Warehouse does not exists");
            } else if (error.response.status === 500) {
              alert("An error occurred while adding the warehouse");
            } else {
              alert(`An error occurred: ${error.response.status}`);
            }
          } else if (error.request) {
            console.log(error.request);
            alert("No response from server. Please try again.");
          } else {
            console.log('Error', error.message);
            alert("An unexpected error occurred. Please try again.");
          }
        }
      }

    useEffect(() => {
        if(isDeleteModalOpen){
            setIsModalOpen(true)
        }
        else{
            setIsModalOpen(false)
        }
    },[isDeleteModalOpen])
    
  return (
    <div>
      <Modal 
        title="Are you sure?" 
        open={isModalOpen} 
        onCancel={handleDeleteCancel}
        footer={[]}
        
      >
        <p>Do you really want to delete the {warehouse.warehouseName}?</p>
        <div className='flex justify-end gap-4 py-5'>
            <Button htmlType="button" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button color="danger" variant="solid" onClick={() => handleDeleteConform()}>
              Delete
            </Button>

        </div>
      </Modal>
    </div>
  )
}

export default WarehouseDeleteModal
