import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../landing.css';

export default function Navbar() {
  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-container">
        {/* Empty div to balance flex space-between if needed, or just rely on absolute positioning for logo */}
        <div style={{ width: "32px" }}></div>

        <Link href="/" className="landing-logo-link">
          <Image
            src="/Assets/solustream_logo.png"
            alt="Solustream Logo"
            width={180}
            height={64}
            className="landing-logo"
            style={{ width: "auto", height: "100px" }}
          />
        </Link>
        <button className="landing-hamburger" aria-label="Menu">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
