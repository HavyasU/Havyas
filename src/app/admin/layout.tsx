// ============================================
// Admin Layout — Sidebar & Auth Guard
// ============================================
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Settings,
  FolderKanban,
  MessageSquareQuote,
  Inbox,
  LogOut,
  ChevronRight,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { AuthProvider, useAuth, signOut } from '@/lib/auth';

const sidebarLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/services', icon: Settings, label: 'Services' },
  { href: '/admin/works', icon: FolderKanban, label: 'Projects' },
  { href: '/admin/education', icon: GraduationCap, label: 'Education' },
  { href: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { href: '/admin/testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
  { href: '/admin/inquiries', icon: Inbox, label: 'Inquiries' },
];

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, pathname, router]);

  // Login page doesn't need sidebar layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return <AdminShell>{children}</AdminShell>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex admin-shell">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] border-r border-white/5 flex flex-col shrink-0">
        
        {/* Logo block */}
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex flex-col gap-1">
            <span className="font-display text-xl font-extrabold tracking-tight">Havyas U.</span>
            <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white border-l-2 border-white'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-grow overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8 md:p-12 max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
