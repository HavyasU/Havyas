// ============================================
// Admin — Inquiries Management Page
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Loader2, Mail, MessageCircle, AlertCircle } from 'lucide-react';
import type { Inquiry } from '@/types';
import { subscribeToInquiries, updateInquiryStatus, deleteInquiry } from '@/lib/firestore';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToInquiries((data) => {
      setInquiries(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (id: string, status: Inquiry['status']) => {
    try {
      await updateInquiryStatus(id, status);
    } catch (err) {
      console.error('Could not update status', err);
      alert('Error updating status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;
    try {
      await deleteInquiry(id);
    } catch (err) {
      console.error('Could not delete inquiry', err);
      alert('Error deleting submission.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold font-display">User Inquiries</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {inquiries.filter((i) => i.status === 'new').length} new message submissions
          </p>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/5">
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Date</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Name</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Contact Details</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Message</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Status</th>
              <th className="text-right px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                  No message submissions received yet.
                </td>
              </tr>
            ) : (
              inquiries.map((inq, idx) => {
                const dateText = inq.createdAt 
                  ? new Date(inq.createdAt).toLocaleDateString()
                  : 'N/A';

                return (
                  <motion.tr
                    key={inq.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/[0.01] transition-colors align-top"
                  >
                    <td className="px-6 py-4 text-neutral-400 whitespace-nowrap text-xs">
                      {dateText}
                    </td>
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                      {inq.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-neutral-300 gap-1 text-xs">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-neutral-500" />
                          {inq.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300 text-xs max-w-xs break-words whitespace-pre-wrap">
                      {inq.message}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value as Inquiry['status'])}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all [&>option]:bg-[#0F172A] ${
                          inq.status === 'new'
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            : inq.status === 'contacted'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-green-500/10 border-green-500/20 text-green-400'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
