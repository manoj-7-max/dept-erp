"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function FacultyEntry() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && (user.role === 'faculty' || user.role === 'class_incharge')) {
        router.replace('/dashboard/faculty');
      } else {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-xl">Redirecting to Faculty Portal...</div>;
}
