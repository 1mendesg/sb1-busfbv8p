import mercadopago from 'mercadopago';
import { supabase } from '../../../lib/supabase';

mercadopago.configure({
  access_token: process.env.VITE_MERCADOPAGO_ACCESS_TOKEN as string
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      const payment = await mercadopago.payment.get(paymentId);

      const { external_reference, status } = payment.body;

      // Update order status in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: status,
          payment_id: paymentId
        })
        .eq('id', external_reference);

      if (error) throw error;
    }

    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ message: 'Error processing webhook' });
  }
}