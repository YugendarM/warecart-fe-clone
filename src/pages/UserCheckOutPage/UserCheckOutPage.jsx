import React, { useEffect, useState } from 'react' 
import { MdDone } from 'react-icons/md' 
import { Button, Form, Input, InputNumber, Radio } from 'antd' 
import axios from 'axios' 
import { useLocation, useNavigate, useParams } from 'react-router-dom' 
import OrderSummaryProductCardComponent from '../../components/OrderSummaryProductCardComponent/OrderSummaryProductCardComponent' 
import PaypalPayment from '../../components/PaypalPayment/PaypalPayment' 
import StripePayment from '../../components/StripePayment/StripePayment' 
import UPIPaymentModal from '../../components/Modals/UPIPaymentModal/UPIPaymentModal' 
import { toast } from 'react-toastify'

const UserCheckOutPage = () => {
    const [form] = Form.useForm() 
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false) 
    const [addressData, setAddressData] = useState(null) 
    const [userData, setUserData] = useState({}) 
    const [isOrderSummaryContinue, setIsOrderSummaryContinue] = useState(false) 
    const [productsData, setProductsData] = useState([]) 
    const [selectedPayment, setSelectedPayment] = useState(null) 
    const [orderDetails, setOrderDetails] = useState({}) 
    const [isUPIpaymentModalOpen, setUPIPaymentModalOpen] = useState(false) 

    const location = useLocation() 
    const navigate = useNavigate() 

    const handleQuantityChange = (productId, newQuantity) => {
        setProductsData((prevProducts) =>
            prevProducts.map((product) =>
                product.productDetails._id === productId ? { ...product, quantity: newQuantity } : product
            )
        ) 
    } 

    const formatRupees = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount) 
    } 

    const getPriceDetails = async () => {
        const orderItems = productsData 
        try {
            const response = await axios.post(
                `/order/priceDetails`,
                { orderItems: productsData },
                {
                    withCredentials: true,
                }
            ) 

            if (response.status === 200) {
                setOrderDetails(response.data) 
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    toast.error(`An error occurred while fetching price details ${error.response.status}, ${error.response.data.message}`) 
                } else if (error.response.status === 400) {
                    toast.error(`No orders in item : ${error.response.status}, ${error.response.data.message}`) 
                } else {
                    toast.error(`An error occurred: ${error.response.status} ${error.response.data.message}`) 
                }
            } else if (error.request) {
                toast.error("No response from server. Please try again.") 
            } else {
                toast.error("An unexpected error occurred in fetching price details. Please try again.") 
            }
        }
    } 

    const getUserDetails = async () => {
        try {
            const response = await axios.get("/user/getUserDetails", { withCredentials: true }) 
            if (response.status === 200) {
                setUserData(response.data) 
                setAddressData({
                    addressFirstLine: response.data.addressFirstLine,
                    addressSecondLine: response.data.addressSecondLine,
                    city: response.data.city,
                    state: response.data.state,
                    pincode: response.data.pincode,
                    phoneNo: response.data.phoneNo,
                }) 
            }
        } catch (error) {
            if (error.response) {
                toast.error(`Error: ${error.response.status} - ${error.response.data.message}`) 
            } else {
                toast.error("An unexpected error occurred in fetching user details. Please try again.") 
            }
        }
    } 

    const handleAddressOk = async (values) => {
        try {
            const response = await axios.put(`/user/updateUserAddress`, {
                addressFirstLine: values.addressFirstLine,
                addressSecondLine: values.addressSecondLine,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
                phoneNo: values.phoneNo,
            }, { withCredentials: true }) 

            if (response.status === 200) {
                toast.success("User updated successfully") 
                getUserDetails() 
            }
        } catch (error) {
            if (error.response) {
                toast.error(`Error: ${error.response.status} - ${error.response.data.message}`) 
            } else {
                toast.error("An unexpected error occurred. Please try again.") 
            }
        }
    } 

    const handleOrderContinue = () => {
        setIsOrderSummaryContinue(true) 
    } 

    const handlePaymentMethodChange = (e) => {
        const value = e.target.value 
        if (value === 'cod') {
            setSelectedPayment({ method: value, sub: "cod" })  // cod on Delivery
        } else {
            setSelectedPayment({ method: value, sub: null })  // Reset sub-options for other methods
        }
    } 

    const handleUPIChange = (e) => {
        const value = e.target.value 
        setSelectedPayment({ method: 'upi', sub: value })  // Set UPI selection
    } 

    const handleCardChange = (e) => {
        const value = e.target.value 
        setSelectedPayment({ method: 'card', sub: value })  // Set Card selection
    } 

    const processOrder = async (paymentMethod) => {
        const orderData = {
            products: orderDetails.orderItems.map((item) => {
                return {
                    product: item.productDetails._id,
                    quantity: item.quantity,
                    price: item.productDetails.price,
                } 
            }),
            platformFee: orderDetails.priceDetails.platformFee,
            totalAmount: orderDetails.priceDetails.totalPrice,
            discountedAmount: orderDetails.priceDetails.totalDiscount,
            payableAmount: orderDetails.priceDetails.totalPayable,
            paymentInfo: {
                paymentMethod: paymentMethod,
                paymentStatus: paymentMethod === "cod" ? "pending" : "completed",
            },
        } 

        try {
            const response = await axios.post(`/order/add`,
                orderData,
                { withCredentials: true }) 

            if (response.status === 201) {
                await Promise.all(orderDetails.orderItems.map(item =>
                    axios.post(
                        '/userActivity/track',
                        {
                            action: 'purchase',
                            productId: item.productDetails._id,
                            additionalInfo: { quantity: item.quantity, paymentMethod: paymentMethod },
                        },
                        {
                            withCredentials: true,
                        }
                    )
                )) 
                toast.success("Order placed Successfully") 
                navigate("/orders") 
            }
        } catch (error) {
            if (error.response) {
                toast.error(`Error while placing the order: ${error.response.status} - ${error.response.data.message}`) 
            } else {
                toast.error("An unexpected error occurred while placing the order. Please try again.") 
            }
        }
    } 

    const proceedUPIPayment = async () => {
        setUPIPaymentModalOpen(true) 
    } 

    const handleUPIPaymentModalClose = () => {
        setUPIPaymentModalOpen(false) 
    } 

    const processStripePayment = async (transactionId) => {
        const orderData = {
            products: orderDetails.orderItems.map((item) => {
                return {
                    product: item.productDetails._id,
                    quantity: item.quantity,
                    price: item.productDetails.price,
                } 
            }),
            platformFee: orderDetails.priceDetails.platformFee,
            totalAmount: orderDetails.priceDetails.totalPrice,
            discountedAmount: orderDetails.priceDetails.totalDiscount,
            payableAmount: orderDetails.priceDetails.totalPayable,
            paymentInfo: {
                paymentMethod: "stripe",
                paymentStatus: "completed",
                transactionId: transactionId,
            },
        } 

        try {
            const response = await axios.post(`/order/add`,
                orderData,
                { withCredentials: true }) 

            if (response.status === 201) {
                try {
                    await Promise.all(orderDetails?.orderItems?.map(item =>
                        axios.post(
                            '/userActivity/track',
                            {
                                action: 'purchase',
                                productId: item.productDetails._id,
                                additionalInfo: { quantity: item.quantity, paymentMethod: "stripe" },
                            },
                            {
                                withCredentials: true,
                            }
                        )
                    )) 
                    toast.success('Order placed Successfully') 
                    navigate("/orders") 
                } catch (error) {
                    console.error('Error tracking user activity:', error) 
                    toast.warn('Order placed, but tracking failed.') 
                }
            }
        } catch (error) {
            if (error.response) {
                toast.error(`Error while placing the order: ${error.response.status} - ${error.response.data.message}`) 
            } else {
                toast.error("An unexpected error occurred while placing the order. Please try again.") 
            }
        }
    } 

    useEffect(() => {
        if (selectedPayment?.sub && selectedPayment.sub === "stripe") {
            sessionStorage.setItem("checkoutState", JSON.stringify(location.state.products)) 
        }
    }, [selectedPayment, selectedPayment?.sub]) 

    const getStoredProducts = () => {
        const storedState = sessionStorage.getItem("checkoutState") 
        try {
            return storedState ? JSON.parse(storedState) : null 
        } catch (error) {
            console.error("Error parsing storedState:", error) 
            return null 
        }
    } 

    useEffect(() => {
        const storedProducts = getStoredProducts() 
        const products = location.state?.products || storedProducts 

        if (products) {
            setProductsData(products) 
        } else {
            navigate("/") 
        }

        getUserDetails() 
    }, [location.state, navigate]) 

    useEffect(() => {
        if (userData.addressFirstLine) {
            setIsAddressFormOpen(false) 
        } else {
            setIsAddressFormOpen(true) 
        }
    }, [userData]) 

    useEffect(() => {
        if (productsData.length > 0) {
            getPriceDetails() 
        }
    }, [productsData]) 

    useEffect(() => {
        const params = new URLSearchParams(location.search) 
        const paymentStatus = params.get('paymentStatus') 
        const transactionId = params.get('transactionId')

        if(paymentStatus && paymentStatus === "success" && productsData.length > 0){
            processStripePayment(paymentStatus, transactionId)
        }
    }, [productsData, orderDetails])


    return (
        <div className='px-56 flex gap-5 py-10'>
            <div className='w-[70%] flex flex-col gap-8'>
                <div className='shadow-custom-medium rounded-sm flex gap-4 px-5 py-5 '>
                    <p className='text-blue-500 bg-gray-200 p-1 text-xs font-semibold h-6 text-center align-middle w-6 rounded-sm'>1</p>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className='flex items-start justify-between '>
                            <div className='flex items-center gap-4'>
                                <h3 className='text-gray-400 font-semibold'>DELIVERY ADDRESS</h3>
                                {!isAddressFormOpen && <MdDone className='text-blue-500 text-xl' />}
                            </div>
                            <button onClick={() => setIsAddressFormOpen(true)} className={`px-4 py-1 rounded-sm ${isAddressFormOpen ? "text-gray-300 border border-gray-300 cursor-not-allowed" : "text-blue-500 border border-blue-500"}`}>
                                Edit
                            </button>
                        </div>
                        {isAddressFormOpen ? (
                            <div className='w-full'>
                                <Form
                                    initialValues={addressData}
                                    form={form}
                                    name="basic"
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 16 }}
                                    style={{ width: 500 }}
                                    onFinish={handleAddressOk}
                                    autoComplete="off"
                                >
                                    <Form.Item label="Address First Line" name="addressFirstLine" rules={[{ required: true, message: 'Please enter the Address First Line!' }]}>
                                        <Input style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item label="Address Second Line" name="addressSecondLine" rules={[{ required: true, message: 'Please enter the Address Second Line!' }]}>
                                        <Input style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item label="City" name="city" rules={[{ required: true, message: 'Please enter the City!' }]}>
                                        <Input style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item label="State" name="state" rules={[{ required: true, message: 'Please enter the State!' }]}>
                                        <Input style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item label="Pincode" name="pincode" rules={[{ required: true, message: 'Please enter the Pincode!' }]}>
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item label="Phone Number" name="phoneNo" rules={[{ required: true, message: 'Please enter the Phone Number!' }]}>
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item wrapperCol={{ offset: 18, span: 8 }} style={{ gap: "20px" }}>
                                        <Button htmlType="button" onClick={() => form.resetFields()}>
                                            Clear
                                        </Button>
                                        <Button type="primary" htmlType="submit">
                                            Ok
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        ) : (
                            <div>
                                {userData?.addressFirstLine && (
                                    <>
                                        <p className='capitalize'><span className='font-semibold'>{userData.firstName}</span>, {userData.addressFirstLine}, {userData.addressSecondLine}</p>
                                        <p>{userData.city}, {userData.state}</p>
                                        <p className='font-semibold'>{userData.pincode}</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className='shadow-custom-medium rounded-sm flex gap-4 px-5 py-5'>
                    <div className='w-full flex gap-3'>
                        <p className='text-blue-500 bg-gray-200 p-1 text-xs font-semibold h-6 text-center align-middle w-6 rounded-sm'>2</p>
                        <div className='flex flex-col gap-4 w-full'>
                                <div className='flex items-center gap-4'>
                                    <h3 className='text-gray-400 font-semibold'>ORDER SUMMARY</h3>
                                    {isOrderSummaryContinue && <MdDone className='text-blue-500 text-xl' />}
                                </div>
                            {
                                !isAddressFormOpen &&
                                <div>
                                    <div className='flex flex-col '>
                                        <div className='py-5 flex flex-col gap-10'>
                                            {/* {productsData[0].productDetails.quantity} */}
                                            {orderDetails?.orderItems && orderDetails.orderItems.length > 0 ? (
                                                orderDetails.orderItems.map((productData, index) => (
                                                    <OrderSummaryProductCardComponent onQuantityChange={handleQuantityChange} isOrderSummaryContinue={isOrderSummaryContinue} key={index} productData={productData}  />
                                                ))
                                            ) : (
                                                <h1>No products available</h1> // Optional: a fallback when no products are present
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex justify-end'>
                                        <button onClick={handleOrderContinue} className={`rounded-sm px-6 py-2 transition ${isOrderSummaryContinue ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-yellow-500 text-white hover:bg-yellow-300"}`}>Continue</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className='shadow-custom-medium rounded-sm flex gap-4 px-5 py-5'>
                    <div className='w-full flex gap-3'>
                        <p className='text-blue-500 bg-gray-200 p-1 text-xs font-semibold h-6 text-center align-middle w-6 rounded-sm'>3</p>
                        <div className='flex flex-col gap-4 w-full'>
                            <div className='flex items-center gap-4'>
                                <h3 className='text-gray-400 font-semibold'>PAYMENT METHOD</h3>
                                {selectedPayment?.sub && <MdDone className='text-blue-500 text-xl' />}
                            </div>
                            {
                                isOrderSummaryContinue &&
                                <div className='flex flex-col gap-5'>
                                    <Radio.Group onChange={handlePaymentMethodChange} value={selectedPayment?.method}>
                                        <div className='flex flex-col gap-5'>
                                            <Radio className='inline-block border-b border-b-gray-300' value="upi">
                                                UPI 
                                                <p className='text-gray-400 pt-3'>Make hasslefree payments with your UPI</p>
                                                {selectedPayment?.method === 'upi' && (
                                                    <div className='ml-20 '>
                                                        <p className='font-semibold text-md py-3'>Choose an option</p>
                                                        <Radio.Group onChange={handleUPIChange} value={selectedPayment.sub}>
                                                            <div className='flex flex-col gap-5'>
                                                                <Radio value="gpay">GPay</Radio>
                                                                <Radio value="phonepe">Phone Pe</Radio>
                                                            </div>
                                                        </Radio.Group>
                                                    </div>
                                                )}
                                            </Radio>
                                            <Radio className='inline-block  border-b border-b-gray-300' value="card">
                                                Credit / Debit / ATM Card
                                                <p className='text-gray-400 pt-3'>Make secure payments with our payment gateway providers</p>
                                                {selectedPayment?.method === 'card' && (
                                                    <div className='ml-20'>
                                                        <p className='font-semibold text-md py-3'>Choose an option</p>
                                                        <Radio.Group onChange={handleCardChange} value={selectedPayment.sub}>
                                                            <div className='flex flex-col gap-5'>
                                                                <Radio value="stripe">Stripe</Radio>
                                                                <Radio value="paypal">Paypal</Radio>
                                                            </div>
                                                        </Radio.Group>
                                                    </div>
                                                )}
                                            </Radio>
                                            <Radio className='inline-block  border-b border-b-gray-300 pb-5' value="cod">Cash On Delivery</Radio>
                                        </div>
                                    </Radio.Group>
                                    <div className='flex justify-end'>
                                        {
                                            selectedPayment?.sub && selectedPayment.sub === "paypal" ?
                                            <PaypalPayment cartAmount={orderDetails?.priceDetails && orderDetails.priceDetails.totalPayable} orderDetails={orderDetails}/>
                                            :
                                            selectedPayment?.sub && selectedPayment.sub === "stripe" ?
                                            <StripePayment userData={userData} cartAmount={orderDetails?.priceDetails && orderDetails.priceDetails.totalPayable}/>
                                            :
                                            selectedPayment?.sub && selectedPayment.sub === "cod" ?
                                            <button onClick={() => processOrder("cod")} className={`rounded-sm px-6 py-2 transition ${!selectedPayment?.sub || !isOrderSummaryContinue ? " bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-yellow-500 text-white hover:bg-yellow-300"}`} >Place Order</button>
                                            :

                                            <button onClick={proceedUPIPayment} className={`rounded-sm px-6 py-2 transition ${!selectedPayment?.sub || !isOrderSummaryContinue ? " bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-yellow-500 text-white hover:bg-yellow-300"}`}>Proceed Payment</button>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className='shadow-custom-medium rounded-sm flex flex-col w-[30%] h-full sticky top-10'>
                <h1 className='text-gray-400 font-semibold border-b px-5 py-5 border-b-gray-200 w-full'>PRICE DETAILS</h1>
                <div className='border-b border-b-gray-200 flex flex-col gap-4 py-5'>
                    <div className='flex items-center justify-between px-5'>
                        <p>Price ({productsData?.length} item)</p>
                        <p>{orderDetails?.priceDetails && formatRupees(orderDetails.priceDetails.totalPrice)}/-</p>
                    </div>
                    {
                        orderDetails?.priceDetails && orderDetails.priceDetails.totalDiscount > 0 &&
                        <div className='flex items-center justify-between px-5'>
                            <p>Discounts </p>
                            <p className='text-green-500'>- {orderDetails?.priceDetails && formatRupees(orderDetails.priceDetails.totalDiscount)}/-</p>
                        </div>
                    }
                    <div className='flex items-center justify-between px-5'>
                        <p>Delivery Charge</p>
                        <p className='text-green-500'>FREE</p>
                    </div>
                </div>
                <div className='flex items-center justify-between px-5 py-5 border-b border-b-gray-200'>
                    <p>Platform Fee</p>
                    <p className=''>{orderDetails?.priceDetails && formatRupees(orderDetails.priceDetails.platformFee)}/-</p>
                </div>
                <div className='flex items-center justify-between px-5 py-5 border-b-gray-200'>
                    <p className='font-semibold text-base'>Total Payable</p>
                    <p className=''>{orderDetails?.priceDetails && formatRupees(orderDetails.priceDetails.totalPayable)}/-</p>
                </div>

                {
                    orderDetails?.priceDetails && orderDetails.priceDetails.totalSavings > 0 &&
                    <div className='flex items-center justify-between px-5 py-5 border-b-gray-200'>
                        <p className='font-medium text-base text-center w-full text-green-500'>You will save {orderDetails?.priceDetails && formatRupees(orderDetails.priceDetails.totalSavings)}/- on this order</p>
                    </div>
                }
            </div>

            <UPIPaymentModal orderDetails={orderDetails} isUPIpaymentModalOpen={isUPIpaymentModalOpen} paymentMethod={selectedPayment?.sub && selectedPayment.sub} handleModalClose={handleUPIPaymentModalClose}/>
        </div>
    ) 
} 

export default UserCheckOutPage 


