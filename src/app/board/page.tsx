"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Download, Plus, Trash2, ZoomIn, ZoomOut, Maximize,
  ChevronUp, ChevronDown, GripVertical, Eye, EyeOff,
  RefreshCw, BarChart2,
} from "lucide-react";
import InvoicePDF, { InvoiceItem } from "./components/InvoicePDF";
import MoUPDF from "./components/MoUPDF";
import RichTextEditor from "./components/RichTextEditor";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabaseClient";
import "./board.css";

// ─── Types ────────────────────────────────────────────────

type ActiveTab = "responses" | "invoice" | "mou";

type FormResponse = {
  id?: number;
  client_name: string;
  event_name: string;
  question01_sliders: number;
  question02_sliders: number;
  question03_sliders: number;
  testimonial: string | null;
};

type Clause = {
  id: string;
  title: string;
  content: string;
  hidden?: boolean;
};

// ─── SortableArticle ─────────────────────────────────────

interface SortableArticleProps {
  clause: Clause;
  index: number;
  isAuto: boolean;
  updateClause: (id: string, field: "title" | "content" | "hidden", value: string | boolean) => void;
  removeClause: (id: string) => void;
  moveClause: (index: number, direction: "up" | "down") => void;
  clausesCount: number;
  providerResponsibilities?: string[];
  setProviderResponsibilities?: (val: string[]) => void;
  clientResponsibilities?: string[];
  setClientResponsibilities?: (val: string[]) => void;
}

