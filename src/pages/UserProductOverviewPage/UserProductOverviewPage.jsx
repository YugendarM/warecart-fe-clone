import React, { useEffect, useState } from 'react';
import { getSocket, initiateSocketConnection } from '../../utilities/socketService';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'antd';
import { FaHeart, FaMinus, FaPlus, FaStar } from 'react-icons/fa6';
import Cookies from 'js-cookie';

const UserProductOverviewPage = () => {
    const [productData, setProductData] = useState({});
    const [offersData, setOffersData] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isMinusAbled, setIsMinusAbled] = useState(false);
    const [isPlusAbled, setIsPlusAbled] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false)

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
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 409) {
                        alert("Warehouse already exists");
                    } else if (error.response.status === 500) {
                        alert("An error occurred while adding the warehouse");
                    } else {
                        alert(`An error occurred: ${error.response.status}`);
                    }
                } else if (error.request) {
                    alert("No response from server. Please try again.");
                } else {
                    alert("An unexpected error occurred. Please try again.");
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
                    if (error.response.status === 409) {
                        alert("Warehouse already exists");
                    } else if (error.response.status === 500) {
                        alert("An error occurred while adding the warehouse");
                    } else {
                        alert(`An error occurred: ${error.response.status}`);
                    }
                } else if (error.request) {
                    alert("No response from server. Please try again.");
                } else {
                    alert("An unexpected error occurred. Please try again.");
                }
            }
        };
        
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

    return (
        <React.Fragment>
            {productData && 
            <div className='px-5 md:px-20 lg:px-56 py-20 flex'>
                <div className='w-[35%] bg-gray-0 flex flex-col gap-2 '>
                    <div className='h-[450px]'>
                        <img
                            // src='https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg'
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <button className='bg-blue-500 py-3 rounded-lg text-white text-xl w-full hover:bg-blue-400'>Add to cart</button>
                </div>
                <div className='px-10 w-[65%] flex flex-col gap-2'>
                    <div className='h-[450px] py-5 flex flex-col gap-5'>
                        <div className='flex items-center justify-between w-full'>
                            <div>
                                <h1 className='text-4xl text-gray-800'>{productData.productName}</h1>
                                <h3 className='text-xl text-gray-500'>{productData.productDescription}</h3>
                            </div>
                            {true &&
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
                        <button className='border-2 border-blue-400 text-blue-400 py-1 rounded-lg px-8 text-xl'>Add to Wishlist</button>
                        <button onClick={handleBuyNow} className='bg-green-500 py-2 rounded-lg px-8 text-white text-xl hover:bg-green-400'>Buy now</button>
                    </div>
                </div>
            </div>
            }
            
        </React.Fragment>
    );
};

export default UserProductOverviewPage;
