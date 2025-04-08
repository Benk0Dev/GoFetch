import fs from 'fs';
import { IPayment, Status } from '@gofetch/models/IPayment';
import { cache, DB_PATH } from '@server/utils/Cache';

export function getCachedPayments(): IPayment[] {
    try {
        return cache.payments;
    }
    catch (error) {
        return [];
    }
}

export function addPaymentCached(report: Omit<IPayment, "id" | "status" | "createdAt" | "updatedAt">) {
    try {
        const newId = cache.payments.length > 0 ? cache.payments[cache.payments.length - 1].id + 1 + 1 : 1;
        const newPayment: IPayment = {
            id: newId,
            amount: report.amount,
            cardDetails: {
                cardNumber: report.cardDetails.cardNumber,
                expiryDate: report.cardDetails.expiryDate,
                cvv: report.cardDetails.cvv,
                cardName: report.cardDetails.cardName,
            },
            status: Status.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        cache.payments.push(newPayment);

        savePaymentsToFile(cache.payments);

        return { success: true, message: 'Payment added successfully!', payment: newPayment };
    } catch (error) {
        return { success: false, message: 'Failed to add payment' };
    }
}

function savePaymentsToFile(payments: IPayment[]) {
    fs.writeFileSync(`${DB_PATH}/payments.json`, JSON.stringify(payments, null, 2), 'utf8');
}