function SortableArticle({
  clause, index, isAuto, updateClause, removeClause, moveClause, clausesCount,
  providerResponsibilities, setProviderResponsibilities,
  clientResponsibilities, setClientResponsibilities,
}: SortableArticleProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: clause.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`board-article-card ${isDragging ? "is-dragging" : ""} ${clause.hidden ? "is-hidden" : ""}`}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            {...attributes}
            {...listeners}
            style={{ cursor: "grab", color: "#cbd5e1", padding: "0.375rem", flexShrink: 0 }}
          >
            <GripVertical size={18} />
          </div>
          <div className="board-article-num">{index + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="text"
                value={clause.title}
                onChange={(e) => updateClause(clause.id, "title", e.target.value)}
                placeholder="Article Title..."
                readOnly={isAuto}
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: clause.hidden ? "#94a3b8" : "#1e3a8a",
                  textDecoration: clause.hidden ? "line-through" : "none",
                  width: "100%",
                  fontFamily: "inherit",
                  cursor: isAuto ? "default" : undefined,
                }}
              />
              <div className="board-article-actions">
                <button
                  onClick={() => updateClause(clause.id, "hidden", !clause.hidden)}
                  className="board-btn-danger-ghost"
                  title={clause.hidden ? "Show Article" : "Hide Article"}
                  style={{ color: clause.hidden ? "#3b82f6" : undefined }}
                >
                  {clause.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {isAuto && <span className="board-auto-badge">AUTO-SYNC</span>}
                <div className="board-reorder-group">
                  <button className="board-reorder-btn" onClick={() => moveClause(index, "up")} disabled={index === 0} title="Move Up">
                    <ChevronUp size={15} />
                  </button>
                  <button className="board-reorder-btn" onClick={() => moveClause(index, "down")} disabled={index === clausesCount - 1} title="Move Down">
                    <ChevronDown size={15} />
                  </button>
                </div>
                <button className="board-btn-danger-ghost" onClick={() => removeClause(clause.id)} title="Delete Article">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ paddingLeft: "3.5rem" }}>
          {clause.title === "Roles and Responsibility" &&
          providerResponsibilities &&
          setProviderResponsibilities &&
          clientResponsibilities &&
          setClientResponsibilities ? (
            <div className="board-parties-grid" style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "14px", border: "1px solid #f1f5f9" }}>
              {[
                { label: "Provider Responsibilities", items: providerResponsibilities, setItems: setProviderResponsibilities, color: "#3b82f6" },
                { label: "Client Responsibilities", items: clientResponsibilities, setItems: setClientResponsibilities, color: "#a855f7" },
              ].map(({ label, items, setItems, color }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 900, color, textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <span style={{ width: "6px", height: "6px", background: color, borderRadius: "50%", display: "inline-block" }} />
                    {label}
                  </p>
                  {items.map((point, pIdx) => (
                    <div key={pIdx} style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        className="board-input"
                        style={{ fontSize: "0.8125rem", padding: "0.4rem 0.75rem", height: "2.25rem" }}
                        value={point}
                        onChange={(e) => {
                          const n = [...items]; n[pIdx] = e.target.value; setItems(n);
                        }}
                        placeholder="Define responsibility..."
                      />
                      <button className="board-btn-danger-ghost" onClick={() => setItems(items.filter((_, i) => i !== pIdx))}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button className="board-btn-ghost" style={{ fontSize: "0.7rem", color, alignSelf: "flex-start" }} onClick={() => setItems([...items, ""])}>
                    <Plus size={11} /> ADD
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <RichTextEditor
              content={clause.content}
              onChange={(val) => updateClause(clause.id, "content", val)}
              readOnly={isAuto}
              placeholder="Write article content here..."
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Board Page ──────────────────────────────────────

export default function BoardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("responses");

  // ── Invoice State ──
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", name: "", description: "", rate: 0, quantity: 1 },
  ]);
  const [bankAccount, setBankAccount] = useState("");
  const [bankUser, setBankUser] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage");

  // ── MoU State ──
  const [mouMode, setMouMode] = useState<"guided" | "manual">("guided");
  const [mouNumber, setMouNumber] = useState("");
  const [mouDate, setMouDate] = useState(() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  });
  const [manualContent, setManualContent] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [depositPercentage, setDepositPercentage] = useState(50);
  const [terminationDays, setTerminationDays] = useState(30);
  const [providerResponsibilities, setProviderResponsibilities] = useState<string[]>([
    "Menyediakan layanan live streaming sesuai paket yang disepakati",
    "Menyiapkan dan menguji peralatan (kamera, audio, dan encoder) sebelum acara dimulai",
    "Memastikan kualitas siaran yang optimal selama acara berlangsung",
  ]);
  const [clientResponsibilities, setClientResponsibilities] = useState<string[]>([
    "Menyediakan koneksi internet cadangan di lokasi acara (opsional jika tidak menggunakan paket Solustream)",
    "Menyediakan rundown acara dan aset visual (logo, bumper, overlay) tepat waktu",
    "Melakukan pembayaran sesuai dengan termin yang telah disepakati",
  ]);
  const [partyA, setPartyA] = useState({ name: "Solustream Digital", representative: "Daffa Yordan", position: "Chief Executive Officer" });
  const [partyB, setPartyB] = useState({ name: "", representative: "", position: "" });
  const [clauses, setClauses] = useState<Clause[]>([
    { id: "clause-1", title: "Maksud dan Tujuan", content: `Perjanjian ini bertujuan untuk menetapkan ketentuan kerja sama antara Pihak Pertama dan Pihak Kedua untuk layanan live streaming pada [Nama Acara], guna memastikan pemahaman yang jelas tentang ruang lingkup dan tujuan pekerjaan.`, hidden: false },
    { id: "clause-2", title: "Peran dan Tanggung Jawab", content: "", hidden: false },
    { id: "clause-3", title: "Ketentuan Finansial dan Jadwal Pembayaran", content: "", hidden: false },
    { id: "clause-4", title: "Kebijakan Keterlambatan Pembayaran", content: "Jika pembayaran pelunasan tidak diterima melewati batas waktu yang ditentukan, akan dikenakan denda keterlambatan sebesar 5% per minggu. Master file rekaman dan aset final hanya akan diserahkan kepada klien setelah pelunasan diselesaikan.", hidden: false },
    { id: "clause-5", title: "Jangka Waktu dan Penghentian Perjanjian", content: `Perjanjian ini berlaku sejak tanggal ditandatangani hingga seluruh rangkaian acara dan kewajiban diselesaikan. Salah satu pihak dapat mengakhiri perjanjian ini dengan pemberitahuan tertulis selambat-lambatnya 30 hari sebelumnya jika pihak lain gagal memenuhi tanggung jawabnya.`, hidden: false },
  ]);

  // ── Shared Preview State ──
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [userZoom, setUserZoom] = useState(1);

  // ── Form Responses State ──
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);

  // ── Computed Values ──
  const subtotal = items.reduce((sum, item) => sum + item.rate * item.quantity, 0);
  const discountAmount = discountType === "percentage" ? (subtotal * discountValue) / 100 : discountValue;
  const grandTotal = subtotal - discountAmount;

  const today = new Date();
  const formatDate = (date: Date) => `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  const dueDateObj = new Date(today);
  dueDateObj.setDate(today.getDate() + 4);
  const invoiceDueDate = formatDate(dueDateObj);

  // ── Auto-sync clauses ──
  useEffect(() => {
    setClauses((prev) =>
      prev.map((clause) => {
        if (clause.title === "Ketentuan Finansial dan Jadwal Pembayaran") {
          const depositAmount = (grandTotal * depositPercentage) / 100;
          const finalAmount = grandTotal - depositAmount;
          const discountText = discountAmount > 0
            ? `Subtotal: Rp${subtotal.toLocaleString("id-ID")}\nDiskon: ${discountType === "percentage" ? `${discountValue}%` : `Rp${discountValue.toLocaleString("id-ID")}`} (-Rp${discountAmount.toLocaleString("id-ID")})\n`
            : "";
          return { ...clause, content: `${discountText}Total Biaya Proyek: Rp${grandTotal.toLocaleString("id-ID")}\n\n1. Uang Muka (DP): ${depositPercentage}% (Rp${depositAmount.toLocaleString("id-ID")})\n2. Pelunasan: ${100 - depositPercentage}% (Rp${finalAmount.toLocaleString("id-ID")})\n\nPelunasan paling lambat pada tanggal ${invoiceDueDate}.` };
        }
        if (clause.title === "Peran dan Tanggung Jawab") {
          return { ...clause, content: `Tanggung Jawab Pihak Pertama (Solustream):\n${providerResponsibilities.map((p) => `- ${p}`).join("\n")}\n\nTanggung Jawab Pihak Kedua (Klien):\n${clientResponsibilities.map((p) => `- ${p}`).join("\n")}` };
        }
        if (clause.title === "Jangka Waktu dan Penghentian Perjanjian") {
          return { ...clause, content: `Perjanjian ini berlaku sejak tanggal ditandatangani hingga seluruh rangkaian acara dan kewajiban diselesaikan. Salah satu pihak dapat mengakhiri perjanjian ini dengan pemberitahuan tertulis selambat-lambatnya ${terminationDays} hari sebelumnya jika pihak lain gagal memenuhi tanggung jawabnya.` };
        }
        if (clause.title === "Maksud dan Tujuan") {
          return { ...clause, content: `Perjanjian ini bertujuan untuk menetapkan ketentuan kerja sama antara Pihak Pertama dan Pihak Kedua untuk layanan live streaming pada acara ${projectTitle || "[Nama Acara]"}, guna memastikan pemahaman yang jelas tentang ruang lingkup dan tujuan pekerjaan.` };
        }
        return clause;
      })
    );
  }, [grandTotal, subtotal, discountAmount, discountValue, discountType, depositPercentage, invoiceDueDate, terminationDays, projectTitle, providerResponsibilities, clientResponsibilities]);

  // ── Fetch responses ──
  const fetchResponses = useCallback(async () => {
    setLoadingResponses(true);
    try {
      const { data, error } = await supabase
        .from("SatisfactionForms")
        .select("*");
      if (!error && data) setResponses(data as FormResponse[]);
      else if (error) console.error("Fetch error:", error.message);
    } finally {
      setLoadingResponses(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "responses") fetchResponses();
  }, [activeTab, fetchResponses]);

  // ── PDF Preview scale ──
  useEffect(() => {
    const container = document.getElementById("board-pdf-scroll");
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setPreviewScale(Math.max(0.2, (width - 64) / 794));
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [activeTab]);

  // ── Item helpers ──
  const addItem = () => setItems([...items, { id: Math.random().toString(36).slice(2), name: "", description: "", rate: 0, quantity: 1 }]);
  const removeItem = (id: string) => { if (items.length > 1) setItems(items.filter((i) => i.id !== id)); };
  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) =>
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  // ── Clause helpers ──
  const addClause = () => setClauses([...clauses, { id: Math.random().toString(36).slice(2), title: "New Article", content: "" }]);
  const updateClause = (id: string, field: "title" | "content" | "hidden", value: string | boolean) =>
    setClauses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  const removeClause = (id: string) => { if (clauses.length > 1) setClauses(clauses.filter((c) => c.id !== id)); };
  const moveClause = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === clauses.length - 1)) return;
    const next = [...clauses];
    const target = direction === "up" ? index - 1 : index + 1;
    [next[index], next[target]] = [next[target], next[index]];
    setClauses(next);
  };

  // ── DnD ──
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setClauses((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ── Download PDF ──
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const container = document.getElementById("board-invoice-pdf-container");
      if (container) {
        const { toPng } = await import("html-to-image");
        const { jsPDF } = await import("jspdf");
        const pages = Array.from(container.querySelectorAll(".pdf-page-canvas")) as HTMLElement[];
        const fileName = activeTab === "invoice"
          ? `Invoice_${invoiceNumber || "SOLU26-027"}.pdf`
          : `MoU_${mouNumber || "MOU-2026-001"}.pdf`;
        const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
        for (let i = 0; i < pages.length; i++) {
          const dataUrl = await toPng(pages[i], { quality: 1, pixelRatio: 2, cacheBust: true });
          if (i > 0) pdf.addPage();
          pdf.addImage(dataUrl, "PNG", 0, 0, 595.28, 841.89, undefined, "FAST");
        }
        pdf.save(fileName);
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Score helper ──
  const scoreClass = (v: number) => (v >= 70 ? "high" : v >= 40 ? "mid" : "low");

  // ─────────────────────────────────────────────────────────
  return (
    <div className="board-root">
      {/* Navbar */}
      <nav className="board-navbar">
        <div className="board-navbar-left">
          <Image src="/Assets/solustream_logo.png" alt="Solustream" width={120} height={32} style={{ objectFit: "contain" }} unoptimized />
          <div className="board-tabs">
            {(["responses", "invoice", "mou"] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                className={`board-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "responses" ? "Form Responses" : tab === "invoice" ? "Invoice" : "MoU"}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Tab: Form Responses ── */}
      {activeTab === "responses" && (
        <main className="board-main">
          <div className="board-card">
            <div className="board-responses-header">
              <div>
                <h1 className="board-section-title" style={{ margin: 0 }}>Satisfaction Form Responses</h1>
                <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                  {responses.length} response{responses.length !== 1 ? "s" : ""} collected
                </p>
              </div>
              <button className="board-btn-ghost" onClick={fetchResponses} disabled={loadingResponses}>
                <RefreshCw size={14} className={loadingResponses ? "board-spinner" : ""} />
                {loadingResponses ? "Loading..." : "Refresh"}
              </button>
            </div>

            {loadingResponses ? (
              <div className="board-empty-state">
                <div className="board-spinner" style={{ margin: "0 auto 0.75rem" }} />
                <p>Fetching responses...</p>
              </div>
            ) : responses.length === 0 ? (
              <div className="board-empty-state">
                <BarChart2 size={36} style={{ color: "#e2e8f0", margin: "0 auto 0.5rem" }} />
                <p style={{ fontWeight: 700, color: "#cbd5e1" }}>No responses yet</p>
                <p>Satisfaction form submissions will appear here.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="board-responses-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name / Company</th>
                      <th>Event</th>
                      <th>Streaming Quality</th>
                      <th>Tech Readiness</th>
                      <th>Platform Ease</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((r, i) => (
                      <tr key={r.id || i}>
                        <td style={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem" }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{r.client_name || "—"}</td>
                        <td style={{ color: "#64748b" }}>{r.event_name || "—"}</td>
                        <td>
                          <span className={`board-score-pill ${scoreClass(r.question01_sliders)}`}>
                            {r.question01_sliders}%
                          </span>
                        </td>
                        <td>
                          <span className={`board-score-pill ${scoreClass(r.question02_sliders)}`}>
                            {r.question02_sliders}%
                          </span>
                        </td>
                        <td>
                          <span className={`board-score-pill ${scoreClass(r.question03_sliders)}`}>
                            {r.question03_sliders}%
                          </span>
                        </td>
                        <td style={{ maxWidth: "200px", color: "#64748b", fontSize: "0.8rem" }}>
                          {r.testimonial ? (
                            <span title={r.testimonial} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {r.testimonial}
                            </span>
                          ) : <span style={{ color: "#cbd5e1" }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ── Tab: Invoice / MoU Builder ── */}
      {(activeTab === "invoice" || activeTab === "mou") && (
        <main className="board-main">
          <div className="board-content-split">
            {/* Left: Form */}
            <div className="board-form-col">

              {/* ─── INVOICE FORMS ─── */}
              {activeTab === "invoice" && (
                <>
                  {/* Invoice & Client Info */}
                  <div className="board-card">
                    <h2 className="board-section-title">Invoice Details</h2>
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="board-label">Invoice Number</label>
                      <input className="board-input" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="SOLU26-XXX" />
                    </div>
                    <div className="board-divider" />
                    <div className="board-grid-2">
                      <div>
                        <label className="board-label">Client Name</label>
                        <input className="board-input" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Raka Sanjaya" />
                      </div>
                      <div>
                        <label className="board-label">Client Phone</label>
                        <input className="board-input" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+62 (555) 000-0000" />
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="board-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                      <h2 className="board-section-title" style={{ margin: 0 }}>Purchased Items</h2>
                      <button className="board-btn-ghost" onClick={addItem}>
                        <Plus size={15} /> Add Item
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {items.map((item) => (
                        <div key={item.id} className="board-item-row">
                          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.2fr 0.7fr auto", gap: "0.75rem", alignItems: "end" }}>
                            <div>
                              <label className="board-label" style={{ fontSize: "0.7rem" }}>Item Name</label>
                              <input className="board-input" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="Service / Product" />
                            </div>
                            <div>
                              <label className="board-label" style={{ fontSize: "0.7rem" }}>Description</label>
                              <input className="board-input" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} placeholder="Brief details" />
                            </div>
                            <div>
                              <label className="board-label" style={{ fontSize: "0.7rem" }}>Rate (Rp)</label>
                              <input className="board-input" type="number" value={item.rate || ""} onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)} />
                            </div>
                            <div>
                              <label className="board-label" style={{ fontSize: "0.7rem" }}>Qty</label>
                              <input className="board-input" type="number" value={item.quantity || ""} onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)} />
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "0.1rem" }}>
                              {items.length > 1 && (
                                <button className="board-btn-danger-ghost" onClick={() => removeItem(item.id)}><Trash2 size={16} /></button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Discount */}
                  <div className="board-card">
                    <div className="board-grid-2">
                      <div>
                        <h2 className="board-section-title">Payment Info</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div>
                            <label className="board-label">Bank Account</label>
                            <input className="board-input" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="XXXX-XXXX-XXXX" />
                          </div>
                          <div>
                            <label className="board-label">Account Name</label>
                            <input className="board-input" value={bankUser} onChange={(e) => setBankUser(e.target.value)} placeholder="Pascal Arya" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h2 className="board-section-title">Discount</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div className="board-toggle-group">
                            <button className={`board-toggle-btn ${discountType === "percentage" ? "active" : ""}`} onClick={() => setDiscountType("percentage")}>Percentage (%)</button>
                            <button className={`board-toggle-btn ${discountType === "amount" ? "active" : ""}`} onClick={() => setDiscountType("amount")}>Fixed (Rp)</button>
                          </div>
                          <div>
                            <label className="board-label">Discount Value {discountType === "percentage" ? "(%)" : "(Rp)"}</label>
                            <input className="board-input" type="number" value={discountValue || ""} onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)} placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 50000"} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ─── MOU FORMS ─── */}
              {activeTab === "mou" && (
                <>
                  {/* MoU Details */}
                  <div className="board-card">
                    <h2 className="board-section-title">MoU Details</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label className="board-label">Project Title</label>
                        <input className="board-input" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. Website Redesign & Development" />
                      </div>
                      <div className="board-grid-2">
                        <div>
                          <label className="board-label">MoU Reference Number</label>
                          <input className="board-input" value={mouNumber} onChange={(e) => setMouNumber(e.target.value)} placeholder="MOU/2026/XXX" />
                        </div>
                        <div>
                          <label className="board-label">Date</label>
                          <input className="board-input" value={mouDate} onChange={(e) => setMouDate(e.target.value)} placeholder="07/03/2026" />
                        </div>
                      </div>
                      <div className="board-divider" />
                      <div className="board-grid-2">
                        <div>
                          <label className="board-label">Deposit Percentage (%)</label>
                          <input className="board-input" type="number" min="0" max="100" value={depositPercentage} onChange={(e) => setDepositPercentage(parseInt(e.target.value) || 0)} />
                          <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.25rem", fontStyle: "italic" }}>* Updates Financial Terms automatically</p>
                        </div>
                        <div>
                          <label className="board-label">Termination Notice (Days)</label>
                          <input className="board-input" type="number" value={terminationDays} onChange={(e) => setTerminationDays(parseInt(e.target.value) || 0)} />
                          <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.25rem", fontStyle: "italic" }}>* Updates Termination article automatically</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parties */}
                  <div className="board-card">
                    {/* Mode Switcher */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                      <div className="board-toggle-group" style={{ width: "fit-content" }}>
                        <button className={`board-toggle-btn ${mouMode === "guided" ? "active" : ""}`} onClick={() => setMouMode("guided")}>GUIDED TEMPLATE</button>
                        <button className={`board-toggle-btn ${mouMode === "manual" ? "active" : ""}`} onClick={() => setMouMode("manual")}>MANUAL WRITING</button>
                      </div>
                    </div>

                    <h2 className="board-section-title">Parties</h2>
                    <div className="board-parties-grid">
                      <div>
                        <p style={{ fontSize: "0.7rem", fontWeight: 900, color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>PARTY A</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          <input className="board-input" value={partyA.name} onChange={(e) => setPartyA({ ...partyA, name: e.target.value })} placeholder="Company Name" />
                          <input className="board-input" value={partyA.representative} onChange={(e) => setPartyA({ ...partyA, representative: e.target.value })} placeholder="Representative" />
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.7rem", fontWeight: 900, color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>PARTY B</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          <input className="board-input" value={partyB.name} onChange={(e) => setPartyB({ ...partyB, name: e.target.value })} placeholder="Client Company" />
                          <input className="board-input" value={partyB.representative} onChange={(e) => setPartyB({ ...partyB, representative: e.target.value })} placeholder="Client Rep" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Articles */}
                  <div className="board-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                      <div>
                        <h2 className="board-section-title" style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                          {mouMode === "guided" ? "MoU Articles" : "Full Document Body"}
                        </h2>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500, marginTop: "0.25rem" }}>
                          {mouMode === "guided" ? "Define the legal terms of your agreement" : "Write your custom memorandum content below"}
                        </p>
                      </div>
                      {mouMode === "manual" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ width: "8px", height: "8px", background: "#3b82f6", borderRadius: "50%", animation: "board-spin 2s linear infinite" }} />
                          <span style={{ fontSize: "0.65rem", fontWeight: 900, color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase" }}>Custom Editor</span>
                        </div>
                      )}
                    </div>

                    {mouMode === "guided" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                          <SortableContext items={clauses.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                            {clauses.map((clause, index) => {
                              const isAuto = ["Purpose and Scope", "Roles and Responsibility", "Financial Terms and Payment Schedule", "Term and Termination"].includes(clause.title);
                              return (
                                <SortableArticle
                                  key={clause.id}
                                  clause={clause}
                                  index={index}
                                  isAuto={isAuto}
                                  clausesCount={clauses.length}
                                  updateClause={updateClause}
                                  removeClause={removeClause}
                                  moveClause={moveClause}
                                  providerResponsibilities={providerResponsibilities}
                                  setProviderResponsibilities={setProviderResponsibilities}
                                  clientResponsibilities={clientResponsibilities}
                                  setClientResponsibilities={setClientResponsibilities}
                                />
                              );
                            })}
                          </SortableContext>
                        </DndContext>
                        <button className="board-add-article-btn" onClick={addClause}>
                          <Plus size={18} /> ADD NEW ARTICLE
                        </button>
                      </div>
                    ) : (
                      <div style={{ minHeight: "500px" }}>
                        <RichTextEditor content={manualContent} onChange={setManualContent} placeholder="Start writing your MoU here..." />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right: Preview */}
            <div className="board-preview-col">
              {/* Total / Download Bar */}
              <div className="board-card-sm">
                <div className="board-total-bar">
                  <div>
                    <p className="board-total-label">{activeTab === "invoice" ? "Total Amount" : "Document Type"}</p>
                    <p className="board-total-amount">{activeTab === "invoice" ? `Rp${grandTotal.toLocaleString("id-ID")}` : "MoU"}</p>
                  </div>
                  <button className="board-btn-primary" onClick={handleDownload} disabled={isGenerating}>
                    <Download size={18} />
                    {isGenerating ? "Processing..." : `Download ${activeTab === "invoice" ? "Invoice" : "MoU"}`}
                  </button>
                </div>
              </div>

              {/* PDF Preview */}
              <div className="board-card-sm">
                <div className="board-preview-topbar">
                  <p className="board-preview-label">Document Preview</p>
                  <div className="board-zoom-controls">
                    <button className="board-zoom-btn" onClick={() => setUserZoom(1)} title="Fit to Window"><Maximize size={14} /></button>
                    <div style={{ width: "1px", height: "14px", background: "#e2e8f0" }} />
                    <button className="board-zoom-btn" onClick={() => setUserZoom((z) => Math.max(0.2, z - 0.1))}><ZoomOut size={14} /></button>
                    <span className="board-zoom-label">{Math.round(userZoom * 100)}%</span>
                    <button className="board-zoom-btn" onClick={() => setUserZoom((z) => Math.min(3, z + 0.1))}><ZoomIn size={14} /></button>
                  </div>
                </div>
                <div id="board-pdf-scroll" className="board-pdf-scroll">
                  <div style={{ transform: `scale(${previewScale * userZoom})`, transformOrigin: "top center", width: "794px" }}>
                    <div id="board-invoice-pdf-container" style={{ background: "#ffffff", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                      {activeTab === "invoice" ? (
                        <InvoicePDF
                          invoiceNumber={invoiceNumber}
                          clientName={clientName}
                          clientPhone={clientPhone}
                          items={items}
                          bankAccount={bankAccount}
                          bankUser={bankUser}
                          subtotal={subtotal}
                          discountAmount={discountAmount}
                          grandTotal={grandTotal}
                        />
                      ) : (
                        <MoUPDF
                          mouNumber={mouNumber}
                          date={mouDate || new Date().toLocaleDateString("id-ID")}
                          partyA={partyA}
                          partyB={partyB}
                          mouMode={mouMode}
                          clauses={clauses.filter((c) => !c.hidden)}
                          manualContent={manualContent}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
