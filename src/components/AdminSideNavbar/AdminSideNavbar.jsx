import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { TbLayoutDashboard, TbLayoutDashboardFilled } from "react-icons/tb";
import { BsCartCheck, BsCartCheckFill, BsPeople, BsPeopleFill } from "react-icons/bs";
import { FaCreditCard, FaHandshake, FaRegCreditCard, FaRegHandshake } from "react-icons/fa6";
import { MdOutlineWarehouse, MdWarehouse } from 'react-icons/md';
import { RiShoppingBag4Fill, RiShoppingBag4Line } from 'react-icons/ri';
import { IoPricetags, IoPricetagsOutline } from 'react-icons/io5';


const AdminSideNavbar = () => {

  const {pathname} = useLocation()

  return (
    <div className='w-[350px] md:flex justify-center min-h-[90vh]'>
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

          <Link to={"/admin/orders"} className={`text-white text-md flex items-center py-4 px-8  rounded-lg gap-5 ${pathname.includes("orders") ? "bg-primaryBlue" : "hover:bg-[#636363]"}`}>{
            pathname.includes("orders") ? <BsCartCheckFill  className='text-2xl'/> : < BsCartCheck  className='text-2xl'/>
          }
            Orders
          </Link>

          <Link to={"/admin/pricing_rules"} className={`text-white text-md flex items-center py-4 px-8  rounded-lg gap-5 ${pathname.includes("pricing_rules") ? "bg-primaryBlue" : "hover:bg-[#636363]"}`}>{
            pathname.includes("pricing_rules") ? <IoPricetags  className='text-2xl'/> : < IoPricetagsOutline  className='text-2xl'/>
          }
            Pricing Rules
          </Link>

        </nav>
      </div>
    </div>
  )
}

export default AdminSideNavbar
