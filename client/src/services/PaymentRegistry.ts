import { IPayment } from "@gofetch/models/IPayment";

import { API_URL } from "@client/services/Registry";

export const createPayment = async (paymentData: Omit<IPayment, "id" | "status" | "createdAt" | "updatedAt">) => {
    try {
      // Step 1: Send a POST request to create the payment
      const response = await fetch(`${API_URL}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
  
      if (response.ok) {
        const payment = await response.json();
  
        return payment;
      } else {
        console.error("Payment creation failed", await response.text());
        return null;
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      return null;
    }
  };