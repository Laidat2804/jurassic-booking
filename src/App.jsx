import React from 'react';
import Hero from './components/Hero';
import IslandMap from './components/IslandMap';
import BookingForm from './components/BookingForm';
import DinoEncyclopedia from './components/DinoEncyclopedia';
import Footer from './components/Footer';
import TourDetailDrawer from './components/TourDetailDrawer';
import TourComparisonPanel from './components/TourComparisonPanel';
import GuestTestimonials from './components/GuestTestimonials';
import InGenChatbot from './components/InGenChatbot';
import IslandConditionsWidget from './components/IslandConditionsWidget';
import MyBookings from './components/MyBookings';

function App() {
  return (
    <div className="min-h-screen bg-command flex flex-col font-sans text-white">
      <Hero />
      
      <main id="map-section" className="flex-grow container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-2 tracking-tighter">
            SECTOR 8 SURVEILLANCE
          </h2>
          <div className="flex justify-center items-center gap-2 mb-4">
             <span className="h-1 w-2 bg-amber-warning rounded-full animate-pulse"></span>
             <div className="h-0.5 w-24 bg-white/20 rounded"></div>
             <span className="h-1 w-2 bg-amber-warning rounded-full animate-pulse"></span>
          </div>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Select a containment zone on the map to initialize tour protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:h-[700px]">
          {/* Map Section - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 h-[350px] sm:h-[450px] lg:h-full w-full rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5">
            <IslandMap />
          </div>

          {/* Booking / Details Section */}
          <div className="min-h-[300px] lg:h-full">
            <BookingForm />
          </div>
        </div>
      </main>

      <DinoEncyclopedia />

      <GuestTestimonials />

      <MyBookings />

      <Footer />

      {/* Tour Detail Drawer - Global overlay */}
      <TourDetailDrawer />
      <TourComparisonPanel />
      <InGenChatbot />
      <IslandConditionsWidget />
    </div>
  );
}

export default App;
