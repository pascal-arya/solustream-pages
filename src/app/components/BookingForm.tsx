"use client";

import React, { useState, useEffect, useRef } from 'react';
import '../landing.css';

export default function BookingForm() {
  const [isFormRevealed, setIsFormRevealed] = useState(false);
  
  // Input fields state
  const [userName, setUserName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [needs, setNeeds] = useState('');
  const [description, setDescription] = useState('');

  // Status & Validation States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  const budgetOptions = [
    { value: '1.5-3m', label: '1.5 Juta - 3 Juta IDR' },
    { value: '3-5m', label: '3 Juta - 5 Juta IDR' },
    { value: '5-10m', label: '5 Juta - 10 Juta IDR' },
    { value: '10-20m', label: '10 Juta - 20 Juta IDR' },
    { value: '20m+', label: 'Diatas 20 Juta IDR' },
  ];

  const needsOptions = [
    { value: 'seminar', label: 'Seminar and Conference' },
    { value: 'sales', label: 'Sales and Commerce' },
    { value: 'event', label: 'Event and Entertainment' },
    { value: 'custom', label: 'Custom Solution' },
  ];

  const handleClear = () => {
    setUserName('');
    setEventName('');
    setEventDate('');
    setEventLocation('');
    setBudgetRange('');
    setNeeds('');
    setDescription('');
    setErrors({});
    setShowModal(false);
  };

  const handleCancel = () => {
    handleClear();
    setIsFormRevealed(false);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!userName.trim()) newErrors.userName = 'Nama wajib diisi.';
    if (!eventName.trim()) newErrors.eventName = 'Nama event wajib diisi.';
    if (!eventDate) newErrors.eventDate = 'Tanggal event wajib diisi.';
    if (!eventLocation.trim()) newErrors.eventLocation = 'Lokasi event wajib diisi.';
    if (!budgetRange) newErrors.budgetRange = 'Pilih perkiraan budget Anda.';
    if (!needs) newErrors.needs = 'Pilih jenis kebutuhan streaming Anda.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Helpers to get human-readable labels for the WhatsApp template
    const getNeedsLabel = (val: string) => {
      const option = needsOptions.find(o => o.value === val);
      return option ? option.label : val;
    };

    const getBudgetLabel = (val: string) => {
      const option = budgetOptions.find(o => o.value === val);
      return option ? option.label : val;
    };

    // Format WhatsApp template message
    const message = `Halo Tim Solustream! 🚀

Saya ingin melakukan booking layanan live streaming. Berikut detail rencana event saya:

👤 *Nama Pemesan*: ${userName}
📅 *Nama Event*: ${eventName}
📆 *Tanggal Event*: ${eventDate}
📍 *Lokasi Event*: ${eventLocation}
🎥 *Kebutuhan Streaming*: ${getNeedsLabel(needs)}
💰 *Perkiraan Budget*: ${getBudgetLabel(budgetRange)}

📝 *Detail Kebutuhan*: 
${description.trim() ? description : '-'}

Terima kasih! Saya tunggu konfirmasi dari tim Solustream.`;

    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/6281221552324?text=${encodedText}`;

    // Simulate API submission, open WhatsApp in a new tab, and show the success confirmation modal
    setTimeout(() => {
      setIsSubmitting(false);
      window.open(waUrl, '_blank');
      setShowModal(true);
    }, 1000);
  };

  return (
    <section className="landing-booking" id="booking" ref={sectionRef}>
      <div className="landing-booking-container">
        
        {/* Compact CTA State */}
        {!isFormRevealed ? (
          <div className="booking-cta-card">
            <h2 className="booking-cta-title">Siap Menjadikan Event Anda Sukses?</h2>
            <p className="booking-cta-subtitle">
              Konsultasikan kebutuhan live streaming profesional Anda bersama tim ahli Solustream. Hubungi kami sekarang dan buat siaran event Anda tak terlupakan.
            </p>
            <button 
              className="btn-booking-cta"
              onClick={() => setIsFormRevealed(true)}
            >
              Booking Sekarang
            </button>
          </div>
        ) : (
          /* Expanded Form State */
          <div className="booking-card form-expanded">
            <div className="booking-header">
              <h2 className="booking-title">Mulai Kolaborasi Anda</h2>
              <p className="booking-subtitle">
                Isi formulir pemesanan di bawah ini dan perwakilan Solustream akan segera menghubungi Anda dengan penawaran kustom.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="booking-form" noValidate>
              <div className="booking-grid">
                
                {/* Field 1: User Name */}
                <div className="booking-field">
                  <label htmlFor="user-name" className="booking-label">Nama Anda</label>
                  <input
                    type="text"
                    id="user-name"
                    className={`booking-input ${errors.userName ? 'field-error' : ''}`}
                    placeholder="Contoh: Budi Santoso"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      if (errors.userName) setErrors(prev => ({ ...prev, userName: '' }));
                    }}
                  />
                  {errors.userName && <span className="booking-error-text">{errors.userName}</span>}
                </div>

                {/* Field 2: Event Name */}
                <div className="booking-field">
                  <label htmlFor="event-name" className="booking-label">Nama Event</label>
                  <input
                    type="text"
                    id="event-name"
                    className={`booking-input ${errors.eventName ? 'field-error' : ''}`}
                    placeholder="Contoh: Grand Launching Solustream"
                    value={eventName}
                    onChange={(e) => {
                      setEventName(e.target.value);
                      if (errors.eventName) setErrors(prev => ({ ...prev, eventName: '' }));
                    }}
                  />
                  {errors.eventName && <span className="booking-error-text">{errors.eventName}</span>}
                </div>

                {/* Field 3: Event Date */}
                <div className="booking-field">
                  <label htmlFor="event-date" className="booking-label">Tanggal Event</label>
                  <input
                    type="date"
                    id="event-date"
                    className={`booking-input date-input ${errors.eventDate ? 'field-error' : ''}`}
                    value={eventDate}
                    onChange={(e) => {
                      setEventDate(e.target.value);
                      if (errors.eventDate) setErrors(prev => ({ ...prev, eventDate: '' }));
                    }}
                  />
                  {errors.eventDate && <span className="booking-error-text">{errors.eventDate}</span>}
                </div>

                {/* Field 4: Event Location */}
                <div className="booking-field">
                  <label htmlFor="event-location" className="booking-label">Lokasi Event</label>
                  <input
                    type="text"
                    id="event-location"
                    className={`booking-input ${errors.eventLocation ? 'field-error' : ''}`}
                    placeholder="Contoh: Hotel Mulia, Jakarta atau Online Zoom"
                    value={eventLocation}
                    onChange={(e) => {
                      setEventLocation(e.target.value);
                      if (errors.eventLocation) setErrors(prev => ({ ...prev, eventLocation: '' }));
                    }}
                  />
                  {errors.eventLocation && <span className="booking-error-text">{errors.eventLocation}</span>}
                </div>

                {/* Field 5: Needs Dropdown */}
                <div className="booking-field">
                  <label htmlFor="booking-needs" className="booking-label">Kebutuhan Streaming</label>
                  <select
                    id="booking-needs"
                    className={`booking-input select-input ${errors.needs ? 'field-error' : ''}`}
                    value={needs}
                    onChange={(e) => {
                      setNeeds(e.target.value);
                      if (errors.needs) setErrors(prev => ({ ...prev, needs: '' }));
                    }}
                  >
                    <option value="" disabled hidden>Pilih Kebutuhan...</option>
                    {needsOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="select-option">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.needs && <span className="booking-error-text">{errors.needs}</span>}
                </div>

                {/* Field 6: Budget Range Dropdown */}
                <div className="booking-field">
                  <label htmlFor="booking-budget" className="booking-label">Perkiraan Budget (IDR)</label>
                  <select
                    id="booking-budget"
                    className={`booking-input select-input ${errors.budgetRange ? 'field-error' : ''}`}
                    value={budgetRange}
                    onChange={(e) => {
                      setBudgetRange(e.target.value);
                      if (errors.budgetRange) setErrors(prev => ({ ...prev, budgetRange: '' }));
                    }}
                  >
                    <option value="" disabled hidden>Pilih Budget...</option>
                    {budgetOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="select-option">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.budgetRange && <span className="booking-error-text">{errors.budgetRange}</span>}
                </div>

                {/* Field 7: Further Description (Full Width) */}
                <div className="booking-field full-width">
                  <label htmlFor="further-description" className="booking-label">Deskripsi Tambahan / Detail Kebutuhan</label>
                  <textarea
                    id="further-description"
                    className="booking-textarea"
                    placeholder="Ceritakan detail event Anda (misal: jumlah kamera, durasi acara, kebutuhan khusus zoom link, dll)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

              </div>

              {/* Actions & Submit Button */}
              <div className="booking-actions">
                <button
                  type="button"
                  className="btn-booking-clear"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-booking-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Mengirim Booking...' : 'Kirim Booking'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Success Dialog Modal */}
      {showModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-content">
            <span className="booking-modal-success-icon">📅</span>
            <h2 className="booking-modal-title">Booking Berhasil Terkirim!</h2>
            <p className="booking-modal-text">
              Halo <strong>{userName}</strong>, terima kasih atas kepercayaan Anda memesan layanan streaming untuk event <strong>{eventName}</strong>. Tim representatif Solustream akan segera menghubungi Anda melalui nomor kontak untuk detail penawaran.
            </p>
            <button className="btn-booking-modal-close" onClick={handleClear}>
              Tutup & Selesai
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
