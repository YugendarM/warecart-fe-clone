import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { TbLayoutDashboard, TbLayoutDashboardFilled } from "react-icons/tb";
import { BsPeople, BsPeopleFill } from "react-icons/bs";
import { FaCreditCard, FaHandshake, FaRegCreditCard, FaRegHandshake } from "react-icons/fa6";
import { MdOutlineWarehouse, MdWarehouse } from 'react-icons/md';
import { RiShoppingBag4Fill, RiShoppingBag4Line } from 'react-icons/ri';


const AdminSideNavbar = () => {

  const {pathname} = useLocation()
  console.log(pathname)

//   const param = useParams()
//   console.log(useParams())

  return (
    <div className='w-[350px] md:flex justify-center h-[88vh]'>
      <div className='w-[80%] rounded-md h-full bg-gradient-to-b from-[#414141] to-[#191919]'>
        <nav className='px-5 flex flex-col gap-4 py-10'>
          <Link to={"/admin/dashboard"} className={`text-white text-md flex items-center py-4 px-8 rounded-lg gap-5 transition ${pathname === "/admin/dashboard" ? "bg-primaryBlue" : "hover:bg-[#636363]"}`}>{
            pathname === "/admin/dashboard" ? <TbLayoutDashboardFilled className='text-2xl'/> : < TbLayoutDashboard className='text-2xl'/>
          }
            Dashboard
          </Link>

          <Link to={"/admin/warehouse"} className={`text-white text-md flex items-center py-4 px-8  rounded-lg gap-5 ${pathname.includes("warehouse") ? "bg-primaryBlue" : "hover:bg-[#636363]"}`}>{
            pathname.includes("warehouse") ? <MdWarehouse className='text-2xl'/> : < MdOutlineWarehouse className='text-2xl'/>
          }
            Warehouse
          </Link>

          <Link to={"/admin/products"} className={`text-white text-md flex items-center py-4 px-8  rounded-lg gap-5 ${pathname.includes("product") ? "bg-primaryBlue" : "hover:bg-[#636363]"}`}>{
            pathname.includes("product") ? <RiShoppingBag4Fill className='text-2xl'/> : < RiShoppingBag4Line className='text-2xl'/>
          }
            Products
          </Link>

        </nav>
      </div>
    </div>
  )
}

export default AdminSideNavbar
