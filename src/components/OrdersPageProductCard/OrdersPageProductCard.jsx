import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ReviewModal from '../Modals/ReviewModal/ReviewModal'

const OrdersPageProductCard = ({product, order}) => {

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

    const formatRupees = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount) 
      }
    
      function formatOrderDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
      }
    
      function deliveryDate(dateString) {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 7);
        const options = { month: 'short', day: '2-digit' };
        const newDate = date.toLocaleDateString('en-US', options);  
        return newDate;
      }

      const handleReviewProduct = async(event) => {
        event.preventDefault()
        setIsReviewModalOpen(true)
      }
    
      const handleModalClose = () => {
        setIsReviewModalOpen(false)
      }

  return (
    <div  className='flex items-start gap-4 border py-3 px-3 text-sm'>
        <Link to={`/products/${product?.productDetails?._id}`} className='h-24 w-[12%]'>
            <img src={product?.productDetails?.imageUrls?.length > 0 ? product?.productDetails?.imageUrls?.[0] : "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"} className='border object-cover h-full w-full'/>
        </Link>
        <Link to={`/products/${product?.productDetails?._id}`} className='w-[50%] flex flex-col gap-1'>
            <p className='text-sm text-ellipsis overflow-hidden whitespace-nowrap'>{product?.productDetails?.productName}</p>
            <p className='text-xs text-gray-400  text-ellipsis overflow-hidden whitespace-nowrap'>{product?.productDetails?.productDescription}</p>
            <div className='flex items-center gap-5'>
            <p className='text-sm text-gray-500 py-3 capitalize'>Category: {product?.productDetails?.productType}</p>
            <p className='text-sm text-gray-500 py-3'>Price: {formatRupees(product?.productDetails?.price)}</p>
            <p className='text-sm text-gray-500 py-3'>{product?.quantity} {` ${product?.quantity <= 1 ? "No" : "Nos"}`}</p>
            </div>
        </Link>
        <div className='w-[15%] flex gap-2 items-center'>
            <p className='text-sm'>{formatRupees(product?.price * product?.quantity)}</p>
        </div>
        <div className='w-[20%]'>
            <p className='font-medium'>Delivery on {deliveryDate(order?.createdAt)}</p>
            <p className='text-xs text-gray-500'>{`${order?.paymentInfo?.paymentStatus === "completed" ? "Your payment has been confirmed" : "Your payment is pending"}`}</p>
            <p className='text-xs text-gray-500 capitalize'>{order?.paymentInfo?.paymentMethod === "cod" ? "Cash on delivery" : order?.paymentInfo?.paymentMethod}</p>
            {
                order?.paymentInfo?.paymentStatus === "completed" &&
                <button onClick={(event) => handleReviewProduct(event)} className='py-3 text-sm text-blue-500'>RATE & REVIEW PRODUCT</button>
            }
            <ReviewModal isReviewModalOpen={isReviewModalOpen} handleModalClose={handleModalClose} product={product}/>
        </div>
    </div>
  )
}

export default OrdersPageProductCard
