import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, X, Clock, MapPin, User, Calendar, Trash2,
  AlertTriangle, CheckCircle, ChevronRight, Compass, Skull, RotateCcw
} from 'lucide-react';
import useBookingStore from '../store/useBookingStore';
import tours from '../data/tours.json';

// ===== FAKE QR CODE (SVG) =====
const FakeQRCode = ({ seed }) => {
  // Generate a deterministic pseudo-random QR pattern from seed
  const cells = [];
  let hash = seed;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      hash = ((hash * 1103515245 + 12345) & 0x7fffffff);
      // Fixed corner patterns (QR alignment)
      const isCorner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
      const fill = isCorner || (hash % 3 !== 0);
      cells.push(
        <rect key={`${r}-${c}`} x={c * 4} y={r * 4} width="3.5" height="3.5" rx="0.5"
          fill={fill ? 'currentColor' : 'transparent'} />
      );
    }
  }
  return (
    <svg viewBox="0 0 36 36" className="w-full h-full text-white/80">
      {cells}
    </svg>
  );
};

// ===== BARCODE =====
const Barcode = ({ code }) => {
  const bars = code.split('').map((char, i) => {
    const width = (char.charCodeAt(0) % 3) + 1;
    return <rect key={i} x={i * 4} y="0" width={width} height="20" fill="currentColor" />;
  });
  return (
    <svg viewBox={`0 0 ${code.length * 4} 24`} className="w-full h-5 text-white/60">
      {bars}
      <text x={code.length * 2} y="23" textAnchor="middle" fill="currentColor" fontSize="3" fontFamily="monospace" opacity="0.5">
        {code}
      </text>
    </svg>
  );
};

// ===== COUNTDOWN TIMER =====
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        isPast: false,
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono">
        <CheckCircle className="w-3 h-3" /> EXPEDITION ACTIVE
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
      <Clock className="w-3 h-3 text-cyan-400" />
      <span className="text-cyan-300">T-minus</span>
      <span className="text-white font-bold">{timeLeft.days}d</span>
      <span className="text-white font-bold">{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
};

