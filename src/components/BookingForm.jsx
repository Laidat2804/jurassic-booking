import { useState, useEffect, useRef } from 'react';
import useBookingStore from '../store/useBookingStore';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { AlertTriangle, Shield, Lock } from 'lucide-react';
import tours from '../data/tours.json';

import argentinosaurusImg from '../assets/Argentinosaurus.jpg';
import triceratopsImg from '../assets/Triceratops.jpg';
import tyrannosaurusImg from '../assets/Tyrannosaurus.jpg';
import spinosaurusImg from '../assets/Spinosaurus.jpg';
import plesiosaurusImg from '../assets/Plesiosaurus.jpg';
import mosasaurusImg from '../assets/Mosasaurus.jpg';
import pteranodonImg from '../assets/Pteranodon.jpg';
import pterosaurImg from '../assets/Pterosaur.jpg';

const dinoImages = {
  argentinosaurus: argentinosaurusImg,
  triceratops: triceratopsImg,
  tyrannosaurus: tyrannosaurusImg,
  spinosaurus: spinosaurusImg,
  plesiosaurus: plesiosaurusImg,
  mosasaurus: mosasaurusImg,
  pteranodon: pteranodonImg,
  pterosaur: pterosaurImg
};

const getDangerLevel = (level) => {
  if (typeof level === 'number') {
    if (level >= 5) return 'Extreme';
    if (level === 4) return 'High';
    if (level === 3) return 'Medium';
    return 'Low';
  }
  return level || 'Low';
};

const NumberCounter = ({ value }) => {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;
    if(!node) return;

    const controls = animate(0, value, {
      duration: 1,
      onUpdate: (latest) => {
        node.textContent = Math.round(latest).toLocaleString();
      }
    });

    return () => controls.stop();
  }, [value]);

  return <span ref={nodeRef} />;
};

// Find the tour that this dino belongs to (as anchor or specimen)
const findTourForDino = (dinoId) => {
  // First check if this dino is an anchor
  const anchorTour = tours.find(t => t.anchorDinoId === dinoId);
  if (anchorTour) return anchorTour;

  // Then check if it's included in any tour's specimens
  const includedTour = tours.find(t => 
    t.specimensIncluded.some(s => s.dinoId === dinoId)
  );
  if (includedTour) return includedTour;

  return null;
};

const BookingForm = () => {
  const { activeZone, setActiveTour } = useBookingStore();
  const [comingSoonPulse, setComingSoonPulse] = useState(false);

  // Reset pulse when activeZone changes
  useEffect(() => {
    setComingSoonPulse(false);
  }, [activeZone]);

  const handleBookingProtocol = () => {
    if (!activeZone) return;
    const tour = findTourForDino(activeZone.id);
    if (tour) {
      setActiveTour(tour);
    } else {
      // No tour available — show coming soon animation
      setComingSoonPulse(true);
      setTimeout(() => setComingSoonPulse(false), 3000);
    }
  };

  if (!activeZone) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-command-light rounded-xl border border-white/5 shadow-inner">
        <div className="w-16 h-16 border-4 border-t-amber-warning border-white/10 rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-mono text-gray-400 animate-pulse">AWAITING INPUT</h3>
        <p className="text-sm text-gray-500 mt-2">Select a zone on the tactical map to proceed.</p>
      </div>
    );
  }

  return (
    <div className="bg-command-light rounded-xl border border-white/10 shadow-2xl overflow-hidden relative h-full flex flex-col">
      {/* Header */}
      <div className="bg-jungle-dark p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-mono font-bold text-lg text-white truncate">{activeZone.species.toUpperCase()}</h3>
        <span className={`px-2 py-0.5 text-xs font-bold rounded ${
          getDangerLevel(activeZone.dangerLevel) === 'Extreme' ? 'bg-alert text-white' : 
          getDangerLevel(activeZone.dangerLevel) === 'High' ? 'bg-orange-500 text-white' : 
          'bg-green-600 text-white'
        }`}>
          {getDangerLevel(activeZone.dangerLevel).toUpperCase()}
        </span>
      </div>

      <div className="p-6 flex-grow overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeZone.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="aspect-video bg-black/50 rounded flex items-center justify-center border border-white/10 overflow-hidden relative group">
               {dinoImages[activeZone.imageKey] ? (
                 <img 
                   src={dinoImages[activeZone.imageKey]} 
                   alt={activeZone.species} 
                   className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                 />
               ) : (
                 <div className="absolute inset-0 bg-jungle/20"></div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            </div>
            
            <div>
              <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-1">Description</h4>
              <p className="text-gray-200 leading-relaxed">{activeZone.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-command-dark p-3 rounded border border-white/5">
                <div className="text-gray-400 text-xs mb-1">Type</div>
                <div className="font-mono text-amber-warning">{activeZone.type.toUpperCase()}</div>
              </div>
              <div className="bg-command-dark p-3 rounded border border-white/5">
                <div className="text-gray-400 text-xs mb-1">Price per Person</div>
                <div className="font-mono text-2xl text-white font-bold">
                  $<NumberCounter value={activeZone.price} />
                </div>
              </div>
            </div>

            {/* Coming Soon Notice */}
            <AnimatePresence>
              {comingSoonPulse && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="bg-command-dark border border-amber-500/30 rounded-lg p-4 text-center"
                >
                  <Lock className="w-8 h-8 text-amber-warning mx-auto mb-2" />
                  <p className="text-amber-warning font-mono font-bold text-sm tracking-wider">TOUR CLASSIFIED</p>
                  <p className="text-gray-500 text-xs mt-1">Experience package coming soon. Stay tuned.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleBookingProtocol}
              className="w-full bg-amber-warning hover:bg-amber-400 text-command-dark font-bold py-4 rounded transition-all uppercase tracking-widest shadow-lg shadow-amber-500/20"
            >
              Booking Protocol
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingForm;
