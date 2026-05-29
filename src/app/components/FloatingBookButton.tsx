"use client";

import React, { useState, useEffect } from 'react';
import '../landing.css';

export default function FloatingBookButton() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [bookingVisible, setBookingVisible] = useState(false);

  useEffect(() => {
    // 1. Scroll listener for showing button past Hero section
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setScrolledPastHero(true);
      } else {
        setScrolledPastHero(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 2. IntersectionObserver to detect when the booking section CTA enters the viewport
    const bookingElement = document.getElementById('booking');
    if (!bookingElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setBookingVisible(entry.isIntersecting);
      },
      { 
        rootMargin: '0px 0px -100px 0px', // triggers slightly before full entry
        threshold: 0.1 
      }
    );

    observer.observe(bookingElement);
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Button is visible ONLY when scrolled past hero and the actual booking form is NOT visible
  const visible = scrolledPastHero && !bookingVisible;

  return (
    <button
      className={`floating-book-btn ${visible ? 'visible' : ''}`}
      onClick={handleClick}
      aria-label="Pesan Layanan Streaming"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="floating-book-icon"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <span>Book Now</span>
    </button>
  );
}
