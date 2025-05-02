"use client";

import Link from 'next/link';
import Image from 'next/image';

import { RocketLaunchIcon, LightBulbIcon, PresentationChartLineIcon, ChartBarIcon, } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between pt-20">
      <header className="w-11/12 mx-auto text-center mb-16">
        <h1 className="text-2xl md:text-[42px] font-extrabold text-gray-900 tracking-tight">
          Alcance seus Objetivos com{' '}
          <span className="text-blue-600">OKR Management</span>
        </h1>

        <p className="mt-4 text-base md:text-xl text-gray-600 leading-relaxed">
          Uma ferramenta intuitiva para alinhar sua equipe, focar em resultados e celebrar o sucesso!
        </p>
      </header>

      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <RocketLaunchIcon className="w-10 h-10 text-blue-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Alinhamento Estratégico</h3>
          <p className="text-gray-600 text-sm">Garanta que todos na organização estejam remando na mesma direção.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <LightBulbIcon className="w-10 h-10 text-yellow-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Foco em Prioridades</h3>
          <p className="text-gray-600 text-sm">Concentre seus esforços nos objetivos que realmente importam.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <ChartBarIcon className="w-10 h-10 text-purple-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Resultados Mensuráveis</h3>
          <p className="text-gray-600 text-sm">Defina metas claras e acompanhe seu progresso com métricas precisas.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <PresentationChartLineIcon className="w-10 h-10 text-green-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Transparência Total</h3>
          <p className="text-gray-600 text-sm">Visualize o progresso de todos os objetivos dentro da sua equipe ou organização.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto text-center mb-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">Comece Agora!</h2>

        <div className="space-x-4">
          <Link
            href="/okrs"
            className="h-12 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md shadow-md transition duration-300"
          >
            Ver OKRs Existentes
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto mt-9 text-center text-gray-700 mb-12 sm:px-6 lg:px-8">
        <div className="w-11/12 max-w-[540px] mx-auto py-0 flex items-start justify-center mb-4 relative">
          <div className='flex justify-center items-center absolute -top-12 left-2'>
            <div className='w-8 min-w-8 h-8 min-h-8 rounded-full'>
              <Image
                className='w-full h-full object-cover rounded-full shadow-md'
                src={'https://avatars.githubusercontent.com/u/61783961?v=4'}
                alt={'Photo'}
                width={100}
                height={100}
              />
            </div>

            <span className='text-lg font-semibold ml-1.5'>Renato</span>
          </div>

          <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-[12px] border-l-transparent border-r-transparent border-b-white"></div>

          <p className="w-full text-lg bg-white px-4 py-6 rounded-xl shadow-md">
            O código fonte completo está disponível no meu <Link href="https://github.com/Renatomrs" className="text-blue-500 hover:underline font-semibold">GitHub</Link>
            . Sinta-se à vontade para explorar!
          </p>
        </div>
      </section>

      <footer className="w-full h-14 flex bg-white text-gray-500 mt-8 shadow-md">
        <div className='w-11/12 mx-auto flex justify-center items-center'>
          <p className='text-sm'>&copy; {new Date().getFullYear()} | Todos os direitos reservados.</p>
        </div>
      </footer>
    </div >
  );
}
