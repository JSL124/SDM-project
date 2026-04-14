import { Suspense } from 'react';
import ManageUsersPage from '@/feature/manage-users/boundary/ManageUsersPage';

export default function AdminManageUsersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={null}>
        <ManageUsersPage />
      </Suspense>
    </main>
  );
}
