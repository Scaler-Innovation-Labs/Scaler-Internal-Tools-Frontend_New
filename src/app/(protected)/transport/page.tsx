'use client';

import { useEffect } from 'react';
import { format } from "date-fns";
import { redirect } from 'next/navigation';

export default function TransportPage() {
  useEffect(() => {
    // Redirect to today's date
    const today = new Date();
    const todayFormatted = format(today, 'yyyy-MM-dd');
    redirect(`/transport/${todayFormatted}`);
  }, []);

  // This will never render due to redirect, but required for TypeScript
  return null;
}
