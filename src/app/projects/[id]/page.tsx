"use client";

// ============================================
// Project Details / Case Study Page
// ============================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  User,
  Compass,
  Server,
} from "lucide-react";
import { subscribeToWork } from "@/lib/firestore";
import type { Work } from "@/types";
import PageTransition from "@/components/motion/PageTransition";

// ============================================
// Enhanced Markdown-to-JSX compiler
// Supports: Tables, Links, Bold/Italic (with typo tolerance),
// Dividers, Blockquotes, Grouped Lists, and Inline Code
// ============================================

function parseTableRow(line: string): string[] {
  const trimmed = line.trim();
  const content = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return content.split("|").map((c) => c.trim());
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  return /^\|?(\s*:?-+:?\s*\|?)+$/.test(trimmed) && trimmed.includes("-");
}

function isTableLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 2;
}

function renderInline(text: string): React.ReactNode[] {
  // Tokenize links, inline code, bold (including loose syntax like *Text:**), and italics
  const tokenRegex =
    /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*{1,2}[^*]+?\*{1,2}|_[^_]+?_)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link: [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary font-semibold underline underline-offset-4 decoration-border-color hover:decoration-text-primary transition-colors inline-flex items-center gap-1"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Inline Code: `code`
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-bg-section-alt border border-border-color text-xs font-mono text-text-primary"
        >
          {codeMatch[1]}
        </code>
      );
    }

    // Bold: **text** OR tolerant *text:** or **text*
    const boldMatch = part.match(/^(\*{1,2})([^*]+?)(\*{1,2})$/);
    if (boldMatch) {
      // If it has at least 2 asterisks total or starts/ends with 2
      if (boldMatch[1].length === 2 || boldMatch[3].length === 2) {
        return (
          <strong key={index} className="font-bold text-text-primary">
            {boldMatch[2]}
          </strong>
        );
      }
      // Single asterisk italic
      return (
        <em key={index} className="italic text-text-primary">
          {boldMatch[2]}
        </em>
      );
    }

    // Italic with underscores: _text_
    const underscoreMatch = part.match(/^_([^_]+?)_$/);
    if (underscoreMatch) {
      return (
        <em key={index} className="italic text-text-primary">
          {underscoreMatch[1]}
        </em>
      );
    }

    return part;
  });
}

function renderMarkdown(mdText: string) {
  if (!mdText) return null;

  const rawLines = mdText.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Empty line
    if (trimmed === "") {
      elements.push(<div key={`empty-${i}`} className="h-3" />);
      i++;
      continue;
    }

    // 2. Horizontal divider (---, ***, ___ or tolerant --)
    if (/^(-{2,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(
        <hr key={`hr-${i}`} className="my-8 border-t border-border-color" />,
      );
      i++;
      continue;
    }

    // 3. Headings
    if (trimmed.startsWith("####")) {
      elements.push(
        <h5
          key={`h4-${i}`}
          className="text-lg font-bold text-text-primary mt-6 mb-3 tracking-tight"
        >
          {renderInline(trimmed.replace(/^####\s*/, ""))}
        </h5>,
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("###")) {
      elements.push(
        <h4
          key={`h3-${i}`}
          className="text-xl font-bold text-text-primary mt-8 mb-3 tracking-tight"
        >
          {renderInline(trimmed.replace(/^###\s*/, ""))}
        </h4>,
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("##")) {
      elements.push(
        <h3
          key={`h2-${i}`}
          className="text-2xl font-extrabold text-text-primary mt-10 mb-4 tracking-tight border-b border-border-color pb-2"
        >
          {renderInline(trimmed.replace(/^##\s*/, ""))}
        </h3>,
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("#")) {
      elements.push(
        <h2
          key={`h1-${i}`}
          className="text-3xl font-extrabold text-text-primary mt-12 mb-6 tracking-tight"
        >
          {renderInline(trimmed.replace(/^#\s*/, ""))}
        </h2>,
      );
      i++;
      continue;
    }

    // 4. Blockquotes
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith(">")) {
        quoteLines.push(rawLines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 border-text-primary pl-4 py-1.5 my-4 text-text-secondary italic bg-bg-section-alt/30 rounded-r-xl"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx} className="my-1 leading-relaxed">
              {renderInline(ql)}
            </p>
          ))}
        </blockquote>,
      );
      continue;
    }

    // 5. Code block
    if (trimmed.startsWith("```")) {
      const lang = trimmed.replace(/^```/, "").trim();
      i++;
      const codeLines: string[] = [];
      while (i < rawLines.length && !rawLines[i].trim().startsWith("```")) {
        codeLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length) i++; // consume closing fence
      elements.push(
        <div
          key={`codeblock-${i}`}
          className="my-6 rounded-2xl overflow-hidden border border-border-color bg-bg-section-alt"
        >
          {lang && (
            <div className="px-4 py-2 border-b border-border-color text-xs font-mono text-text-muted uppercase">
              {lang}
            </div>
          )}
          <pre className="p-4 text-xs md:text-sm font-mono overflow-x-auto text-text-primary">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>,
      );
      continue;
    }

    // 6. Tables
    if (isTableLine(line)) {
      const tableLines: string[] = [];
      while (i < rawLines.length && isTableLine(rawLines[i])) {
        tableLines.push(rawLines[i]);
        i++;
      }

      if (tableLines.length >= 1) {
        const rawHeader = tableLines[0];
        const headers = parseTableRow(rawHeader);
        let rowStartIndex = 1;

        if (tableLines.length > 1 && isTableSeparator(tableLines[1])) {
          rowStartIndex = 2;
        }

        const rows = tableLines.slice(rowStartIndex).map(parseTableRow);

        elements.push(
          <div
            key={`table-${i}`}
            className="overflow-x-auto my-6 rounded-2xl border border-border-color bg-bg-section-alt/50 shadow-sm"
          >
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-bg-section-alt border-b border-border-color">
                <tr>
                  {headers.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="py-3.5 px-4 font-bold text-text-primary uppercase tracking-wider text-xs"
                    >
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-bg-section-alt transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="py-3 px-4 text-text-secondary leading-relaxed"
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
        continue;
      }
    }

    // 7. Unordered Lists (- or * or +)
    if (/^[-*+]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < rawLines.length && /^[-*+]\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      elements.push(
        <ul
          key={`ul-${i}`}
          className="list-disc pl-6 space-y-2 text-sm md:text-base text-text-secondary my-4"
        >
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // 8. Ordered Lists (1. 2. etc.)
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < rawLines.length && /^\d+\.\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      elements.push(
        <ol
          key={`ol-${i}`}
          className="list-decimal pl-6 space-y-2 text-sm md:text-base text-text-secondary my-4"
        >
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // 9. Regular Paragraph
    elements.push(
      <p
        key={`p-${i}`}
        className="text-base text-text-secondary leading-relaxed my-3"
      >
        {renderInline(trimmed)}
      </p>,
    );
    i++;
  }

  return elements;
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
        <p className="text-text-secondary text-sm">
          The project you are looking for does not exist or has been deleted.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-text-primary text-bg-body text-xs font-bold rounded-full"
        >
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
              src={work.coverImageUrl || "/images/connectimage.png"}
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
              <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-6">
                Case Study & Experience
              </h2>
              {work.caseStudy ? (
                <div className="prose dark:prose-invert max-w-none">
                  {renderMarkdown(work.caseStudy)}
                </div>
              ) : (
                <p className="text-text-secondary italic text-sm">
                  No case study has been written for this project yet. Edit it
                  via the admin panel to add one.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar Specs */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 md:p-8 rounded-3xl border border-border-color bg-bg-section-alt space-y-6">
              <h3 className="text-lg font-bold border-b border-border-color pb-3">
                Project Specs
              </h3>

              <div className="space-y-4 text-sm">
                {/* Client */}
                <div className="flex items-center gap-3 text-text-secondary">
                  <User className="w-[18px] h-[18px]" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted">
                      Client
                    </p>
                    <p className="font-semibold text-text-primary">
                      {work.client}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-3 text-text-secondary">
                  <Compass className="w-[18px] h-[18px]" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted">
                      Category
                    </p>
                    <p className="font-semibold text-text-primary">
                      {work.category}
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex items-start gap-3 text-text-secondary">
                  <Server className="w-[18px] h-[18px] mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted">
                      Technologies
                    </p>
                    <p className="font-semibold text-text-primary mt-1">
                      {work.specs}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="border-t border-border-color pt-6 space-y-3">
                <p className="text-[10px] uppercase font-bold text-text-muted">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold text-text-secondary px-2.5 py-1 bg-bg-body border border-border-color rounded-full"
                    >
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
