import React from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import AdminSideNavbar from '../../../components/AdminSideNavbar/AdminSideNavbar'
import AdminWarehousePage from '../AdminWarehousePage/AdminWarehousePage'
import AdminProductsPage from '../AdminProductsPage/AdminProductsPage'
import AdminDashboardPage from '../AdminDashboardPage/AdminDashboardPage'
import WarehousePage from '../../WarehousePage/WarehousePage'
import ProductPage from '../../ProductPage/ProductPage'
import AdminOrdersPage from '../AdminOrdersPage/AdminOrdersPage'
import AdminPricingRulesPage from '../AdminPricingRulesPage/AdminPricingRulesPage'
import AdminOrderOverviewPage from '../AdminOrderOverviewPage/AdminOrderOverviewPage'

const AdminPageComponent = () => {
  return (
    <div className='flex overflow-hidden'>
      <AdminSideNavbar/>
      <div className='w-full md:w-3/4 flex'>
        <div className='w-full md:mt-5 '>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path='/dashboard' element={<AdminDashboardPage/>}/>
            <Route path='/warehouse' element={<AdminWarehousePage/>}/>
            <Route path='/warehouse/:warehouseId' element={<WarehousePage/>}/>
            <Route path='/products' element={<AdminProductsPage/>}/>
            <Route path='/product/:productId' element={<ProductPage/>}/>
            <Route path='/orders' element={<AdminOrdersPage/>}/>
            <Route path='/orders/:orderId' element={<AdminOrderOverviewPage/>}/>
            <Route path='/pricing_rules' element={<AdminPricingRulesPage/>}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminPageComponent
