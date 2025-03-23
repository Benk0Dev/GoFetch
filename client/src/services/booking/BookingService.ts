// src/services/booking/BookingService.ts
import axios from "axios";
import { IBooking } from "../../models/IBooking";

// This function will send a POST request to the backend to create the booking
export const createBooking = async (bookingData: IBooking) => {
  try {
    // Assuming your backend API is at '/api/bookings'
    const response = await axios.post("http://localhost:3001/booking", bookingData);

    // Return the response from the server
    return response.data; // { success: true/false, message: "Booking created successfully!" }
  } catch (error) {
    // If there's an error during the request, log it and throw an error
    console.error("Error creating booking:", error);
    throw new Error("Booking submission failed");
  }
};