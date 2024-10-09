import axios from 'axios'
import React, { useMemo, useState } from 'react'
import { FaCircleInfo, FaMinus, FaPlus, FaStar } from 'react-icons/fa6'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const OrderSummaryProductCardComponent = ({productData, isOrderSummaryContinue, onQuantityChange}) => {

    const [quantity, setQuantity] = useState(productData && productData.quantity)
    const [isOffersTabOpen, setIsOffersTabOpen] = useState(false)

    const {pathname} = useLocation()

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

    const handleCartItemRemove = async() => {
      try{
          const response = await axios.put(
            `/user/removeProductFromCart/${productData.productDetails._id}`,
            {},
            {
              withCredentials: true
            }
          )
    
          if(response.status === 200){
            toast.success("Product removed from cart")
            await axios.post(
                '/userActivity/track', 
                {
                    action: 'remove_from_cart',
                    productId : productData._id
                },
                {
                    withCredentials: true
                }
            )
          }
          
        }
        catch (error) {
          if (error.response) {
            if (error.response.status === 500) {
              toast.error(`An error occurred while Removing Product from cart: ${error.response.status} ${error.response.data.message}`);
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
                    <div className='flex-col parent relative w-full'>
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center gap-1 cursor-pointer' onMouseEnter={() => setIsOffersTabOpen(true)} onMouseLeave={() => setIsOffersTabOpen(false)}>
                                <p className='text-green-600 text-sm font-medium'>{productData && productData.appliedRule.length} offer applied</p>
                                <FaCircleInfo className='text-sm text-green-600' />
                            </div>
                            {
                                pathname === "/cart" &&
                                <button onClick={handleCartItemRemove} className='text-blue-500 hover:text-blue-300 font-medium'>REMOVE</button>
                            }
                        </div>
                        {
                            isOffersTabOpen &&
                            <div className='absolute top-8 z-20 bg-white text-xs font-medium text-gray-500 w-72 shadow-custom-medium px-3 py-2 rounded-sm  transition-opacity duration-200'>
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
                        }
                    </div>


                }
            </div>
        </div>
    </div>
  )
}

export default OrderSummaryProductCardComponent
