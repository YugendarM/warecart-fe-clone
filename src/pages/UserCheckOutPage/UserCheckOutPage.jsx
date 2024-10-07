import React, { useEffect, useState } from 'react';
import { MdDone } from 'react-icons/md';
import { Button, Form, Input, InputNumber, Radio } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderSummaryProductCardComponent from '../../components/OrderSummaryProductCardComponent/OrderSummaryProductCardComponent';
import PaypalPayment from '../../components/PaypalPayment/PaypalPayment';
import StripePayment from '../../components/StripePayment/StripePayment';

const UserCheckOutPage = () => {
    const [form] = Form.useForm();
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [addressData, setAddressData] = useState(null);
    const [userData, setUserData] = useState({});
    const [isOrderSummaryContinue, setIsOrderSummaryContinue] = useState(false);
    const [productsData, setProductsData] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [orderDetails, setOrderDetails] = useState({})

    const location = useLocation();
    const navigate = useNavigate();

    const handleQuantityChange = (productId, newQuantity) => {
        setProductsData((prevProducts) =>
          prevProducts.map((product) =>
            product.productDetails._id === productId ? { ...product, quantity: newQuantity } : product
          )
        );
      };

    const formatRupees = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0, // Adjust if you want decimals
        }).format(amount);
    };

    const getPriceDetails = async() => {
        const orderItems = productsData
        try{
            const response = await axios.post(
              `/order/priceDetails`,
                {orderItems : productsData} ,
              {
                withCredentials: true
              }
            )
      
            if(response.status === 200){
              setOrderDetails(response.data)
            }
            
          }
          catch (error) {
            if (error.response) {
              if (error.response.status === 500) {
                alert(`An error occurred while fetching price details ${error.response.status}, ${error.response.data.message}`);
              } else if (error.response.status === 400) {
                alert(`No orders in item : ${error.response.status}, ${error.response.data.message}`);
              }  else {
                alert(`An error occurred: ${error.response.status} ${error.response.data.message}`);
              }
            } else if (error.request) {
              alert("No response from server. Please try again.");
            } else {
              alert("An unexpected error occurred in fetching price details. Please try again.");
            }
          }
    }

    const getUserDetails = async () => {
        try {
            const response = await axios.get("/user/getUserDetails", { withCredentials: true });
            if (response.status === 200) {
                setUserData(response.data);
                setAddressData({
                    addressFirstLine: response.data.addressFirstLine,
                    addressSecondLine: response.data.addressSecondLine,
                    city: response.data.city,
                    state: response.data.state,
                    pincode: response.data.pincode,
                    phoneNo: response.data.phoneNo
                });
            }
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else {
                alert("An unexpected error occurred in fetching user details. Please try again.");
            }
        }
    };

    const handleAddressOk = async (values) => {
        try {
            const response = await axios.put(`/user/updateUserAddress`, {
                addressFirstLine: values.addressFirstLine,
                addressSecondLine: values.addressSecondLine,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
                phoneNo: values.phoneNo
            }, { withCredentials: true });

            if (response.status === 200) {
                alert("User updated successfully");
                getUserDetails();
            }
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleOrderContinue = () => {
        setIsOrderSummaryContinue(true);
    };

    const handlePaymentMethodChange = (e) => {
        const value = e.target.value;
        if (value === 'cash') {
            setSelectedPayment({ method: value, sub: "cash" }); // Cash on Delivery
        } else {
            setSelectedPayment({ method: value, sub: null }); // Reset sub-options for other methods
        }
    };

    const handleUPIChange = (e) => {
        const value = e.target.value;
        setSelectedPayment({ method: 'upi', sub: value }); // Set UPI selection
    };

    const handleCardChange = (e) => {
        const value = e.target.value;
        setSelectedPayment({ method: 'card', sub: value }); // Set Card selection
    };

    const processOrder = async(paymentMethod) => {
        const orderData = {
          products: orderDetails.orderItems.map((item) => {
            return {
              product: item.productDetails._id,
              quantity: item.quantity,
              price: item.productDetails.price
            }
          }),
            platformFee: orderDetails.priceDetails.platformFee,
            totalAmount: orderDetails.priceDetails.totalPrice,
            discountedAmount: orderDetails.priceDetails.totalDiscount,
            payableAmount : orderDetails.priceDetails.totalPayable,
            paymentInfo: {
              paymentMethod: paymentMethod,
              paymentStatus: "pending",
            }
        }
    
        try {
          const response = await axios.post(`/order/add`, 
            orderData,
            { withCredentials: true });
    
          if (response.status === 201) {
              alert("Order placed Successfully");
              navigate("/orders")
          }
        } catch (error) {
            if (error.response) {
                alert(`Error while placing the order: ${error.response.status} - ${error.response.data.message}`);
            } else {
                alert("An unexpected error occurred while placing the order. Please try again.");
            }
        }
    }

    const proceedUPIPayment = async() => {
        processOrder("gpay")
    }

    useEffect(() => {
        if (location.state && location.state.products) {
            setProductsData(location.state.products);
        } else {
            navigate("/");
        }
        getUserDetails();
    }, [location.state, navigate]);

    useEffect(() => {
        if (userData.addressFirstLine) {
            setIsAddressFormOpen(false);
        } else {
            setIsAddressFormOpen(true);
        }
    }, [userData]);

    useEffect(() => {
        if(productsData.length > 0){
            getPriceDetails()
        }
    }, [productsData])

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
                                {userData && userData.addressFirstLine && (
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
                                            {orderDetails && orderDetails.orderItems && orderDetails.orderItems.length > 0 ? (
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
                                {selectedPayment && selectedPayment.sub && <MdDone className='text-blue-500 text-xl' />}
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
                                                                <Radio value="gpayyyyyyy">GPay</Radio>
                                                                <Radio value="phonepay">Phone Pay</Radio>
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
                                            <Radio className='inline-block  border-b border-b-gray-300 pb-5' value="cash">Cash On Delivery</Radio>
                                        </div>
                                    </Radio.Group>
                                    <div className='flex justify-end'>
                                        {
                                            selectedPayment && selectedPayment.sub && selectedPayment.sub === "paypal" ?
                                            <PaypalPayment cartAmount={orderDetails && orderDetails.priceDetails && orderDetails.priceDetails.totalPayable} orderDetails={orderDetails}/>
                                            :
                                            selectedPayment && selectedPayment.sub && selectedPayment.sub === "stripe" ?
                                            <StripePayment userData={userData} cartAmount={orderDetails && orderDetails.priceDetails && orderDetails.priceDetails.totalPayable}/>
                                            :
                                            selectedPayment && selectedPayment.sub && selectedPayment.sub === "cash" ?
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
                        <p>Price ({productsData && productsData.length} item)</p>
                        <p>{orderDetails && orderDetails.priceDetails && formatRupees(orderDetails.priceDetails.totalPrice)}/-</p>
                    </div>
                    {
                        orderDetails && orderDetails.priceDetails && orderDetails.priceDetails.totalDiscount > 0 &&
                        <div className='flex items-center justify-between px-5'>
                            <p>Discounts </p>
                            <p className='text-green-500'>- {orderDetails && orderDetails.priceDetails && formatRupees(orderDetails.priceDetails.totalDiscount)}/-</p>
                        </div>
                    }
                    <div className='flex items-center justify-between px-5'>
                        <p>Delivery Charge</p>
                        <p className='text-green-500'>FREE</p>
                    </div>
                </div>
                <div className='flex items-center justify-between px-5 py-5 border-b border-b-gray-200'>
                    <p>Platform Fee</p>
                    <p className=''>{orderDetails && orderDetails.priceDetails && formatRupees(orderDetails.priceDetails.platformFee)}/-</p>
                </div>
                <div className='flex items-center justify-between px-5 py-5 border-b-gray-200'>
                    <p className='font-semibold text-base'>Total Payable</p>
                    <p className=''>{orderDetails && orderDetails.priceDetails && formatRupees(orderDetails.priceDetails.totalPayable)}/-</p>
                </div>

                {
                    orderDetails && orderDetails.priceDetails && orderDetails.priceDetails.totalSavings > 0 &&
                    <div className='flex items-center justify-between px-5 py-5 border-b-gray-200'>
                        <p className='font-medium text-base text-center w-full text-green-500'>You will save {orderDetails && orderDetails.priceDetails && formatRupees(orderDetails.priceDetails.totalSavings)}/- on this order</p>
                    </div>
                }
            </div>
        </div>
    );
};

export default UserCheckOutPage;