// ===== THEME COLORS =====
const themeAccents = {
  green: { border: 'border-green-500/30', stripe: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-500/10' },
  purple: { border: 'border-purple-500/30', stripe: 'bg-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10' },
  red: { border: 'border-red-500/30', stripe: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10' },
  emerald: { border: 'border-emerald-500/30', stripe: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  cyan: { border: 'border-cyan-500/30', stripe: 'bg-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  swamp: { border: 'border-lime-500/30', stripe: 'bg-lime-500', text: 'text-lime-400', bg: 'bg-lime-500/10' },
  'deep-ocean': { border: 'border-cyan-400/30', stripe: 'bg-cyan-400', text: 'text-cyan-300', bg: 'bg-cyan-400/10' },
  leviathan: { border: 'border-red-500/30', stripe: 'bg-red-600', text: 'text-red-400', bg: 'bg-red-500/10' },
};

// ===== BOARDING PASS CARD =====
const BoardingPass = ({ booking, index, onCancel }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const tourData = tours.find(t => t.id === booking.tourId);
  const theme = themeAccents[tourData?.theme] || themeAccents.green;
  const bookingCode = `JW-${String(booking.id).slice(-6).toUpperCase()}`;
  const seatNum = `${String.fromCharCode(65 + (booking.id % 6))}${(booking.id % 20) + 1}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -200, scale: 0.8 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="perspective-1000"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ===== FRONT SIDE — Boarding Pass ===== */}
        <div
          className={`relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl border ${theme.border} overflow-hidden`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Top color stripe */}
          <div className={`h-1.5 ${theme.stripe}`} />

          <div className="p-5 md:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Ticket className={`w-4 h-4 ${theme.text}`} />
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.2em]">Boarding Pass</span>
                </div>
                <h3 className="text-lg md:text-xl font-black font-mono text-white leading-tight">
                  {booking.tour || tourData?.name || 'Unknown Tour'}
                </h3>
              </div>
              <div className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                booking.status === 'Confirmed'
                  ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
              }`}>
                {booking.status || 'Confirmed'}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div>
                <div className="text-[8px] text-gray-600 font-mono uppercase tracking-wider mb-0.5">Passenger</div>
                <div className="text-xs text-white font-mono font-bold flex items-center gap-1">
                  <User className="w-3 h-3 text-gray-500" /> {booking.name}
                </div>
              </div>
              <div>
                <div className="text-[8px] text-gray-600 font-mono uppercase tracking-wider mb-0.5">Date</div>
                <div className="text-xs text-white font-mono font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-500" /> {booking.date}
                </div>
              </div>
              <div>
                <div className="text-[8px] text-gray-600 font-mono uppercase tracking-wider mb-0.5">Seat</div>
                <div className="text-xs text-white font-mono font-bold">{seatNum}</div>
              </div>
              <div>
                <div className="text-[8px] text-gray-600 font-mono uppercase tracking-wider mb-0.5">Gate</div>
                <div className="text-xs text-white font-mono font-bold">G{(booking.id % 8) + 1}</div>
              </div>
            </div>

            {/* Countdown */}
            <div className="mb-4">
              <CountdownTimer targetDate={booking.date} />
            </div>

            {/* Tear line */}
            <div className="relative my-4">
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black" />
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black" />
              <div className="border-t-2 border-dashed border-white/10" />
            </div>

            {/* Bottom section: QR + Barcode + Actions */}
            <div className="flex items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                {/* QR Code */}
                <div className="w-16 h-16 md:w-20 md:h-20 p-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
                  <FakeQRCode seed={booking.id} />
                </div>
                {/* Booking details */}
                <div className="space-y-1">
                  <div className="text-[8px] text-gray-600 font-mono uppercase">Booking Ref</div>
                  <div className={`text-sm font-mono font-black ${theme.text}`}>{bookingCode}</div>
                  <div className="text-[8px] text-gray-500 font-mono">
                    ${tourData?.price || booking.price || '—'} / person
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-mono text-gray-400 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Details
                </button>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg text-[10px] font-mono text-red-400 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Cancel
                </button>
              </div>
            </div>

            {/* Barcode */}
            <div className="mt-4">
              <Barcode code={bookingCode + '-ISLA-NUBLAR'} />
            </div>
          </div>

          {/* Cancel confirmation overlay */}
          <AnimatePresence>
            {showCancelConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 rounded-2xl z-10"
              >
                <div className="text-center">
                  <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                  <h4 className="text-white font-bold font-mono text-sm mb-1">CANCEL EXPEDITION?</h4>
                  <p className="text-gray-400 text-xs mb-4">This action cannot be reversed. Your seat will be released.</p>
                  <div className="flex items-center gap-3 justify-center">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-xs text-gray-300 font-mono cursor-pointer"
                    >
                      Keep Booking
                    </button>
                    <button
                      onClick={() => onCancel(booking.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-xs text-white font-bold font-mono cursor-pointer"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===== BACK SIDE — Tour Details ===== */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl border ${theme.border} overflow-hidden`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={`h-1.5 ${theme.stripe}`} />
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.2em]">Mission Details</span>
                <h3 className="text-lg font-black font-mono text-white mt-1">{tourData?.name || booking.tour}</h3>
              </div>
              <button
                onClick={() => setIsFlipped(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {tourData && (
              <div className="space-y-3">
                <p className="text-gray-300 text-xs leading-relaxed">{tourData.description}</p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.04]">
                    <div className="text-[8px] text-gray-600 font-mono uppercase">Vehicle</div>
                    <div className="text-xs text-white font-mono mt-0.5">{tourData.vehicle.icon} {tourData.vehicle.name}</div>
                  </div>
                  <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.04]">
                    <div className="text-[8px] text-gray-600 font-mono uppercase">Duration</div>
                    <div className="text-xs text-white font-mono mt-0.5">{tourData.duration}</div>
                  </div>
                  <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.04]">
                    <div className="text-[8px] text-gray-600 font-mono uppercase">Max Group</div>
                    <div className="text-xs text-white font-mono mt-0.5">{tourData.maxGroupSize} guests</div>
                  </div>
                  <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.04]">
                    <div className="text-[8px] text-gray-600 font-mono uppercase">Age Req</div>
                    <div className="text-xs text-white font-mono mt-0.5">{tourData.ageRestriction ? `${tourData.ageRestriction}+` : 'All Ages'}</div>
                  </div>
                </div>

                {tourData.ageRestriction >= 16 && (
                  <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/15 rounded-lg">
                    <Skull className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span className="text-[10px] text-red-300 font-mono">High-risk expedition. Waiver signed.</span>
                  </div>
                )}

                {booking.notes && (
                  <div className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                    <div className="text-[8px] text-gray-600 font-mono uppercase mb-0.5">Notes</div>
                    <p className="text-[11px] text-gray-400">{booking.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===== MAIN COMPONENT =====
const MyBookings = () => {
  const { bookings, removeBooking } = useBookingStore();

  return (
    <section className="bg-gradient-to-b from-command-dark via-[#080c15] to-command-dark">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gray-600 text-[10px] font-mono uppercase tracking-[0.3em] mb-2">── Passenger Manifest ──</p>
          <h2 className="text-3xl md:text-5xl font-black font-mono text-white tracking-tight mb-3">
            MY <span className="text-amber-400">EXPEDITIONS</span>
          </h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="h-1 w-2 bg-amber-warning rounded-full animate-pulse" />
            <div className="h-0.5 w-24 bg-white/20 rounded" />
            <span className="h-1 w-2 bg-amber-warning rounded-full animate-pulse" />
          </div>
          {bookings.length > 0 && (
            <p className="text-gray-400 text-sm font-mono">
              {bookings.length} expedition{bookings.length > 1 ? 's' : ''} booked
            </p>
          )}
        </motion.div>

        {/* Boarding Passes */}
        <AnimatePresence mode="popLayout">
          {bookings.length > 0 ? (
            <div className="space-y-5">
              {bookings.map((booking, index) => (
                <BoardingPass
                  key={booking.id}
                  booking={booking}
                  index={index}
                  onCancel={removeBooking}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
                <Compass className="w-10 h-10 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold font-mono text-gray-400 mb-2">
                No expeditions booked.
              </h3>
              <p className="text-gray-600 text-sm font-mono mb-6">
                Are you brave enough?
              </p>
              <a
                href="#map-section"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-mono font-bold uppercase tracking-wider hover:bg-amber-500/25 transition-colors"
              >
                <MapPin className="w-4 h-4" /> Explore Tours <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MyBookings;
