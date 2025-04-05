import { IPayment, Status } from "@gofetch/models/IPayment";
import { createNotification } from "@client/services/NotificationRegistry";
import { getBooking } from "@client/services/BookingRegistry";
import { NotificationType } from "@gofetch/models/INotification";
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

export async function updatePaymentStatusWONotif(paymentId: number, status: Status) {
    try {
        const response = await fetch(`${API_URL}/payment/${paymentId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        const result = await response.text(); // Expecting a simple message response

        if (response.ok) {
            console.log('Payment status updated successfully:', result);
            return { success: true, message: result };
        } else {
            console.error('Failed to update payment status:', result);
            return { success: false, message: result };
        }
    } catch (error) {
        console.error('Error in updating payment status:', error);
        return { success: false, message: 'An error occurred while updating payment status' };
    }
}

export async function getPayment(paymentId: number) {
    try {
        const response = await fetch(`${API_URL}/payment/${paymentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const payment = await response.json();
            console.log("Payment details:", payment);
            return payment;
        } else {
            console.error('Failed to fetch payment:', await response.text());
            return null;
        }
    } catch (error) {
        console.error('Error fetching payment:', error);
        return null;
    }
}

export async function getPaymentByBookingId(bookingId: number) {
    try {
        const response = await fetch(`${API_URL}/payment/booking/${bookingId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const payment = await response.json();
            return payment;
        } else {
            console.error('Failed to fetch payment by booking ID:', await response.text());
            return null;
        }
    } catch (error) {
        console.error('Error fetching payment by booking ID:', error);
        return null;
    }
}

export async function updatePaymentStatus(paymentId: number, status: Status, refundType: string = "none") {
    await updatePaymentStatusWONotif(paymentId, status);

    const payment = await getPayment(paymentId);
    const bookingResponse = await getBooking(payment.bookingId);
    const booking = bookingResponse?.booking;

    console.log("booking", booking);

    let messageContent = "";
    let notificationData = null;

    if (status === Status.PAID) {
        messageContent = `You've been paid $${payment.amount} for Booking #${booking.id}! 🎉`;

        notificationData = {
            userId: booking.minderId, // Notify the pet minder
            message: messageContent,
            type: NotificationType.System,
            linkId: 0
        };
    } else if (status === Status.REFUNDED) {
        if (refundType === "cancel") {
            messageContent = `You have cancelled the booking. You have now been fully refunded.`;
        }
        else if (refundType === "decline") {
            messageContent = `The pet minder has declined your request. Your booking #${booking.id} has now been refunded.`;
        }

        notificationData = {
            userId: booking.ownerId, // Notify the pet owner
            message: messageContent,
            type: NotificationType.System,
            linkId: 0
        };
    }

    // Send notification if a valid one is created
    if (notificationData) {
        await createNotification(notificationData);
    }
}
