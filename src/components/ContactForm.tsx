import React from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';

type FormData = {
  name: string;
  phone: string;
  company: string;
  email: string;
  message: string;
};

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .insert([data]);

      if (error) throw error;

      setSubmitStatus('success');
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <section id="contact" className="py-16 bg-blue-50">
      <div className="container max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Solicite um Orçamento
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                {...register('name', { required: 'Nome é obrigatório' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                {...register('phone', { required: 'Telefone é obrigatório' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <input
                type="text"
                {...register('company', { required: 'Empresa é obrigatória' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                disabled={isSubmitting}
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.company.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido',
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                {...register('message', { required: 'Mensagem é obrigatória' })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                disabled={isSubmitting}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>
          {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
              Mensagem enviada com sucesso! Entraremos em contato em breve.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.
            </div>
          )}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}