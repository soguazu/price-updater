'use client';

import { Modak } from 'next/font/google';
import PricingCalendar from '@/components/pricing-calendar';

const modak = Modak({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container max-w-6xl px-4 py-8 flex flex-col items-center justify-center">
        <h1
          className={`${modak.className} text-[#E36B37] text-2xl md:text-[40px]`}
        >
          Reeka
        </h1>
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Pricing Calendar
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Update your listing prices by date or range
        </p>

        <PricingCalendar />
      </div>
    </main>
  );
}
