import React from 'react';
import { MousePointer, Palette, Truck } from 'lucide-react';

const steps = [
  {
    icon: MousePointer,
    title: 'Escolha o seu produto',
    description: 'Selecione entre nossa ampla gama de produtos.',
  },
  {
    icon: Palette,
    title: 'Envie seu design para nosso time',
    description: 'Nossa equipe especializada irá analisar e preparar sua arte.',
  },
  {
    icon: Truck,
    title: 'Receba em casa ou na sua empresa',
    description: 'Entrega rápida e segura em todo o Brasil.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-blue-50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Como Funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg"
            >
              <div className="w-16 h-16 bg-[--primary] text-white rounded-full flex items-center justify-center mb-4">
                <step.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}