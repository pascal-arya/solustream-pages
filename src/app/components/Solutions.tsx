import React from 'react';
import Image from 'next/image';
import '../landing.css';

export default function Solutions() {
  const cards = [
    {
      id: 1,
      bgImage: '/Assets/Landing Page/Sawi editor handal 2.png',
      textImage: '/Assets/Landing Page/Group 2607807.png',
      altText: 'Seminar & Conference',
      isBlueBg: false,
    },
    {
      id: 2,
      bgImage: '/Assets/Landing Page/Untitled design (100) 3.png',
      textImage: '/Assets/Landing Page/Group 2607808.png',
      altText: 'Sales & Commerce',
      isBlueBg: false,
    },
    {
      id: 3,
      bgImage: '/Assets/Landing Page/Rectangle.png',
      textImage: '/Assets/Landing Page/Group 2607809.png',
      altText: 'Event & Entertainment',
      isBlueBg: false,
    },
    {
      id: 4,
      bgImage: '',
      textImage: '/Assets/Landing Page/Group 2607810.png',
      altText: 'Custom Solutions',
      isBlueBg: true,
    },
  ];

  return (
    <section className="landing-solutions" id="solutions">
      <div className="landing-solutions-container">
        <div className="solutions-header">
          <h2 className="solutions-title">Solusi Kami</h2>
          <p className="solutions-subtitle">
            Layanan streaming terintegrasi yang dirancang khusus untuk mensukseskan berbagai jenis kebutuhan event Anda.
          </p>
        </div>

        <div className="solutions-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`solution-card ${card.isBlueBg ? 'card-blue-bg' : ''}`}
            >
              {!card.isBlueBg && card.bgImage && (
                <>
                  <div className="card-bg-wrapper">
                    <Image
                      src={card.bgImage}
                      alt={card.altText}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="card-bg-image"
                    />
                  </div>
                  <div className="card-overlay-gradient"></div>
                </>
              )}
              
              <div className="card-content">
                <div className="card-text-image-wrapper">
                  <Image
                    src={card.textImage}
                    alt={card.altText}
                    width={180}
                    height={80}
                    className="card-text-image"
                    style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
