import React from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import AdminSideNavbar from '../../../components/AdminSideNavbar/AdminSideNavbar'
import AdminWarehousePage from '../AdminWarehousePage/AdminWarehousePage'
import AdminProductsPage from '../AdminProductsPage/AdminProductsPage'
import AdminDashboardPage from '../AdminDashboardPage/AdminDashboardPage'
import WarehousePage from '../../WarehousePage/WarehousePage'
import ProductPage from '../../ProductPage/ProductPage'

const AdminPageComponent = () => {
  return (
    <div className='flex'>
      <AdminSideNavbar/>
      <div className='w-full md:w-3/4 flex'>
        <div className='w-full md:mt-10 '>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path='/dashboard' element={<AdminDashboardPage/>}/>
            <Route path='/warehouse' element={<AdminWarehousePage/>}/>
            <Route path='/warehouse/:warehouseId' element={<WarehousePage/>}/>
            <Route path='/products' element={<AdminProductsPage/>}/>
            <Route path='/product/:productId' element={<ProductPage/>}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminPageComponent
