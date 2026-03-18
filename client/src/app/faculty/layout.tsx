"use client";
import Navbar from '@/components/Navbar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    // Since we have a public landing page, let's wrap other public pages with Navbar automatically if we want, 
    // but simpler to just include Navbar in the pages themselves or use a group layout.
    // For now, I'm manually adding Navbar to pages or assumes they are standalone.
    // Actually, standard Next.js approach is having layout for the group. 
    // But root layout handles global styles.

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
                {children}
            </div>
        </div>
    );
}
