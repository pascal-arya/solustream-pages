"use client";

import React, { useState } from "react";
import EmojiSlider from "../components/EmojiSlider";
import { supabase } from "@/lib/supabaseClient";

export default function SatisfactionFormsPage() {
  // Form state fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [slider1, setSlider1] = useState(75); // Mockup Default: 75%
  const [slider2, setSlider2] = useState(100); // Mockup Default: 100%
  const [slider3, setSlider3] = useState(50); // Mockup Default: 50%
  const [feedback, setFeedback] = useState("");

  const [slider1Adjusted, setSlider1Adjusted] = useState(false);
  const [slider2Adjusted, setSlider2Adjusted] = useState(false);
  const [slider3Adjusted, setSlider3Adjusted] = useState(false);

  // Validation & Modal states
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    slider1?: string;
    slider2?: string;
    slider3?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Reset form to mockup defaults
  const handleClear = () => {
    setName("");
    setEmail("");
    setSlider1(75);
    setSlider2(100);
    setSlider3(50);
    setSlider1Adjusted(false);
    setSlider2Adjusted(false);
    setSlider3Adjusted(false);
    setFeedback("");
    setErrors({});
    setShowModal(false);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Validation
    const newErrors: {
      name?: string;
      email?: string;
      slider1?: string;
      slider2?: string;
      slider3?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = "Nama atau nama instansi wajib diisi.";
    }
    if (!email.trim()) {
      newErrors.email = "Nama event atau kegiatan wajib diisi.";
    }

    if (!slider1Adjusted) {
      newErrors.slider1 = "Mohon berikan penilaian untuk kualitas tayangan streaming.";
    }
    if (!slider2Adjusted) {
      newErrors.slider2 = "Mohon berikan penilaian untuk kesiapan teknis & kinerja tim.";
    }
    if (!slider3Adjusted) {
      newErrors.slider3 = "Mohon berikan penilaian untuk kemudahan integrasi & interaksi platform.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Scroll to the first error
      if (newErrors.name) {
        const nameInput = document.getElementById("name-input") as HTMLInputElement;
        if (nameInput) nameInput.focus();
      } else if (newErrors.email) {
        const emailInput = document.getElementById("email-input") as HTMLInputElement;
        if (emailInput) emailInput.focus();
      } else if (newErrors.slider1) {
        const el = document.getElementById("slider-experience");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.slider2) {
        const el = document.getElementById("slider-content");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.slider3) {
        const el = document.getElementById("slider-usability");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Insert response directly into Supabase 'SatisfactionForms' table
      const { error } = await supabase
        .from("SatisfactionForms")
        .insert([
          {
            client_name: name,
            event_name: email,
            question01_sliders: slider1,
            question02_sliders: slider2,
            question03_sliders: slider3,
            testimonial: feedback,
          },
        ]);

      if (error) {
        console.error("Supabase submission error:", error);
        alert("Error submitting feedback: " + error.message);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        setShowModal(true);
      }
    } catch (err: any) {
      console.error("Unexpected error submitting feedback:", err);
      alert("An unexpected error occurred during submission.");
      setIsSubmitting(false);
    }
  };

  // Helper to render Apple Emoji Image based on percentage
  const getAppleEmojiPath = (val: number): string => {
    if (val < 16) return "/Assets/emojis/1f614.png"; // 😔
    if (val < 41) return "/Assets/emojis/1f641.png"; // 🙁
    if (val < 66) return "/Assets/emojis/1f604.png"; // 😄
    if (val < 90) return "/Assets/emojis/1f606.png"; // 😆
    return "/Assets/emojis/1f929.png"; // 🤩
  };

  const renderEmojiSpan = (val: number) => {
    return (
      <img
        src={getAppleEmojiPath(val)}
        alt="Emoji score badge"
        style={{
          width: "20px",
          height: "20px",
          objectFit: "contain",
          display: "inline-block",
          verticalAlign: "middle"
        }}
      />
    );
  };

  return (
    <main className="form-page-container">
      {/* Brand Header */}
      <header className="logo-header">
        <img
          src="/Assets/solustream_logo.png"
          alt="Solustream Logo"
          className="logo-image"
        />
        <h1 className="page-title">Survei Kepuasan Layanan</h1>
      </header>

      {/* Main Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="forms-grid">
          {/* Left Column: Personal Info & Sliders */}
          <div className="left-column">
            
            {/* Identity Group 1 (Name) */}
            <div className="form-group">
              <label htmlFor="name-input" className="form-title-label">
                Nama Lengkap / Nama Instansi
              </label>
              <span className="form-subtext-label">
                Siapa nama Anda atau perwakilan instansi yang menyelenggarakan acara?
              </span>
              <input
                type="text"
                id="name-input"
                className="form-input-text"
                placeholder="Contoh: Budi Santoso atau PT Solusi Utama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  borderColor: errors.name ? "#ff3b30" : undefined,
                }}
              />
              {errors.name && (
                <span style={{ color: "#ff3b30", fontSize: "12px", marginTop: "2px" }}>
                  {errors.name}
                </span>
              )}
            </div>

            {/* Identity Group 2 (Event Name) */}
            <div className="form-group">
              <label htmlFor="email-input" className="form-title-label">
                Nama Event / Jenis Kegiatan
              </label>
              <span className="form-subtext-label">
                Nama event atau acara yang disiarkan langsung oleh layanan Solustream.
              </span>
              <input
                type="text"
                id="email-input"
                className="form-input-text"
                placeholder="Contoh: Webinar Marketing, Seminar Akbar, Live Zoom Meeting"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  borderColor: errors.email ? "#ff3b30" : undefined,
                }}
              />
              {errors.email && (
                <span style={{ color: "#ff3b30", fontSize: "12px", marginTop: "2px" }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Custom Emoji Slider 1 */}
            <EmojiSlider
              id="slider-experience"
              label="Kualitas Video & Audio Streaming"
              sublabel="Seberapa puas Anda dengan ketajaman gambar, kestabilan fps, dan kejernihan suara siaran?"
              value={slider1}
              isAdjusted={slider1Adjusted}
              onChange={(val) => {
                setSlider1(val);
                setSlider1Adjusted(true);
                if (errors.slider1) {
                  setErrors(prev => ({ ...prev, slider1: undefined }));
                }
              }}
            />
            {errors.slider1 && (
              <span style={{ color: "#ff3b30", fontSize: "12px", marginTop: "-16px", marginBottom: "8px", display: "block", fontWeight: 500 }}>
                {errors.slider1}
              </span>
            )}

            {/* Custom Emoji Slider 2 */}
            <EmojiSlider
              id="slider-content"
              label="Kesiapan Teknis & Kinerja Tim Kru"
              sublabel="Bagaimana penilaian Anda terhadap profesionalisme, respon cepat, dan kesiapan kru Solustream?"
              value={slider2}
              isAdjusted={slider2Adjusted}
              onChange={(val) => {
                setSlider2(val);
                setSlider2Adjusted(true);
                if (errors.slider2) {
                  setErrors(prev => ({ ...prev, slider2: undefined }));
                }
              }}
            />
            {errors.slider2 && (
              <span style={{ color: "#ff3b30", fontSize: "12px", marginTop: "-16px", marginBottom: "8px", display: "block", fontWeight: 500 }}>
                {errors.slider2}
              </span>
            )}

            {/* Custom Emoji Slider 3 */}
            <EmojiSlider
              id="slider-usability"
              label="Kemudahan Integrasi Platform & Layanan Webinar"
              sublabel="Seberapa lancar setup link, integrasi platform (Zoom/YouTube), dan kemudahan interaksi peserta?"
              value={slider3}
              isAdjusted={slider3Adjusted}
              onChange={(val) => {
                setSlider3(val);
                setSlider3Adjusted(true);
                if (errors.slider3) {
                  setErrors(prev => ({ ...prev, slider3: undefined }));
                }
              }}
            />
            {errors.slider3 && (
              <span style={{ color: "#ff3b30", fontSize: "12px", marginTop: "-16px", marginBottom: "8px", display: "block", fontWeight: 500 }}>
                {errors.slider3}
              </span>
            )}

          </div>

          {/* Right Column: Textarea Suggestions */}
          <div className="right-column">
            
            <div className="form-group" style={{ height: "100%" }}>
              <label htmlFor="feedback-textarea" className="form-title-label">
                Ulasan Tambahan & Saran Perbaikan
              </label>
              <span className="form-subtext-label">
                Berikan masukan atau testimoni Anda mengenai kerja sama live streaming bersama Solustream.
              </span>
              <textarea
                id="feedback-textarea"
                className="form-textarea"
                placeholder="Tuliskan pengalaman positif, masukan, atau kritik konstruktif Anda di sini..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="actions-footer">
          <button
            type="button"
            className="btn-clear"
            onClick={handleClear}
            disabled={isSubmitting}
            id="btn-clear-form"
          >
            Bersihkan
          </button>
          
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
            id="btn-submit-form"
          >
            {isSubmitting ? (
              <>
                <svg
                  style={{
                    animation: "spin 1s linear infinite",
                    width: "18px",
                    height: "18px",
                    marginRight: "6px"
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="30 30"
                  />
                </svg>
                Mengirim...
              </>
            ) : (
              "Kirim Ulasan"
            )}
          </button>
        </div>
      </form>

      {/* Success Dialog Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-icon" role="img" aria-label="party popper">
              🎉
            </span>
            <h2 className="modal-title">Terima kasih{name ? `, ${name}` : ""}!</h2>
            <p className="modal-text">
              Masukan Anda sangat berharga bagi kami. Kami telah menerima hasil ulasan kepuasan layanan Anda:
            </p>
            <div
              style={{
                textAlign: "left",
                backgroundColor: "#f8f9fa",
                border: "1px solid #e4e4e7",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px",
                fontSize: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#71717a" }}>Kualitas Video/Audio Streaming:</span>
                <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                  {slider1}% {renderEmojiSpan(slider1)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#71717a" }}>Kesiapan Teknis & Tim Kru:</span>
                <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                  {slider2}% {renderEmojiSpan(slider2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#71717a" }}>Kemudahan Integrasi Platform:</span>
                <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                  {slider3}% {renderEmojiSpan(slider3)}
                </span>
              </div>
              {feedback.trim() && (
                <div style={{ marginTop: "6px", borderTop: "1px solid #e4e4e7", paddingTop: "12px" }}>
                  <div style={{ color: "#71717a", marginBottom: "6px" }}>Ulasan/Saran Anda:</div>
                  <div style={{ color: "#000000", fontStyle: "italic", lineHeight: 1.5, background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e4e4e7" }}>
                    "{feedback.length > 120 ? `${feedback.substring(0, 120)}...` : feedback}"
                  </div>
                </div>
              )}
            </div>
            <button className="btn-modal-close" onClick={handleClear} id="btn-close-modal">
              Tutup & Selesai
            </button>
          </div>
        </div>
      )}

      {/* Spinner Animation Keyframe */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
