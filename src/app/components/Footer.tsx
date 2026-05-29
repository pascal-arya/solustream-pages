import React from 'react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="global-footer">
      <div className="global-footer-container">
        
        {/* Left Section: Branding & Copyright */}
        <div className="footer-left">
          <div className="footer-brand">
            <Image
              src="/Assets/solustream_logo.png"
              alt="Solustream Logo"
              width={160}
              height={48}
              className="footer-logo"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <p className="footer-copyright">
            &copy; {currentYear} Solustream. All rights reserved.
          </p>
        </div>

        {/* Right Section: Contact & Social Info */}
        <div className="footer-right">
          
          {/* Social Columns */}
          <div className="footer-contact-group">
            <h4 className="footer-contact-title">Social Media</h4>
            <div className="footer-links-list">
              <a
                href="https://instagram.com/solustream"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="footer-icon"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>@solustream</span>
              </a>

              <a
                href="https://tiktok.com/@solustream.co"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="footer-icon"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
                <span>@solustream.co</span>
              </a>
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="footer-contact-group">
            <h4 className="footer-contact-title">Hubungi Kami</h4>
            <div className="footer-links-list">
              <a
                href="https://wa.me/6281221552324"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="footer-icon"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>081221552324 (Dayor)</span>
              </a>

              <a
                href="mailto:solustream@gmail.com"
                className="footer-link-item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="footer-icon"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>solustream@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
