'use client';

import AppLayout from '@/layouts/AppLayout';
import SessionDetailPage from '@/features/evaluation/pages/SessionDetailPage';

export default function SessionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AppLayout>
      <SessionDetailPage params={params} />
    </AppLayout>
  );
}
