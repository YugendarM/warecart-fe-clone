import React, { useMemo, useState } from 'react'
import { FaCircleInfo, FaMinus, FaPlus, FaStar } from 'react-icons/fa6'

const OrderSummaryProductCardComponent = ({productData, isOrderSummaryContinue, onQuantityChange}) => {

    const [quantity, setQuantity] = useState(productData && productData.quantity)

    const handleIncrease = () => {
        const newQuantity = Math.min(quantity + 1, 30); // Max limit
        setQuantity(newQuantity);
        onQuantityChange(productData.productDetails._id, newQuantity); // Call the parent handler
      };
    
      const handleDecrease = () => {
        const newQuantity = Math.max(quantity - 1, 1); // Min limit
        setQuantity(newQuantity);
        onQuantityChange(productData.productDetails._id, newQuantity); // Call the parent handler
      };

    const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0, // Adjust if you want decimals
    }).format(amount);
    };

    const totalDiscountedPrice = useMemo(() => {
        if (productData && productData.productDetails && quantity) {
            return ((productData.productDetails.price * quantity) - productData.discountPrice) || 0;
        }
        return 0; // Default or fallback value
    }, [productData, quantity]);

  return (
    <div className='flex w-full' >
        <div className="flex flex-col gap-3 w-[20%]" >
            <img className="h-28 w-full object-contain border " src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"/>
            <div>
                <div className='flex items-center justify-between '>
                    <button 
                        onClick={handleDecrease}
                        className={`border rounded-full p-1.5 ${quantity <= 1 || isOrderSummaryContinue ? " border-gray-500 text-gray-400 cursor-not-allowed" : '  border-blue-500 text-blue-500 hover:bg-blue-100'}`}
                        disabled={quantity === 1 || isOrderSummaryContinue}
                    ><FaMinus className='text-sm'/></button>
                    <p className='text-sm font-medium w-12 text-center border rounded-sm py-0.5 border-gray-600'>{quantity}</p>
                    <button 
                        onClick={handleIncrease}
                        className={`border rounded-full p-1.5 ${quantity >= 30 || isOrderSummaryContinue ? " border-gray-500 text-gray-400 cursor-not-allowed" : " border-blue-500 text-blue-500 hover:bg-blue-100"}`}
                        disabled={quantity === 30 || isOrderSummaryContinue}
                    ><FaPlus className='text-sm'/></button>
                </div>
            </div>
        </div>
        <div className='px-5 py-3 w-[80%] flex flex-col gap-1'>
            <div className='flex items-center justify-between w-full'>
                <div>
                    <h1 className='text-lg font-medium'>{productData && productData.productDetails && productData.productDetails.productName}</h1>
                    <p className='text-gray-600 text-sm'>{productData && productData.productDetails && productData.productDetails.productDescription}</p>
                </div>
                {
                    productData && productData.productDetails && productData.productDetails.rating>0 &&
                    <p className={`flex items-center gap-1 text-white px-2 rounded-sm ${productData && productData.productDetails && productData.productDetails.rating &&  productData.productDetails.rating >= 4 ? "bg-green-600" : productData && productData.productDetails && productData.productDetails.rating && productData.productDetails.rating === 3 ? "bg-yellow-300" : "bg-red-500" }`}>
                        {productData && productData.productDetails &&  productData && productData.productDetails.rating && productData.productDetails.rating}
                        <FaStar className={`text-white text-sm`}/>
                    </p>
                }
            </div>
            <div className='flex items-center justify-between '>
                <p className='text-gray-500 text-xs'>Category: <span className='text-gray-800 capitalize text-lg'>{productData && productData.productDetails && productData.productDetails.productType}</span></p>
                <div className='flex items-center gap-2'>
                    <p className='text-sm border-r-[2px] px-3 border-r-gray-600'>Delivery by Tue Oct 16</p>
                    <p className='text-sm text-green-500'>FREE</p>
                </div>
            </div>
            <div className='flex items-center gap-3'>
                <p className='font-normal text-lg text-gray-500 line-through'>{formatRupees((productData && productData.productDetails && productData.productDetails.price)*quantity)}</p>
                <p className='font-semibold text-lg text-gray-800'>
                    {totalDiscountedPrice > 0 && formatRupees(totalDiscountedPrice)}/-
                </p>
                {
                    productData && productData.appliedRule.length > 0 &&
                    <div className='flex-col parent relative group'>
                        <div className='flex items-center gap-1 cursor-pointer'>
                            <p className='text-green-600 text-sm font-medium'>{productData && productData.appliedRule.length} offer applied</p>
                            <FaCircleInfo className='text-sm text-green-600' />
                        </div>
                        <div className='absolute top-8 z-20 bg-white text-xs font-medium text-gray-500 w-72 shadow-custom-medium px-3 py-2 rounded-sm hidden group-hover:block transition-opacity duration-200'>
                            <div className='child flex items-center justify-between w-full py-3'>
                                <p>Selling Price</p>
                                <p className='text-black'>{formatRupees((productData && productData.productDetails && productData.productDetails.price)*quantity)}/-</p>
                            </div>
                            <div className='flex flex-col gap-3 py-3'>
                                {
                                    productData && productData.appliedRule && productData.appliedRule.map((rule, index) => (
                                        <div key={index} className='flex justify-between items-center gap-2'>
                                            <p className='overflow-hidden text-ellipsis flex items-center gap-2'>{rule.name}<span className='text-black'>{rule.discountPercentage}% off</span></p>
                                            <p className='text-green-600'>- {formatRupees(((productData && productData.productDetails && productData.productDetails.price) * (rule.discountPercentage / 100))*quantity)}/-</p>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='child flex items-center justify-between w-full border-y border-y-gray-200 py-3'>
                                <p>Total</p>
                                <p className='text-black'>{formatRupees((productData && productData.productDetails && productData.productDetails.price)*quantity - (productData && productData.discountPrice))}/-</p>
                            </div>
                        </div>
                    </div>


                }
            </div>
        </div>
    </div>
  )
}

export default OrderSummaryProductCardComponent
