import { Router, Request, Response } from 'express';
import { addPayment, getAllPayments, getPaymentByID, updatePaymentStatus } from '@server/static/PaymentStatic';

const router = Router();

// Add a payment
router.post('/payment', (req: Request, res: Response) => {
    const result = addPayment(req.body);
    res.status(result.success ? 201 : 400).send(result.payment);
});

// Get all payments
router.get('/payments', (req: Request, res: Response) => {
    const result = getAllPayments();
    res.status(result.success ? 200 : 404).send(result.payments);
});

// Get payment by ID
router.get('/payment/:paymentId', (req: Request, res: Response) => {
    const result = getPaymentByID(parseInt(req.params.paymentId));
    res.status(result.success ? 200 : 404).send(result.payment);
});

// Update payment status
router.put('/payment/:paymentId/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const result = updatePaymentStatus(parseInt(req.params.paymentId), status);
    res.status(result.success ? 200 : 404).send(result.message);
});

export default router;
