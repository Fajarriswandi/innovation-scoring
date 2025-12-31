'use client';

import AppLayout from '@/layouts/AppLayout';
import DetailPage from '@/features/detail/pages/DetailPage';
import { use } from 'react';

export default function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: _id } = use(params);
  
  return (
    <AppLayout>
      <DetailPage />
    </AppLayout>
  );
}

