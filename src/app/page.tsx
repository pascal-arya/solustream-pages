import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Clients from "./components/Clients";
import Solutions from "./components/Solutions";
import Reasons from "./components/Reasons";
import BookingForm from "./components/BookingForm";
import Footer from "./components/Footer";
import FloatingBookButton from "./components/FloatingBookButton";
import "./landing.css"; // Ensure landing styles are loaded

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Clients />
      <Solutions />
      <Reasons />
      <BookingForm />
      <Footer />
      <FloatingBookButton />
    </main>
  );
}
