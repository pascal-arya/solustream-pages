import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="home-container">
      <div className="home-card" style={{ padding: "48px 40px", textAlign: "center" }}>
        <img
          src="/Assets/solustream_logo.png"
          alt="Solustream Logo"
          className="home-logo"
          style={{ marginBottom: "24px" }}
        />
        <h1 className="home-title" style={{ fontSize: "32px", fontWeight: "700", color: "#000000", marginBottom: "16px" }}>
          Under Development
        </h1>
        <p className="home-desc" style={{ fontSize: "16px", color: "#71717a", lineHeight: "1.6", marginBottom: "32px" }}>
          Kami sedang mempersiapkan platform siaran langsung terbaik untuk Anda. 
          Layanan live streaming Solustream untuk event, webinar, dan seminar Anda akan segera hadir kembali dengan fitur-fitur baru yang lebih canggih.
        </p>
        
        {/* Subtle, premium access link to the satisfaction form for testing */}
        <div style={{ borderTop: "1px solid #e4e4e7", paddingTop: "24px" }}>
          <Link 
            href="/satisfaction-forms" 
            className="btn-start" 
            id="btn-access-survey"
            style={{ textDecoration: "none" }}
          >
            Akses Formulir Kepuasan &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
