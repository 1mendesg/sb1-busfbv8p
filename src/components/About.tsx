import React from 'react';
import { History, Award, Users } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossa História
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desde 2000, a Usual Rótulos e Etiquetas tem sido referência em soluções personalizadas para identificação de produtos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-[--primary]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nossa Trajetória</h3>
            <p className="text-gray-600">
              Começamos como uma pequena gráfica e hoje somos líderes no segmento de rótulos e etiquetas no sul do Brasil.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-[--primary]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Compromisso com Qualidade</h3>
            <p className="text-gray-600">
              Investimos constantemente em tecnologia e processos para garantir a excelência em cada produto.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[--primary]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nossa Equipe</h3>
            <p className="text-gray-600">
              Contamos com profissionais especializados e apaixonados pelo que fazem.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
              alt="Nossa Fábrica"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4">Inovação e Tecnologia</h3>
            <p className="text-gray-600">
              Nossa história é marcada por constante evolução. Começamos com equipamentos básicos e hoje contamos com um parque industrial moderno e automatizado.
            </p>
            <p className="text-gray-600">
              Investimos em treinamento contínuo de nossa equipe e em tecnologias de ponta para oferecer produtos de alta qualidade e soluções inovadoras para nossos clientes.
            </p>
            <p className="text-gray-600">
              Nosso compromisso com a sustentabilidade nos levou a adotar práticas eco-friendly em nossa produção, utilizando materiais recicláveis e processos que minimizam o impacto ambiental.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}