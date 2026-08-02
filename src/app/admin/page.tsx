// ============================================
// Admin Dashboard — Overview & Seeding Tool
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  FolderKanban,
  MessageSquareQuote,
  Inbox,
  TrendingUp,
  Bell,
  ArrowUpRight,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalServices: number;
  totalWorks: number;
  totalExperience: number;
  totalTestimonials: number;
  totalInquiries: number;
  newInquiries: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    totalWorks: 0,
    totalExperience: 0,
    totalTestimonials: 0,
    totalInquiries: 0,
    newInquiries: 0,
  });
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState('/havyasU_Resume.pdf');
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { getDashboardStats } = await import('@/lib/firestore');
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Could not load admin stats", err);
      }
    };
    loadStats();

    let unsubResume: (() => void) | undefined;
    import('@/lib/firestore').then(({ subscribeToResumeUrl }) => {
      unsubResume = subscribeToResumeUrl(setResumeUrl);
    });

    return () => {
      if (unsubResume) unsubResume();
    };
  }, []);

  const handleSeed = async () => {
    if (!confirm('Are you sure you want to seed default mock data into Firestore? This will add missing items to your active collection.')) return;
    setSeeding(true);
    setSeedMessage('');
    try {
      const { seedFirestore } = await import('@/lib/firestore');
      await seedFirestore();
      setSeedMessage('Database seeded successfully! Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setSeedMessage(`Seeding failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const cards = [
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: Settings,
      color: 'from-white/10 to-white/5',
      iconColor: 'text-white',
      href: '/admin/services',
    },
    {
      title: 'Active Projects',
      value: stats.totalWorks,
      icon: FolderKanban,
      color: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-400',
      href: '/admin/works',
    },
    {
      title: 'Experiences',
      value: stats.totalExperience,
      icon: Briefcase,
      color: 'from-amber-500/20 to-amber-600/10',
      iconColor: 'text-amber-400',
      href: '/admin/experience',
    },
    {
      title: 'Testimonials',
      value: stats.totalTestimonials,
      icon: MessageSquareQuote,
      color: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-400',
      href: '/admin/testimonials',
    },
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: Inbox,
      color: 'from-pink-500/20 to-pink-600/10',
      iconColor: 'text-pink-400',
      href: '/admin/inquiries',
      badge: stats.newInquiries > 0 ? `${stats.newInquiries} new` : undefined,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold font-display">Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-1">Overview of your portfolio management metrics</p>
        </div>
        <div className="relative">
          <Bell className="w-6 h-6 text-neutral-400" />
          {stats.newInquiries > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {stats.newInquiries}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              href={card.href}
              className={`block p-6 rounded-3xl bg-gradient-to-br ${card.color} border border-white/5 hover:border-white/10 transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-4">
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                {card.badge && (
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-red-500 text-white rounded-full">
                    {card.badge}
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-4xl font-extrabold text-white mb-1">{card.value}</p>
              <p className="text-xs text-neutral-400">{card.title}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions and Database Utils */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-neutral-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/works"
              className="px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-neutral-300 hover:text-white transition-all border border-white/5 text-center"
            >
              + Add New Project
            </Link>
            <Link
              href="/admin/experience"
              className="px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-neutral-300 hover:text-white transition-all border border-white/5 text-center"
            >
              + Add Experience Timeline
            </Link>
            <Link
              href="/admin/inquiries"
              className="px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-neutral-300 hover:text-white transition-all border border-white/5 text-center"
            >
              Review Direct Inquiries
            </Link>
          </div>
        </div>

        {/* Dynamic Resume Management Card */}
        <div className="border-t border-white/5 pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-file-pdf text-amber-400"></i> Dynamic Resume Management
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Upload a new PDF resume or update your Download CV link on the live homepage.
              </p>
            </div>
            <label className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer transition-all border border-white/10 inline-flex items-center gap-2 self-start sm:self-auto">
              <i className="fa-solid fa-cloud-arrow-up"></i> {uploadingResume ? 'Uploading PDF...' : 'Upload New PDF'}
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                className="hidden"
                disabled={uploadingResume}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingResume(true);
                  try {
                    const { uploadToCloudinary } = await import('@/lib/cloudinary');
                    const { updateResumeUrl } = await import('@/lib/firestore');
                    const url = await uploadToCloudinary(file);
                    setResumeUrl(url);
                    await updateResumeUrl(url);
                    alert('Resume PDF uploaded and saved live!');
                  } catch (err: any) {
                    console.error('Resume upload failed', err);
                    alert('Upload failed: ' + err.message);
                  } finally {
                    setUploadingResume(false);
                  }
                }}
              />
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="e.g. /havyasU_Resume.pdf or Cloudinary URL"
              className="flex-grow px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white focus:outline-none focus:border-white transition-all font-mono"
            />
            <button
              onClick={async () => {
                if (!resumeUrl) return;
                try {
                  const { updateResumeUrl } = await import('@/lib/firestore');
                  await updateResumeUrl(resumeUrl);
                  alert('Resume URL updated successfully!');
                } catch (err) {
                  console.error(err);
                  alert('Could not update resume URL.');
                }
              }}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/10"
            >
              Save URL
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-base font-bold text-white">Database Seed Tool</h3>
            <p className="text-xs text-neutral-400">Initialize your live Firebase Firestore backend with default mockup portfolio data.</p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-black hover:opacity-90 active:scale-95 text-sm font-bold transition-all disabled:opacity-50"
          >
            {seeding ? 'Seeding Backend...' : 'Seed Sample Data'}
          </button>
        </div>

        {seedMessage && (
          <p className="text-xs text-neutral-300 text-center sm:text-left font-medium">{seedMessage}</p>
        )}
      </div>
    </div>
  );
}
