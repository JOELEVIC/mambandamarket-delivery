'use client';

import React from 'react';
import { PageHeader } from '@/components/ui';
import RiderJobs from '@/components/RiderJobs';

export default function RidePage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="My deliveries" subtitle="The Mambanda Delivery app does all this and works offline; this page is the web fallback." />
      <RiderJobs />
    </div>
  );
}
