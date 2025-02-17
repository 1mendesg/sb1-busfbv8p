import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.VITE_MERCADOPAGO_ACCESS_TOKEN as string
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const preference = await mercadopago.preferences.create(req.body);
    return res.status(200).json(preference.body);
  } catch (error) {
    console.error('Error creating preference:', error);
    return res.status(500).json({ message: 'Error creating preference' });
  }
}