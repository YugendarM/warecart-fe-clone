import { Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaHeart, FaStar } from 'react-icons/fa6'
import { Link, redirect, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios';
import { Button, Modal } from 'antd'
import { toast } from 'react-toastify';
import { MdAddShoppingCart } from 'react-icons/md';

const UserProductCard = ({product, isProductWishListed, isProductAddedInCart}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

    const {pathname} = useLocation()

    const navigate = useNavigate()

    const handleAddWishlist = async(event) => {
      event.preventDefault()
        if(isLoggedIn){
        try{
            const response = await axios.put(
              `/user/addProductToWishlist/${product._id}`,
              {},
              {
                withCredentials: true
              }
            )
      
            if(response.status === 200){
              toast.success("Product added to wishlist")
              await axios.post(
                '/userActivity/track', 
                {
                  action: 'wishlist',
                  productId: product._id,
                },
                {
                  withCredentials: true
                }
              );
            }
            
          }
          catch (error) {
            if (error.response) {
              if (error.response.status === 500) {
                toast.error("An error occurred while Adding Product to wishlist");
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

        else{
          navigate("/login", {
            state: {
              redirect: "/products"
            }
          })
        }

    }

    const handleAddToCart = async(event) => {
      event.preventDefault()
      if(!isLoggedIn){
        navigate("/login", {
          state: {
            redirect: "/products"
          }
        })
      }
      else{
        try{
          const response = await axios.put(
            `/user/addProductToCart/${product._id}`,
            {},
            {
              withCredentials: true
            }
          )
    
          if(response.status === 200){
            toast.success("Product added to cart")
            await axios.post(
              '/userActivity/track', 
              {
                action: 'add_to_cart',
                productId: product._id,
                additionalInfo: { quantity: 1 }
              },
              {
                withCredentials: true
              }
            );
          }
          
        }
        catch (error) {
          if (error.response) {
            if (error.response.status === 500) {
              toast.error(`An error occurred while adding to cart: ${error.response.status} ${error.response.data.message}`);
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
      
    }

    const openRemoveModal = (event) => {
        event.preventDefault()
        setIsRemoveModalOpen(true)
    }

    const handleRemoveWishlist = async(event) => {
        event.preventDefault()
        try{
            const response = await axios.put(
              `/user/removeProductFromWishlist/${product._id}`,
              {},
              {
                withCredentials: true
              }
            )
      
            if(response.status === 200){
              setIsRemoveModalOpen(false)
              toast.success("Product removed from wishlist")
              await axios.post(
                '/userActivity/track', 
                {
                  action: 'remove_from_wishlist',
                  productId : product._id
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
                toast.error(`An error occurred while Removing Product from wishlist: ${error.response.status} ${error.response.data.message}`);
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

    const formatRupees = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0, 
        }).format(amount);
    };

    const handleBuyNow = (event) => {
        event.preventDefault()
        if(isLoggedIn){
            navigate("/checkout", {
                state: {
                    products: [{
                        productDetails: product,
                        quantity: 1
                    }]
                }
            })
        }
        else{
            navigate("/login",{
                state: {
                    products: [{
                        productDetails: product,
                        quantity: 1
                    }],
                }
            })
        }
    }

    useEffect(() => {
        const sessionToken = Cookies.get('SessionID');
        if (sessionToken) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }, [pathname]);

  return (
    <Link to={`/products/${product._id}`} className=' hover:shadow-custom-medium transition rounded-sm bg-white'>
      <div className='h-56 w-full '>
        <img 
            src={product?.imageUrls?.length>0 ? product?.imageUrls[0] : `https://www.lg.com/lg5-common/images/common/product-default-list-350.jpg`}
            className='w-full h-full rounded-t-sm object-cover '
        />
      </div>
      <div className='px-5 py-3 flex flex-col'>
        <div>
            <div className='flex items-start justify-between'>
                <h1 className='text-base font-medium text-gray-800'>{product.productName}</h1>
                    {
                        isProductWishListed ? 
                        <Tooltip title="Remove from wishlist">
                            <button onClick={(event) => openRemoveModal(event)}>
                                <FaHeart className={`text-xl transition hover:transform hover:scale-[120%] text-red-500`}/>
                            </button>
                        </Tooltip>
                        :
                        <Tooltip title="Add to wishlist">
                            <button onClick={(event) => handleAddWishlist(event)}>
                                <FaHeart className={`text-xl transition hover:transform hover:scale-[120%] text-gray-300`}/>
                            </button>
                        </Tooltip>
                    }
            </div>
            <p className='text-xs text-gray-500 font-normal text-ellipsis whitespace-nowrap overflow-hidden'>{product.productDescription}</p>
        </div>
        <h1 className='text-xs text-gray-500'>Category:<span className='text-gray-700 capitalize text-sm'> {product.productType}</span></h1>
        <div className='flex items-center justify-between'>
            <h1 className='text-base text-gray-900 font-medium'>{formatRupees(product.price)}/-</h1>
            {
                product && product.rating > 0 &&
                <p className={`text-sm flex items-center gap-1 text-white px-1 rounded-sm ${
                  product.rating >= 3.6 ? "bg-green-600" : 
                  product.rating >= 2.5 && product.rating < 3.6 ? "bg-yellow-400" : 
                  "bg-red-500"
              }`}>
                  {product.rating}
                  <FaStar className={`text-white text-xs`} />
              </p>
            }
        </div>

        <div className='flex justify-between items-center w/full gap-3 py-2'>
            <button onClick={(event) => handleBuyNow(event)} className='text-sm bg-green-500 py-1.5 rounded-md text-white w-1/2 hover:bg-green-400'>Buy Now</button>
            {
              isProductAddedInCart ? 
              <Link to={"/cart"} className='text-sm rounded-md border-2 border-gray-300 w-1/2 py-1.5 flex items-center justify-center gap-2 font-medium'>Visit<MdAddShoppingCart className='text-gray-500 text-xl'/></Link>
              :
              <button onClick={(event) => handleAddToCart(event)} className='text-sm rounded-md border-2 border-gray-300 w-1/2 py-1.5 flex items-center justify-center gap-2 font-medium'>Add <MdAddShoppingCart className='text-gray-500 text-xl'/></button>
            }
        </div>
      </div>
      <Modal 
        title="Are you sure?" 
        open={isRemoveModalOpen} 
        onCancel={() => setIsRemoveModalOpen(false)}
        footer={[]}
        
      >
        <p>Remove {product.productName} from wishlist? </p>
        <div className='flex justify-end gap-4 py-5'>
            <Button htmlType="button" onClick={() => setIsRemoveModalOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" variant="solid" onClick={(event) => handleRemoveWishlist(event)}>
              Remove
            </Button>

        </div>
      </Modal>
    </Link>
  )
}

export default UserProductCard

