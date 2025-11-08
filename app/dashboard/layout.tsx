import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get user from session (add after auth is set up)
  const user = {
    firstName: 'Sarah',
    lastName: 'Manager',
    email: 'sarah@nordmatch.com',
    role: 'HR Manager',
  };

  // If no user, redirect to login
  // if (!user) redirect('/signin');

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}