import { IPayment, Status } from '@gofetch/models/IPayment';
import { addPaymentCached, getCachedPayments } from '@server/services/PaymentCached';
import { DB_PATH, cache } from '@server/services/Cache';
import fs from 'fs';

export function getPaymentByID(paymentId: number) {
    const payment = cache.payments.find(payment => payment.id === paymentId);
    if (payment) {
        return { success: true, payment };
    }
    return { success: false, message: 'Payment not found' };
}

export function getAllPayments() {
    const result = getCachedPayments();
    if (result.length === 0) {
        return { success: false, message: 'No payments found' };
    }
    return { success: true, payments: result };
}

export function getPaymentByBookingId(bookingId: number) {
    const payment = cache.payments.find(payment => payment.bookingId === bookingId);
    if (payment) {
        return { success: true, payment };
    }
    return { success: false, message: 'Payment not found' };
}

export function getPaymentsForPayer(userId: number) {
    const userBookingIds = cache.bookings
        .filter(booking => booking.ownerId === userId)
        .map(booking => booking.id);

    const payments = cache.payments.filter(payment => 
        userBookingIds.includes(payment.bookingId)
    );

    if (payments.length > 0) {
        return { success: true, payments };
    }
    return { success: false, message: 'No payments found for the given user' };
}

export function getPaymentsForPayee(userId: number) {
    const userBookingIds = cache.bookings
        .filter(booking => booking.minderId === userId)
        .map(booking => booking.id);
    const payments = cache.payments.filter(payment =>
        userBookingIds.includes(payment.bookingId)
    );
    if (payments.length > 0) {
        return { success: true, payments };
    }
    return { success: false, message: 'No payments found for the given user' };
}

export function addPayment(payment: IPayment) {
    return addPaymentCached(payment);
}

export function updatePaymentStatus(paymentId: number, status: Status) {
    const paymentIndex = cache.payments.findIndex(payment => payment.id === paymentId);
    if (paymentIndex !== -1) {
        cache.payments[paymentIndex].status = status;
        cache.payments[paymentIndex].updatedAt = new Date();
        try {
            fs.writeFileSync(`${DB_PATH}/payments.json`, JSON.stringify(cache.payments, null, 2), 'utf8');
            return { success: true, message: 'Payment status was updated successfully' };
        } catch (error) {
            console.error('Error updating payment status:', error);
            return { success: false, message: 'Error updating payment status' };
        }
    }
    return { success: false, message: 'Payment not found' };
}
