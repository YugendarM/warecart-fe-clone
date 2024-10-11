import React, { useEffect, useState } from 'react';
import { getSocket, initiateSocketConnection } from '../../utilities/socketService';
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'antd';
import { FaHeart, FaMinus, FaPlus, FaStar } from 'react-icons/fa6';
import Cookies from 'js-cookie';
import { Button, Modal } from 'antd'
import { TiShoppingCart } from 'react-icons/ti';
import { toast } from 'react-toastify';

const UserProductOverviewPage = () => {
    const [productData, setProductData] = useState({});
    const [offersData, setOffersData] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isMinusAbled, setIsMinusAbled] = useState(false);
    const [isPlusAbled, setIsPlusAbled] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [wishlistData, setWishlistData] = useState([])
    const [cartItemData, setCartItemData] = useState([])
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

    const { productId } = useParams();
    const navigate = useNavigate() 
    const {pathname} = useLocation()

    const formatRupees = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0, // Adjust if you want decimals
        }).format(amount);
    };

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
                    products: [{
                        productDetails: productData,
                        quantity: quantity
                    }],
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

    const handleAddWishlist = async() => {
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

    useEffect(() => {
        const sessionToken = Cookies.get('SessionID');
        if (sessionToken) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }, [pathname]);
    

    useEffect(() => {
        const getProductData = async () => {
            try {
                const response = await axios.get(`/product/users/${productId}`);
                if (response.status === 200) {
                    setProductData(response.data.data);
                }
                console.log(response)
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 409) {
                      toast.error("Warehouse already exists");
                    } else if (error.response.status === 500) {
                      toast.error("An error occurred while adding the warehouse");
                    } else {
                      toast.error(`An error occurred: ${error.response.status}`);
                    }
                } else if (error.request) {
                  toast.error("No response from server. Please try again.");
                } else {
                  toast.error("An unexpected error occurred. Please try again.");
                }
            }
        };
        
        const getOffersData = async () => {
            try {
                const response = await axios.get("/pricingRule");
                if (response.status === 200) {
                    setOffersData(response.data.data);
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 404) {
                      toast.error("No offers found");
                    } else if (error.response.status === 500) {
                      toast.error("An error occurred while adding the warehouse");
                    } else {
                      toast.error(`An error occurred: ${error.response.status}`);
                    }
                } else if (error.request) {
                  toast.error("No response from server. Please try again.");
                } else {
                  toast.error("An unexpected error occurred. Please try again.");
                }
            }
        };

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
                  console.error("An error occurred while fetching Wishlist data");
                } else {
                  console.error(`An error occurred: ${error.response.status} ${error.response.data.message}`);
                }
              } else if (error.request) {
                console.error("No response from server. Please try again.");
              } else {
                console.error("An unexpected error occurred. Please try again.");
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
                  console.error("An error occurred while fetching Cart data");
                } else {
                  console.error(`An error occurred: ${error.response.status} ${error.response.data.message}`);
                }
              } else if (error.request) {
                console.error("No response from server. Please try again.");
              } else {
                console.error("An unexpected error occurred. Please try again.");
              }
            }
        }
    
       if(isLoggedIn){
        getAllCartItems()
        getAllWishlistedProducts()
       }
        
        getOffersData();
        getProductData();
    }, []);

    useEffect(() => {
        initiateSocketConnection();
        const socket = getSocket();

        socket.on("productUpdated", (updatedProduct) => {
            setProductData(updatedProduct);
        });

        socket.on("pricingRuleAdded", (addedPricingRule) => {
            setOffersData((prevState) => [...prevState, addedPricingRule]);
        });

        socket.on("pricingRuleUpdated", (updatedPricingRule) => {
            setOffersData((prevState) => {
                return prevState.map(offer => 
                    offer.id === updatedPricingRule.id ? updatedPricingRule : offer
                );
            });
        });

        socket.on("pricingRuleDeleted", (deletedPricingRule) => {
            setOffersData((prevState) => prevState.filter((offer) => offer._id !== deletedPricingRule._id));
        });

        socket.on("wishlistUpdated", (updatedWishlist) => {
            setWishlistData(updatedWishlist)
        })

        socket.on("cartUpdated", (updatedCart) => {
            setCartItemData(updatedCart)
        })

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (quantity > 1) {
            setIsMinusAbled(true);
            setIsPlusAbled(true);
        }
        if (quantity <= 1) {
            setIsMinusAbled(false);
        }
        if (quantity >= 30) {
            setIsPlusAbled(false);
        }
    }, [quantity]); 

    useEffect(() => {
      const trackPageView = async () => {
        try {
          console.log("tracking");
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
          );
          console.log("Tracking successful");
        } catch (error) {
          console.error("Error tracking page view:", error.message);
        }
      };
    
      trackPageView();
    }, [productData]);
    

    return (
        <React.Fragment>
            {productData && 
            <div className='px-5 md:px-20 lg:px-56 py-20 flex'>
                <div className='w-[35%] bg-gray-0 flex flex-col gap-2 '>
                    <div className='h-[450px]'>
                        <img
                            src={productData?.imageUrls?.length>0 ? productData?.imageUrls[0] : `https://img.freepik.com/premium-vector/beautiful-flat-style-shopping-cart-icon-vector-illustration_1287274-64477.jpg?w=740`}
                            className='w-full h-full object-cover'
                        />
                    </div>
                    {
                        isProductAddedInCart(productData._id) ? 
                        <Link to={"/cart"} className='flex items-center justify-center gap-3 text-center bg-blue-500 py-3 rounded-lg text-white text-xl w-full hover:bg-blue-400'><TiShoppingCart className='text-white text-2xl'/>Go to cart</Link>
                        :
                        <button onClick={handleAddToCart} className='flex items-center justify-center gap-3 bg-blue-500 py-3 rounded-lg text-white text-xl w-full hover:bg-blue-400'><TiShoppingCart className='text-white text-2xl'/>Add to cart</button>

                    }
                </div>
                <div className='px-10 w-[65%] flex flex-col gap-2'>
                    <div className='h-[450px] py-5 flex flex-col gap-5'>
                        <div className='flex items-center justify-between w-full'>
                            <div>
                                <h1 className='text-4xl text-gray-800'>{productData.productName}</h1>
                                <h3 className='text-xl text-gray-500'>{productData.productDescription}</h3>
                            </div>
                            {productData && productData.rating > 0 &&
                                <p className={`flex items-center gap-1 text-white px-4 py-1 text-xl rounded-md ${productData.rating >= 4 ? "bg-green-600" : productData.rating === 3 ? "bg-yellow-300" : "bg-red-500"}`}>
                                    {productData.rating}
                                    <FaStar className={`text-white text-xl`} />
                                </p>
                            }
                        </div>
                        <div>
                            <p className='text-gray-600'>Category: <span className='capitalize text-gray-800 text-2xl font-medium'>{productData.productType}</span></p>
                        </div>
                        <div>
                            <h3 className='text-2xl font-semibold text-gray-800'>{formatRupees(productData.price)}/-</h3>
                        </div>

                        {offersData.length > 0 &&
                            <div className='flex flex-col gap-3'>
                                <h1 className='text-xl font-medium text-gray-800'>Available Offers</h1>
                                <div className='flex flex-wrap gap-5'>
                                    {offersData.map((offer) => (
                                        <div key={offer._id} className='border border-blue-500 rounded-xl px-4 py-2'>
                                            <p className='text-blue-500 h-1/2'>{offer.name}</p>
                                            <p className='text-blue-500 font-semibold text-base'>{offer.discountPercentage}% Off</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                        <div className='flex gap-4 items-end'>
                            <p className='text-gray-700 text-base font-medium'>Quantity:</p>
                            <div className='flex items-center gap-5 '>
                                <button 
                                    onClick={() => setQuantity((prev) => prev - 1)}
                                    className={`border rounded-md p-3 ${isMinusAbled ? "border-blue-500 text-blue-500 hover:bg-blue-100" : "border-gray-500 text-gray-400 cursor-not-allowed"}`}
                                    disabled={!isMinusAbled}
                                ><FaMinus /></button>
                                <p className='text-lg font-medium'>{quantity}</p>
                                <button 
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                    className={`border rounded-md p-3 ${isPlusAbled ? "border-blue-500 text-blue-500 hover:bg-blue-100" : "border-gray-500 text-gray-400 cursor-not-allowed"}`}
                                    disabled={!isPlusAbled}
                                ><FaPlus /></button>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end gap-10'>
                        {
                            isProductWishListed(productData._id) ? 
                            <button onClick={openRemoveModal} className='border-2 border-blue-400 text-blue-400 py-1 rounded-lg px-8 text-xl'>Remove from Wishlist</button>
                            :
                            <button onClick={handleAddWishlist} className='border-2 border-blue-400 text-blue-400 py-1 rounded-lg px-8 text-xl'>Add to Wishlist</button>
                        }
                        <button onClick={handleBuyNow} className='bg-green-500 py-2 rounded-lg px-8 text-white text-xl hover:bg-green-400'>Buy now</button>
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
    );
};

export default UserProductOverviewPage;
