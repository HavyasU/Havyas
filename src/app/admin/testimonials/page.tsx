// ============================================
// Admin — Testimonials CRUD
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Save } from 'lucide-react';
import type { Testimonial } from '@/types';
import { subscribeToTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/firestore';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    clientName: '',
    company: '',
    quote: '',
    rating: 5,
    avatarUrl: '',
  });

  useEffect(() => {
    const unsub = subscribeToTestimonials((data) => {
      setTestimonials(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openModal = (test?: Testimonial) => {
    if (test) {
      setEditingTestimonial(test);
      setForm({
        clientName: test.clientName,
        company: test.company,
        quote: test.quote,
        rating: test.rating || 5,
        avatarUrl: test.avatarUrl || '',
      });
    } else {
      setEditingTestimonial(null);
      setForm({
        clientName: '',
        company: '',
        quote: '',
        rating: 5,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random().toString(36).substring(7),
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const testData = {
      clientName: form.clientName,
      company: form.company,
      quote: form.quote,
      rating: Number(form.rating),
      avatarUrl: form.avatarUrl,
    };

    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, testData);
      } else {
        await addTestimonial(testData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Could not save testimonial', err);
      alert('Error saving testimonial.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await deleteTestimonial(id);
    } catch (err) {
      console.error('Could not delete testimonial', err);
      alert('Error deleting testimonial.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold font-display">Manage Testimonials</h1>
          <p className="text-sm text-neutral-400 mt-1">{testimonials.length} reviews configured</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-3 bg-white text-black hover:opacity-90 font-bold text-sm rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {/* Testimonials Table */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/5">
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Client</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs hidden md:table-cell">Company</th>
              <th className="text-left px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs hidden lg:table-cell">Rating</th>
              <th className="text-right px-6 py-4 text-neutral-400 font-semibold uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                </td>
              </tr>
            ) : testimonials.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">
                  No testimonials configured yet. Click &quot;Add Testimonial&quot; to configure one.
                </td>
              </tr>
            ) : (
              testimonials.map((test, idx) => (
                <motion.tr
                  key={test.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-white">{test.clientName}</td>
                  <td className="px-6 py-4 text-neutral-300 hidden md:table-cell">{test.company}</td>
                  <td className="px-6 py-4 text-amber-400 hidden lg:table-cell">
                    {'★'.repeat(test.rating)}{'☆'.repeat(5 - test.rating)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openModal(test)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        title="Edit Testimonial"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-3xl p-6 md:p-8 text-white space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-xl font-bold font-display">
                    {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Client Name</label>
                      <input
                        type="text"
                        required
                        value={form.clientName}
                        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                        placeholder="e.g. Rahul Kamath"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Company / Role</label>
                      <input
                        type="text"
                        required
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="e.g. Swwadishta Foods"
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Rating (1 to 5 Stars)</label>
                      <select
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) || 5 })}
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all text-white [&>option]:bg-[#0F172A]"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Avatar Image URL</label>
                      <input
                        type="text"
                        required
                        value={form.avatarUrl}
                        onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                        placeholder="https://api.dicebear.com/..."
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Client Feedback Quote</label>
                    <textarea
                      required
                      rows={4}
                      value={form.quote}
                      onChange={(e) => setForm({ ...form, quote: e.target.value })}
                      placeholder="Write feedback comments left by client..."
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-white transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:opacity-90 rounded-xl text-sm font-bold transition-all"
                    >
                      <Save className="w-4 h-4" /> {editingTestimonial ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
