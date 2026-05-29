"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../landing.css';

export default function Hero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-content">
        <div className="hero-images-container">
          <div className="hero-team-wrapper">
            <Image
              src="/Assets/Landing Page/Group 2607820 2.png"
              alt="Solustream Team"
              width={1000}
              height={1000}
              className="hero-team-image"
              style={{ width: "100%", height: "auto" }}
              priority
            />
            <div className="hero-fade-overlay"></div>
          </div>
          <div className="hero-overlay-content">
            <div className="hero-logo-text-container">
              <Image
                src="/Assets/Landing Page/Group 2607806.png"
                alt="WHY Solustream"
                width={320}
                height={120}
                className="hero-logo-text"
                style={{ width: "100%", height: "auto" }}
              />
            </div>

            <div className="hero-buttons">
              <a
                href="#booking"
                className="landing-btn btn-blue"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new Event('reveal-booking-form'));
                }}
              >
                Book
              </a>
              <Link href="#" className="landing-btn btn-outline">
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
