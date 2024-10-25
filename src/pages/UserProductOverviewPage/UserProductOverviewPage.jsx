import React, { useEffect, useState } from 'react' 
import { getSocket, initiateSocketConnection } from '../../utilities/socketService' 
import axios from 'axios' 
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom' 
import { Tooltip, Image } from 'antd' 
import { FaHeart, FaMinus, FaPlus, FaStar } from 'react-icons/fa6' 
import Cookies from 'js-cookie' 
import { Button, Modal } from 'antd'
import { TiShoppingCart } from 'react-icons/ti' 
import { toast } from 'react-toastify' 
import "react-responsive-carousel/lib/styles/carousel.min.css"   
import { Carousel } from 'react-responsive-carousel' 
import { IoIosPricetags } from 'react-icons/io'

const UserProductOverviewPage = () => {
    const [productData, setProductData] = useState({}) 
    const [offersData, setOffersData] = useState([]) 
    const [quantity, setQuantity] = useState(1) 
    const [isMinusAbled, setIsMinusAbled] = useState(false) 
    const [isPlusAbled, setIsPlusAbled] = useState(true) 
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [wishlistData, setWishlistData] = useState([])
    const [cartItemData, setCartItemData] = useState([])
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);

    const { productId } = useParams() 
    const navigate = useNavigate() 
    const {pathname} = useLocation()

    const formatRupees = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount) 
    } 

    const handleBuyNow = () => {
        if(isLoggedIn){
            navigate("/checkout", {
                state: {
                    products: [{
                        productDetails: productData,
                        quantity: quantity
                    }]
                }
            })
        }
        else{
            navigate("/login",{
                state: {
                    // products: [{
                    //     productDetails: productData,
                    //     quantity: quantity
                    // }],
                    redirect: `/products/${productData._id}`
                }
            })
        }
    }

    const handleAddToCart = async() => {
        if(!isLoggedIn){
          navigate("/login")
        }
        else{
          try{
            const response = await axios.put(
              `/user/addProductToCart/${productData._id}`,
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
                  productId,
                  additionalInfo: { quantity: 1 }
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
                toast.error(`An error occurred while adding to cart: ${error.response.status} ${error.response.data.message}`) 
              } else {
                toast.error(`An error occurred: ${error.response.status} ${error.response.data.message}`) 
              }
            } else if (error.request) {
              toast.error("No response from server. Please try again.") 
            } else {
              toast.error("An unexpected error occurred. Please try again.") 
            }
          }
        }
    }

    const handleAddWishlist = async() => {
      if(!isLoggedIn){
        navigate("/login", {
          state: {
            redirect: `/products/${productData._id}`
          }
        })
        return
      }
        try{
            const response = await axios.put(
              `/user/addProductToWishlist/${productData._id}`,
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
                  productId,
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
                toast.error("An error occurred while Adding Product to wishlist") 
              } else {
                toast.error(`An error occurred: ${error.response.status} ${error.response.data.message}`) 
              }
            } else if (error.request) {
              toast.error("No response from server. Please try again.") 
            } else {
              toast.error("An unexpected error occurred. Please try again.") 
            }
          }
    }

    const handleRemoveWishlist = async() => {
        try{
            const response = await axios.put(
              `/user/removeProductFromWishlist/${productData._id}`,
              {},
              {
                withCredentials: true
              }
            )
      
            if(response.status === 200){
              setIsRemoveModalOpen(false)
              toast.success("Product removed from wishlist")
            }
            
          }
          catch (error) {
            if (error.response) {
              if (error.response.status === 500) {
                toast.error(`An error occurred while Removing Product from wishlist: ${error.response.status} ${error.response.data.message}`) 
              } else {
                toast.error(`An error occurred: ${error.response.status} ${error.response.data.message}`) 
              }
            } else if (error.request) {
              toast.error("No response from server. Please try again.") 
            } else {
              toast.error("An unexpected error occurred. Please try again.") 
            }
          }
    }

    const openRemoveModal = (event) => {
        event.preventDefault()
        setIsRemoveModalOpen(true)
    }

    const isProductWishListed = (productId) => {
        return wishlistData?.some((list) => list._id === productId) || false
    }

    const isProductAddedInCart = (productId) => {
        return cartItemData?.some((item) => item._id === productId) || false
    }

    const handleThumbnailClick = (index) => {
      setCurrentIndex(index); // Update the current index when a thumbnail is clicked
    };

    useEffect(() => {
        const sessionToken = Cookies.get('SessionID') 
        if (sessionToken) {
          setIsLoggedIn(true) 
        } else {
          setIsLoggedIn(false) 
        }
      }, [productData]) 
    

    useEffect(() => {
        const getProductData = async () => {
            try {
                const response = await axios.get(
                  `/product/users/${productId}`,
                  {
                    withCredentials: true
                  }
                )
                if (response.status === 200) {
                    setProductData(response.data.data) 
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 409) {
                      toast.error("Warehouse already exists") 
                    } else if (error.response.status === 500) {
                      toast.error(`An error occurred while fetching the warehouse: ${error.response.status} : ${error.response.data.message}`) 
                    } else {
                      toast.error(`An error occurred: ${error.response.status}`) 
                    }
                } else if (error.request) {
                  toast.error("No response from server. Please try again.") 
                } else {
                  toast.error(`An error occurred: ${error}`) 
                }
            }
        } 
        
        const getOffersData = async () => {
            try {
                const response = await axios.get("/pricingRule") 
                if (response.status === 200) {
                    setOffersData(response.data.data) 
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 404) {
                      toast.error("No offers found") 
                    } else if (error.response.status === 500) {
                      toast.error("An error occurred while adding the warehouse") 
                    } else {
                      toast.error(`An error occurred: ${error.response.status}`) 
                    }
                } else if (error.request) {
                  toast.error("No response from server. Please try again.") 
                } else {
                  toast.error("An unexpected error occurred. Please try again.") 
                }
            }
        } 

        const getAllWishlistedProducts = async() => {
            try{
              const response = await axios.get(
                "/user/wishlist",
                {
                  withCredentials: true
                }
              )
        
              if(response.status === 200){
                setWishlistData(response.data.data)
              }
            }
            catch (error) {
              if (error.response) {
                if (error.response.status === 500) {
                  console.error("An error occurred while fetching Wishlist data") 
                } else {
                  console.error(`An error occurred: ${error.response.status} ${error.response.data.message}`) 
                }
              } else if (error.request) {
                console.error("No response from server. Please try again.") 
              } else {
                console.error("An unexpected error occurred. Please try again.") 
              }
            }
        }
    
        const getAllCartItems = async() => {
            try{
              const response = await axios.get(
                "/user/cartItems",
                {
                  withCredentials: true
                }
              )
              if(response.status === 200){
                setCartItemData(response.data.data)
              }
              
            }
            catch (error) {
              if (error.response) {
                if (error.response.status === 500) {
                  console.error("An error occurred while fetching Cart data") 
                } else {
                  console.error(`An error occurred: ${error.response.status} ${error.response.data.message}`) 
                }
              } else if (error.request) {
                console.error("No response from server. Please try again.") 
              } else {
                console.error("An unexpected error occurred. Please try again.") 
              }
            }
        }
    
      //  if(isLoggedIn){
        getAllCartItems()
        getAllWishlistedProducts()
      //  }
        
        getOffersData() 
        getProductData() 
    }, []) 

    useEffect(() => {
        initiateSocketConnection() 
        const socket = getSocket() 

        socket.on("productUpdated", (updatedProduct) => {
            setProductData(updatedProduct) 
        }) 

        socket.on("pricingRuleAdded", (addedPricingRule) => {
            setOffersData((prevState) => [...prevState, addedPricingRule]) 
        }) 

        socket.on("pricingRuleUpdated", (updatedPricingRule) => {
            setOffersData((prevState) => {
                return prevState.map(offer => 
                    offer.id === updatedPricingRule.id ? updatedPricingRule : offer
                ) 
            }) 
        }) 

        socket.on("pricingRuleDeleted", (deletedPricingRule) => {
            setOffersData((prevState) => prevState.filter((offer) => offer._id !== deletedPricingRule._id)) 
        }) 

        socket.on("wishlistUpdated", (updatedWishlist) => {
            setWishlistData(updatedWishlist)
        })

        socket.on("cartUpdated", (updatedCart) => {
            setCartItemData(updatedCart)
        })

        return () => {
            socket.disconnect() 
        } 
    }, []) 

    useEffect(() => {
        if (quantity > 1) {
            setIsMinusAbled(true) 
            setIsPlusAbled(true) 
        }
        if (quantity <= 1) {
            setIsMinusAbled(false) 
        }
        if (quantity >= 30) {
            setIsPlusAbled(false) 
        }
    }, [quantity])  

    useEffect(() => {
      const trackPageView = async () => {
        try {
          await axios.post(
            '/userActivity/track', 
            {
              action: 'page_view',
              productId,
              additionalInfo: { referrer: document.referrer }
            },
            {
              withCredentials: true
            }
          ) 
        } catch (error) {
          console.error("Error tracking page view:", error.message) 
        }
      } 
    
      trackPageView() 
    }, [productData]) 
    

    return (
        <React.Fragment>
            {productData && 
            <div className='px-5 md:px-20 lg:px-56 py-3 flex min-h-screen'>
                <div className='w-[35%] flex flex-col gap-3 sticky top-16 h-screen overflow-y-auto '>
                  <div className='h-[430px]'>
                    {
                      productData?.imageUrls?.length > 0 ?
                        <Carousel selectedItem={currentIndex} onChange={setCurrentIndex} className='h-[4px]'>
                          {
                            productData?.imageUrls?.map((image, index) => (
                              <Image
                                key={index} 
                                height={430}
                                width={"100%"}
                                className='object-cover h-96'
                                src={image}
                              />
                            ))
                          }
                        </Carousel>
                        :
                        <img
                          src={`https://img.freepik.com/premium-vector/beautiful-flat-style-shopping-cart-icon-vector-illustration_1287274-64477.jpg?w=740`}
                          className='w-full h-full object-cover'
                        />
                    }
                  </div>
                  <div className='grid grid-cols-4 gap-2'>
                    {
                      productData?.imageUrls?.length > 0 &&
                      productData?.imageUrls?.map((image, index) => (
                        <button key={index} onClick={() => handleThumbnailClick(index)} className={`h-20 object-cover ${currentIndex === index ? 'border-2 border-blue-500' : ''}`}>
                          <img className='h-full w-full object-cover' src={image} alt={`Thumbnail ${index + 1}`} />
                        </button>
                      ))
                    }
                    {
                      productData?.imageUrls?.length > 4 && (
                        <div className='flex items-center justify-center h-20 w-20 bg-gray-400 bg-opacity-40'>
                          <span className='text-xs text-center text-gray-600'>+{productData.imageUrls.length - 4} more</span>
                        </div>
                      )
                    }
                  </div>
                  {
                    isProductAddedInCart(productData._id) ?
                      <Link to={"/cart"} className='flex items-center justify-center gap-3 text-center bg-blue-500 py-3 rounded-lg text-white text-xl w-full hover:bg-blue-400'>
                        <TiShoppingCart className='text-white text-2xl' />Go to cart
                      </Link>
                      :
                      <button disabled={productData?.outOfStock || !productData?.deliverable} onClick={handleAddToCart} className={`flex items-center justify-center gap-3  py-3 rounded-md text-white text-xl w-full  ${productData?.outOfStock || !productData?.deliverable ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-400"}`}>
                        <TiShoppingCart className='text-white text-2xl' />Add to cart
                      </button>
                  }
                </div>
                <div className='px-10 w-[65%] flex flex-col gap-2'>
                    <div className='h-[500px] py-5 flex flex-col gap-1'>
                        <div className='flex items-center justify-between w-full'>
                            <div>
                                <h1 className='text-2xl font-medium text-gray-800'>{productData.productName}</h1>
                                <h3 className='text-lg text-gray-500'>{productData.productDescription}</h3>
                            </div>
                            {productData && productData.rating > 0 && productData.numberOfReviews > 0 &&
                                <div className='flex items-center gap-2'>
                                  <p className={`flex items-center gap-1 text-white px-3 py-1 text-base rounded-sm ${
                                  productData.rating >= 3.6 ? "bg-green-600" : 
                                  productData.rating >= 2.5 && productData.rating < 3.6 ? "bg-yellow-400" : 
                                  "bg-red-500"
                                  }`}>
                                      {productData.rating}
                                      <FaStar className={`text-white text-base`} />
                                  </p>
                                  <p className='text-sm text-gray-400'>({productData.numberOfReviews} reviews)</p>
                                </div>
                            }
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Category: <span className='capitalize text-gray-800 text-lg font-medium'>{productData.productType}</span></p>
                        </div>
                        <div>
                            <h3 className='text-2xl py-2 font-semibold text-gray-800'>{formatRupees(productData.price)}/-</h3>
                        </div>

                        {offersData.length > 0 &&
                            <div className='flex flex-col gap-3 py-5'>
                                <h1 className='text-xl font-medium text-gray-800 leading-3'>Available Offers</h1>
                                <div className='flex flex-col'>
                                    {offersData.map((offer) => (
                                        <div key={offer._id} className='flex items-center gap-2 rounded-xl  py-2'>
                                            <IoIosPricetags className='text-green-400 text' />
                                            <p className='text-gray-700'>{offer.name}</p>
                                            <p className='text-green-600 font-semibold text-base'>{offer.discountPercentage}% Off</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                        <div className='flex gap-4 items-end'>
                            <p className='text-gray-700 text-sm font-medium'>Quantity:</p>
                            <div className='flex items-center gap-3 '>
                                <button 
                                    onClick={() => setQuantity((prev) => prev - 1)}
                                    className={`border rounded-full p-2 ${isMinusAbled ? "border-blue-500 text-blue-500 hover:bg-blue-50" : "border-gray-500 text-gray-400 cursor-not-allowed"}`}
                                    disabled={!isMinusAbled}
                                ><FaMinus /></button>
                                <p className='text-lg font-medium'>{quantity}</p>
                                <button 
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                    className={`border rounded-full p-2 ${isPlusAbled ? "border-blue-500 text-blue-500 hover:bg-blue-50" : "border-gray-500 text-gray-400 cursor-not-allowed"}`}
                                    disabled={!isPlusAbled}
                                ><FaPlus /></button>
                            </div>
                        </div>

                        <div className='py-3'>
                        {
                          productData?.outOfStock ? 
                          <p className='text-sm text-pink-500'>Out of Stock</p>
                          :
                          !productData?.deliverable ?
                          <div>
                            <p className='text-sm text-pink-500'>Not deliverable to your location</p>
                            <button
                              className='bg-blue-500 text-white px-3 py-1 rounded-sm my-1'
                             onClick={() => {
                              navigate("/profile", {
                                state: {
                                  isEditOpen: true 
                                }
                              })
                             }} 
                             to={"/profile"}
                            >
                              Change Location
                            </button>
                          </div>
                          : null
                        }
                        </div>
                    </div>
                    <div className='flex justify-end gap-3'>
                        <button disabled={productData?.outOfStock || !productData?.deliverable} onClick={handleBuyNow} className={` py-2 rounded-lg w-60 text-white text-xl  ${productData?.outOfStock || !productData?.deliverable ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-400"}`}>Buy now</button>

                        {
                            isProductWishListed(productData._id) ? 
                            <Tooltip title="Remove from wishlist">
                              <button onClick={openRemoveModal} className=' border-2 border-gray-300 py-2 rounded-lg px-3 text-xl'><FaHeart className={`text-2xl transition hover:transform hover:scale-[120%] text-red-500`}/></button>
                            </Tooltip>
                            :
                            <Tooltip title="Add to wishlist">
                              <button onClick={handleAddWishlist} className=' border-2 border-gray-300  py-2 px-3 rounded-lg text-xl'><FaHeart className={`text-2xl transition hover:transform hover:scale-[120%] text-gray-300`}/></button>
                            </Tooltip>
                        }
                    </div>


                    <div className=' flex flex-col py-5'>
                      <div className='flex gap-2 items-center'>
                      <h1 className='text-xl font-medium text-gray-800 leading-3'>Ratings & Reviews</h1>
                        {productData?.rating > 0 &&
                          <div className='flex items-center gap-2'>
                            <p className={`flex items-center gap-1 text-white px-3 py-1 text-base rounded-sm ${
                            productData.rating >= 3.6 ? "bg-green-600" : 
                            productData.rating >= 2.5 && productData.rating < 3.6 ? "bg-yellow-400" : 
                            "bg-red-500"
                            }`}>
                                {productData.rating}
                                <FaStar className={`text-white text-base`} />
                            </p>
                            <p className='text-sm text-gray-400'>({productData.numberOfReviews} reviews)</p>
                          </div>
                        }
                      </div>
                      <div className='py-3'>
                        {
                          productData?.reviews?.length > 0 ?
                          productData?.reviews?.map((review) => (
                            <div className='flex border-b border-b-gray-300 py-2 px-3 gap-5'>
                              <p className={`flex items-center gap-1 text-white px-3 py-1 text-xs rounded-full ${
                                review.rating >= 3.6 ? "bg-green-600" : 
                                review.rating >= 2.5 && review.rating < 3.6 ? "bg-yellow-400" : 
                                "bg-red-500"
                                }`}>
                                    {productData.rating}
                                    <FaStar className={`text-white text-xs`} />
                                </p>
                              <p>{review?.comment}</p>
                            </div>
                          ))
                          :
                          <div>No reviews yet</div>
                        }
                      </div>

                      
                      
                    </div>



                </div>
            </div>
            }

            
            <Modal 
                title="Are you sure?" 
                open={isRemoveModalOpen} 
                onCancel={() => setIsRemoveModalOpen(false)}
                footer={[]}
                
            >
                <p>Remove {productData.productName} from wishlist? </p>
                <div className='flex justify-end gap-4 py-5'>
                    <Button htmlType="button" onClick={() => setIsRemoveModalOpen(false)}>
                    Cancel
                    </Button>
                    <Button color="danger" variant="solid" onClick={(event) => handleRemoveWishlist(event)}>
                    Remove
                    </Button>

                </div>
            </Modal>
            
        </React.Fragment>
    ) 
} 

export default UserProductOverviewPage 
