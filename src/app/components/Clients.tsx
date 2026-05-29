import React from 'react';
import Image from 'next/image';
import '../landing.css';

export default function Clients() {
  return (
    <section className="landing-clients">
      <div className="landing-clients-container">
        <h2 className="clients-title">Klien Solustream</h2>
        <p className="clients-subtitle">
          Dipercaya oleh mereka yang butuh solusi nyata.
        </p>
        <div className="clients-logos-wrapper">
          <Image
            src="/Assets/Landing Page/Frame 47498.png"
            alt="Klien Solustream"
            width={1000}
            height={150}
            className="clients-logos-image"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </section>
  );
}
