import React from 'react';
import Image from 'next/image';
import '../landing.css';

export default function Solutions() {
  const cards = [
    {
      id: 1,
      image: '/Assets/Landing Page/Solusi Img/seminat.png',
      titleImage: '/Assets/Landing Page/Group 2607807.png',
      altText: 'Seminar & Conference',
      description: 'Jangkau audiens lebih luas dengan seminar virtual interaktif dan profesional',
    },
    {
      id: 2,
      image: '/Assets/Landing Page/Solusi Img/Mask group (1).png',
      titleImage: '/Assets/Landing Page/Group 2607808.png',
      altText: 'Sales & Commerce',
      description: 'Ubah penonton menjadi pembeli dengan live multi-platform',
    },
    {
      id: 3,
      image: '/Assets/Landing Page/Solusi Img/Mask group (2).png',
      titleImage: '/Assets/Landing Page/Group 2607809.png',
      altText: 'Event & Entertainment',
      description: 'Siarkan keseruan konser, festival, dan acara hiburan secara real-time',
    },
    {
      id: 4,
      image: '/Assets/Landing Page/Solusi Img/Mask group.png',
      titleImage: '/Assets/Landing Page/Group 2607810.png',
      altText: 'Custom Solutions',
      description: 'Solusi penyiaran khusus yang disesuaikan dengan kebutuhan unik event Anda',
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
            <div key={card.id} className="solution-card">
              <div className="solution-card-image-wrapper">
                <Image
                  src={card.image}
                  alt={card.altText}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="solution-card-image"
                  priority={card.id <= 2}
                />
              </div>
              
              <div className="solution-card-content">
                <div className="solution-card-title-wrapper">
                  <Image
                    src={card.titleImage}
                    alt={card.altText}
                    width={180}
                    height={50}
                    className="solution-card-title-img"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                
                <p className="solution-card-description">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
