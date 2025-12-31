'use client';

import { Suspense } from 'react';
import AppLayout from '@/layouts/AppLayout';
import FormSubmissionPage from '@/features/form-submission/pages/FormSubmissionPage';

export default function FormSubmission() {
  return (
    <AppLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <FormSubmissionPage />
      </Suspense>
    </AppLayout>
  );
}
