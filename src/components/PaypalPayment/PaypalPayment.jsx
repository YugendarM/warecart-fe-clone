import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

function PaypalPayment({cartAmount}) {

  const navigate = useNavigate()

  return (
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={async () => {
          return fetch(`http://localhost:3500/api/v1/payment/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cart: cartAmount,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data && data.id) {
                return data.id;
              }
              throw new Error("Failed to create order");
            })
            .catch((error) => {
              console.error("Error creating order:", error);
            });
        }}
        onApprove={async (data, actions) => {
          try {
            const response = await fetch(
              `http://localhost:3500/api/v1/payment/api/orders/${data.orderID}/capture`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
        
            const orderData = await response.json();
        
            const errorDetail = orderData?.details?.[0];
        
            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
              return actions.restart();
            } 
            else if (errorDetail) {
              throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
            } 
            else {
              const transaction = orderData.purchase_units[0].payments.captures[0];
              console.log(
                "Capture result",
                orderData,
                JSON.stringify(orderData, null, 2)
              );
              console.log("transaction")
              console.log(transaction)
              if(transaction.status === "COMPLETED"){
                alert("Payment Sucess", "Redirecting to orders")
                navigate("/orders")
              }
            }
          } catch (error) {
            console.error(error);
          }
        }}
        
      />
  );
}

export default PaypalPayment;
