"use client";
import '@/student-portal/index.css';
import ERPAssistant from '@/components/ERPAssistant';

export default function StudentLayout({ children }) {
  return (
    <div id="root">
      {children}
      <ERPAssistant />
    </div>
  );
}
