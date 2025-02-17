import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ana Silva',
    company: 'Café Aroma',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    text: 'Os rótulos da Usual transformaram a apresentação dos nossos produtos. A qualidade é excepcional!',
  },
  {
    name: 'Carlos Santos',
    company: 'Moda Elegante',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
    text: 'Excelente atendimento e produtos de alta qualidade. Nossas etiquetas nunca ficaram tão bonitas.',
  },
  {
    name: 'Marina Costa',
    company: 'Cosméticos Naturais',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
    text: 'Parceria que deu super certo! Os rótulos são resistentes e mantêm a qualidade mesmo em contato com água.',
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          O que Nossos Clientes Dizem
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.text}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}