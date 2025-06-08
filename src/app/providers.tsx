'use client';

import { SessionProvider } from 'next-auth/react';
import { DataProvider } from '@/contexts/DataProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DataProvider>
        <div className="h-full flex flex-col">
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </DataProvider>
    </SessionProvider>
  );
}
