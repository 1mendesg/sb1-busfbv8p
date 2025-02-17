import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../lib/cart';
import { Link } from 'react-router-dom';

export function CartIcon() {
  const items = useCart((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link to="/cart" className="relative">
      <ShoppingCart className="w-6 h-6 text-gray-600" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}