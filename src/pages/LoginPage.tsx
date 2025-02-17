import React from 'react';
import { AuthModal } from '../components/AuthModal';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <AuthModal 
        isOpen={true}
        onClose={() => window.history.back()}
        onSuccess={() => {}}
      />
    </div>
  );
}