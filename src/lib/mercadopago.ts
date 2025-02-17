import { CartItem } from './cart';

interface MercadoPagoPreference {
  items: Array<{
    title: string;
    unit_price: number;
    quantity: number;
    currency_id: string;
    picture_url?: string;
  }>;
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  notification_url?: string;
  external_reference?: string;
}

export async function createPreference(items: CartItem[]): Promise<string> {
  try {
    const preference: MercadoPagoPreference = {
      items: items.map(item => ({
        title: `${item.name} - ${item.size}`,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'BRL',
        picture_url: item.image_url
      })),
      back_urls: {
        success: `${window.location.origin}/success`,
        failure: `${window.location.origin}/cart`,
        pending: `${window.location.origin}/cart`
      },
      auto_return: 'approved',
      notification_url: `${window.location.origin}/api/webhook/mercadopago`
    };

    const response = await fetch('/api/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      throw new Error('Failed to create preference');
    }

    const data = await response.json();
    return data.init_point;
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    throw error;
  }
}