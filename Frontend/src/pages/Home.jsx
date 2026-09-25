import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroSection from "../components/layout/HeroSection";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
}
