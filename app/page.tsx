'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Modak } from 'next/font/google';
import PricingCalendar from '@/components/pricing-calendar';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const modak = Modak({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E36B37]"></div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-white">
          <h1
            className={`text-[#E36B37] text-2xl md:text-[40px] ${modak.className}`}
          >
            Reeka
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline">
                  {session?.user?.name || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[200px]"
            >
              <DropdownMenuItem className="select-none !cursor-default opacity-50">
                <span className="truncate">{}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="min-h-screen bg-white pt-24">
          <div className="container max-w-6xl px-4 py-8 flex flex-col items-center justify-center">
            <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-2xl">
              Update Pricing
            </h1>
            <p className="mb-8 text-sm text-gray-600">
              Update your listing prices by date or range
            </p>
            <PricingCalendar />
          </div>
        </main>
      </>
    );
  }

  return null;
}
