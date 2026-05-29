import React from 'react';
import Image from 'next/image';
import '../landing.css';

export default function Reasons() {
  const cards = [
    {
      id: 1,
      title: 'Berorientasi Solusi',
      description: 'Kami tidak menunggu instruksi saat terjadi kendala di lapangan. Tim kami mengambil keputusan cepat untuk memastikan stream tetap berjalan.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="reason-card-icon">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Backup Berlapis',
      description: 'Kami selalu menyiapkan internet cadangan (multi-provider bonding) dan perangkat cadangan.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="reason-card-icon">
          <path d="m12 3-10 5 10 5 10-5-10-5Z" />
          <path d="m2 17 10 5 10-5" />
          <path d="m2 12 10 5 10-5" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Kustomisasi Tanpa Batas',
      description: 'Apa pun platform yang Anda minta (YouTube, Zoom, TikTok, Web Khusus), kami eksekusi sesuai kebutuhan bisnis Anda.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="reason-card-icon">
          <line x1="4" x2="4" y1="21" y2="14" />
          <line x1="4" x2="4" y1="10" y2="3" />
          <line x1="12" x2="12" y1="21" y2="12" />
          <line x1="12" x2="12" y1="8" y2="3" />
          <line x1="20" x2="20" y1="21" y2="16" />
          <line x1="20" x2="20" y1="12" y2="3" />
          <line x1="2" x2="6" y1="14" y2="14" />
          <line x1="10" x2="14" y1="8" y2="8" />
          <line x1="18" x2="22" y1="16" y2="16" />
        </svg>
      )
    },
  ];

  return (
    <section className="landing-reasons" id="reasons">
      <div className="landing-reasons-container">
        
        {/* Reasons Header Section */}
        <div className="reasons-header-wrapper">
          <div className="reasons-logo-container">
            <Image
              src="/Assets/Landing Page/Group 2607806.png"
              alt="WHY Solustream"
              width={140}
              height={50}
              className="reasons-logo-img"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <div className="reasons-text-container">
            <h2 className="reasons-title">Tiga alasan mengapa solusi kami berbeda</h2>
            <p className="reasons-subtitle">
              Ubah penonton menjadi pembeli dengan live multi-platform
            </p>
          </div>
        </div>

        {/* Reasons Cards Grid */}
        <div className="reasons-grid">
          {cards.map((card) => (
            <div key={card.id} className="reason-card">
              {card.icon}
              <h3 className="reason-card-title">{card.title}</h3>
              <p className="reason-card-desc">{card.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
