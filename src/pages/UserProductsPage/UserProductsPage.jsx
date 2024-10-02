import axios from 'axios'
import React, { useEffect, useState, useSyncExternalStore } from 'react'
import { IoSearch } from 'react-icons/io5'
import UserProductCard from '../../components/UserProductCard/UserProductCard'
import { getSocket, initiateSocketConnection } from '../../utilities/socketService'

const UserProductsPage = () => {

    const [productSearch, setProductSearch] = useState("")
    const [isSortOrFilterApplied, setIsSortOrFilterApplied] = useState(false)
    const [productsData, setProductsData] = useState([])
    const [filteredProductData, setFilteredProductData] = useState([])
    const [wishlistData, setWishlistData] = useState([])
    const [cartItemData, setCartItemData] = useState([])

    const handleClear = () => {
        setProductSearch("")
        setIsSortOrFilterApplied(false)
    }

    const isProductWishListed = (productId) => {
      return wishlistData?.some((list) => list._id === productId) || false
    }

    const isProductAddedInCart = (productId) => {
      return cartItemData?.some((item) => item._id === productId) || false
    }
    

    useEffect(() => {
        const getProductsData = async() => {
            try{
              const response = await axios.get(
                "/product/users",
                {
                  withCredentials: true
                }
              )
        
              if(response.status === 200){
                setProductsData(response.data.data)
                setFilteredProductData(response.data.data)
              }
              
            }
            catch (error) {
              if (error.response) {
                if (error.response.status === 500) {
                  alert("An error occurred while fetching Products data");
                } else {
                  alert(`An error occurred: ${error.response.status} ${error.response.data.message}`);
                }
              } else if (error.request) {
                alert("No response from server. Please try again.");
              } else {
                alert("An unexpected error occurred. Please try again.");
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
              alert("An error occurred while fetching Wishlist data");
            } else {
              alert(`An error occurred: ${error.response.status} ${error.response.data.message}`);
            }
          } else if (error.request) {
            alert("No response from server. Please try again.");
          } else {
            alert("An unexpected error occurred. Please try again.");
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
              alert("An error occurred while fetching Cart data");
            } else {
              alert(`An error occurred: ${error.response.status} ${error.response.data.message}`);
            }
          } else if (error.request) {
            alert("No response from server. Please try again.");
          } else {
            alert("An unexpected error occurred. Please try again.");
          }
        }
      }

        getAllCartItems()
        getAllWishlistedProducts()
        getProductsData()
    }, [])

    useEffect(() => {
        const searchQuery = productSearch.trim().toLowerCase();

        if(productSearch.length !== 0){
            setIsSortOrFilterApplied(true)
          }
          else{
            setIsSortOrFilterApplied(false)
          }
        const filteredData = Array.isArray(productsData) && productsData.length > 0 &&
        productsData.filter((product) =>
          product.productName.toLowerCase().includes(searchQuery) ||
          product.productDescription.toLowerCase().includes(searchQuery) 
    
        );
        setFilteredProductData(filteredData);
    }, [productSearch, productsData])

    

    useEffect(() => {
        initiateSocketConnection()
        const socket = getSocket()

        socket.on("productAdded", (addedProduct) => {
            setProductsData((prevState) => [...prevState, addedProduct])
        })

        socket.on("productUpdated", (updatedProduct) => {
            setProductsData((prevState) => {
                return prevState.map(product => 
                    product.id === updatedProduct.id ? updatedProduct : product
                );
            });
        });

        socket.on("productDeleted", (deletedProduct) => {
            setProductsData((prevState) => prevState.filter((product) => product._id !== deletedProduct._id))
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

  return (
    <div className='px-5 md:px:20 lg:px-56 py-10'>
      <div className=''>
        <div className=' search-filter-container flex items-center justify-between gap-4'>
          <div className='rounded-md py-1 px-2 shadow-custom-medium flex items-center gap-2 w-full lg:w-1/2'>
            <IoSearch className='text-xl text-gray-400'/>
            <input 
              className=' focus:outline-none w-full text-lg' 
              type='search' 
              name='search' 
              placeholder='Search Product'
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
            />
          </div>
          <div className='flex items-center gap-4'>
            {/* <Space direction="vertical">
              <Space wrap>
                <Dropdown menu={sortMenu} placement="bottom" arrow className='border-none shadow-custom-light text-gray-500 w-28'>
                  <Button>{sortButtonContent ? sortButtonContent : "Sort by "}<IoChevronDown className='text-sm'/></Button>
                </Dropdown>
              </Space>
            </Space> */}
            <button 
              className={`flex items-center gap-2 rounded-md shadow-custom-light px-4 py-1.5 text-lg ${isSortOrFilterApplied ? "bg-primaryBlue text-white " : 'bg-white text-gray-300 cursor-not-allowed'}`}
              onClick={handleClear}
            > 
              Clear 
            </button>
          </div>
        </div> 
        {
            productsData.length > 0 ?
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 py-10'>
                {
                    Array.isArray(filteredProductData) && filteredProductData.length > 0 ?
                    filteredProductData?.map((product, index) => (
                        <UserProductCard isProductWishListed={isProductWishListed(product._id)} isProductAddedInCart={isProductAddedInCart(product._id)} key={index} product={product}/>
                    ))
                    : <div className='flex w-full h-[70vh] items-center justify-center '>
                        <p className='text-2xl font-semibold'>No Products found</p>
                      </div>
                }
            </div>
            :
            <div className='flex w-full h-[70vh] items-center justify-center '>
              <p className='text-2xl font-semibold'>No Products found</p>
            </div>
        }

        
      </div>
    </div>
  )
}

export default UserProductsPage
