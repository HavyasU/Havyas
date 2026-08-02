// ============================================
// Project Details / Case Study Page
// ============================================
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, User, Compass, Server } from 'lucide-react';
import { subscribeToWork } from '@/lib/firestore';
import type { Work } from '@/types';
import PageTransition from '@/components/motion/PageTransition';

// Custom lightweight Markdown-to-JSX compiler to render case studies
function renderMarkdown(mdText: string) {
  if (!mdText) return null;
  const lines = mdText.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('###')) {
      return (
        <h4 key={idx} className="text-xl font-bold text-text-primary mt-6 mb-3 tracking-tight">
          {trimmed.replace(/^###\s*/, '')}
        </h4>
      );
    }
    if (trimmed.startsWith('##')) {
      return (
        <h3 key={idx} className="text-2xl font-extrabold text-text-primary mt-8 mb-4 tracking-tight border-b border-border-color pb-2">
          {trimmed.replace(/^##\s*/, '')}
        </h3>
      );
    }
    if (trimmed.startsWith('#')) {
      return (
        <h2 key={idx} className="text-3xl font-extrabold text-text-primary mt-10 mb-6 tracking-tight">
          {trimmed.replace(/^#\s*/, '')}
        </h2>
      );
    }
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      return (
        <ul key={idx} className="list-disc pl-6 space-y-1.5 text-sm text-text-secondary my-2">
          <li>{trimmed.replace(/^[-*]\s*/, '')}</li>
        </ul>
      );
    }
    if (trimmed === '') {
      return <div key={idx} className="h-2" />;
    }
    return (
      <p key={idx} className="text-base text-text-secondary leading-relaxed my-3">
        {line}
      </p>
    );
  });
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToWork(id, (data) => {
      if (data) {
        setWork(data);
      } else {
        setWork(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-text-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <p className="text-text-secondary text-sm">The project you are looking for does not exist or has been deleted.</p>
        <Link href="/" className="px-6 py-2.5 bg-text-primary text-bg-body text-xs font-bold rounded-full">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-text-secondary px-3 py-1.5 rounded-full bg-bg-section-alt border border-border-color">
              {work.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
              {work.title}
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              {work.description}
            </p>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border-color">
            <img
              src={work.coverImageUrl || '/images/connectimage.png'}
              alt={work.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-border-color pt-12">
          
          {/* Left Column: Case Study */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-6">Case Study & Experience</h2>
              {work.caseStudy ? (
                <div className="prose dark:prose-invert max-w-none">
                  {renderMarkdown(work.caseStudy)}
                </div>
              ) : (
                <p className="text-text-secondary italic text-sm">
                  No case study has been written for this project yet. Edit it via the admin panel to add one.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar Specs */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 md:p-8 rounded-3xl border border-border-color bg-bg-section-alt space-y-6">
              <h3 className="text-lg font-bold border-b border-border-color pb-3">Project Specs</h3>
              
              <div className="space-y-4 text-sm">
                {/* Client */}
                <div className="flex items-center gap-3 text-text-secondary">
                  <User className="w-[18px] h-[18px]" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted">Client</p>
                    <p className="font-semibold text-text-primary">{work.client}</p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-3 text-text-secondary">
                  <Compass className="w-[18px] h-[18px]" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted">Category</p>
                    <p className="font-semibold text-text-primary">{work.category}</p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex items-start gap-3 text-text-secondary">
                  <Server className="w-[18px] h-[18px] mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted">Technologies</p>
                    <p className="font-semibold text-text-primary mt-1">{work.specs}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="border-t border-border-color pt-6 space-y-3">
                <p className="text-[10px] uppercase font-bold text-text-muted">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {work.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold text-text-secondary px-2.5 py-1 bg-bg-body border border-border-color rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
