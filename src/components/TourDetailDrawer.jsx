import { useState, useEffect, useRef } from 'react';
import useBookingStore from '../store/useBookingStore';
import { motion, AnimatePresence, animate } from 'framer-motion';
import {
  X, AlertTriangle, Shield, Calendar, Phone, User, CheckCircle,
  MapPin, Clock, Users, ChevronRight, Star, Eye, Gift,
  Activity, Gauge, Thermometer, Wind, Mountain, Heart, Skull,
  Volume2, Zap, Footprints, TreePine, Binoculars, Baby,
  Waves, Anchor, Radar, Droplets, CloudFog, Lock, Crosshair
} from 'lucide-react';
import encyclopedia from '../data/encyclopedia.json';

// Image imports
import argentinosaurusImg from '../assets/Argentinosaurus.jpg';
import triceratopsImg from '../assets/Triceratops.jpg';
import tyrannosaurusImg from '../assets/Tyrannosaurus.jpg';
import spinosaurusImg from '../assets/Spinosaurus.jpg';
import plesiosaurusImg from '../assets/Plesiosaurus.jpg';
import mosasaurusImg from '../assets/Mosasaurus.jpg';
import pteranodonImg from '../assets/Pteranodon.jpg';
import pterosaurImg from '../assets/Pterosaur.jpg';

// Video imports
import argentinosaurusVid from '../assets/Argentinosaurus.mp4';
import triceratopsVid from '../assets/Triceratops.mp4';
import tyrannosaurusVid from '../assets/T-rex.mp4';
import spinosaurusVid from '../assets/Spinosaurus.mp4';
import plesiosaurusVid from '../assets/Plesiosaurus.mp4';
import mosasaurusVid from '../assets/Mosasaurus.mp4';
import pteranodonVid from '../assets/Pteranodon.mp4';
import pterosaurVid from '../assets/Pterosaur.mp4';

const dinoImages = {
  argentinosaurus: argentinosaurusImg,
  triceratops: triceratopsImg,
  tyrannosaurus: tyrannosaurusImg,
  spinosaurus: spinosaurusImg,
  plesiosaurus: plesiosaurusImg,
  mosasaurus: mosasaurusImg,
  pteranodon: pteranodonImg,
  pterosaur: pterosaurImg,
};

const dinoVideos = {
  argentinosaurus: argentinosaurusVid,
  triceratops: triceratopsVid,
  tyrannosaurus: tyrannosaurusVid,
  spinosaurus: spinosaurusVid,
  plesiosaurus: plesiosaurusVid,
  mosasaurus: mosasaurusVid,
  pteranodon: pteranodonVid,
  pterosaur: pterosaurVid,
};

// ===== THEME SYSTEM =====
const tourThemes = {
  green: {
    accent: 'text-green-400',
    accentBg: 'bg-green-900/40 border-green-500/30',
    gradientFrom: '#84cc16', gradientTo: '#f59e0b',
    ctaBg: 'bg-amber-warning hover:bg-amber-400', ctaText: 'text-command-dark',
    borderAccent: 'border-green-500/20',
  },
  purple: {
    accent: 'text-purple-400',
    accentBg: 'bg-purple-900/40 border-purple-500/30',
    gradientFrom: '#a855f7', gradientTo: '#f59e0b',
    ctaBg: 'bg-amber-warning hover:bg-amber-400', ctaText: 'text-command-dark',
    borderAccent: 'border-purple-500/20',
  },
  red: {
    accent: 'text-red-400',
    accentBg: 'bg-red-900/40 border-red-500/30',
    gradientFrom: '#ef4444', gradientTo: '#f97316',
    ctaBg: 'bg-red-600 hover:bg-red-500', ctaText: 'text-white',
    borderAccent: 'border-red-500/20',
  },
  emerald: {
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-900/40 border-emerald-500/30',
    gradientFrom: '#10b981', gradientTo: '#84cc16',
    ctaBg: 'bg-emerald-600 hover:bg-emerald-500', ctaText: 'text-white',
    borderAccent: 'border-emerald-500/20',
  },
  cyan: {
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-900/40 border-cyan-500/30',
    gradientFrom: '#06b6d4', gradientTo: '#67e8f9',
    ctaBg: 'bg-cyan-600 hover:bg-cyan-500', ctaText: 'text-white',
    borderAccent: 'border-cyan-500/20',
  },
  swamp: {
    accent: 'text-lime-400',
    accentBg: 'bg-lime-900/40 border-lime-600/30',
    gradientFrom: '#4d7c0f', gradientTo: '#a3e635',
    ctaBg: 'bg-lime-700 hover:bg-lime-600', ctaText: 'text-white',
    borderAccent: 'border-lime-500/20',
  },
  'deep-ocean': {
    accent: 'text-cyan-300',
    accentBg: 'bg-cyan-950/60 border-cyan-500/20',
    gradientFrom: '#0e7490', gradientTo: '#67e8f9',
    ctaBg: 'bg-cyan-700 hover:bg-cyan-600', ctaText: 'text-white',
    borderAccent: 'border-cyan-400/20',
  },
  leviathan: {
    accent: 'text-red-400',
    accentBg: 'bg-red-950/50 border-red-500/20',
    gradientFrom: '#991b1b', gradientTo: '#dc2626',
    ctaBg: 'bg-red-700 hover:bg-red-600', ctaText: 'text-white',
    borderAccent: 'border-red-500/20',
  },
};

// Dashboard helpers
const dashboardColors = {
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
  green: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' },
};

const roleBadge = {
  star: { label: 'STAR', icon: Star, color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
  included: { label: 'INCLUDED', icon: Eye, color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
  bonus: { label: 'BONUS', icon: Gift, color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' },
};

const dashboardIcons = {
  'Seismic Activity': Activity, 'Safety Level': Shield, 'Herd Size': Users,
  'Zone Temp': Thermometer, 'Wind Shear': Wind, 'Glass Integrity': Gauge,
  'Visibility': Eye, 'Altitude': Mountain, 'Hunger Level': Skull,
  'Fence Voltage': Zap, 'Decibel Meter': Volume2, 'Night Vision': Eye,
  'Herd Stress': Heart, 'Migration Path': Footprints, 'Bio-Scan': Binoculars,
  'Wind Velocity': Wind, 'Thermal Updrafts': Activity, 'Cable Tension': Gauge,
  'Sonar Depth': Radar, 'Water Turbidity': Droplets, 'Hull Integrity': Shield,
  'Fog Density': CloudFog, 'Oxygen Levels': Activity, 'Depth': Anchor,
  'Pressure Hull': Shield, 'Water Displacement': Waves, 'Target Lock': Radar,
  'Splash Radius': Droplets,
};

// --- Route Map SVG ---
const RouteMap = ({ points, tourId, theme }) => {
  if (!points || points.length < 2) return null;
  const t = tourThemes[theme] || tourThemes.green;
  const pathData = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x * 3} ${p.y * 2}`
  ).join(' ');

  return (
    <div className="relative bg-white/[0.03] rounded-lg border border-white/[0.06] p-3 overflow-hidden">
      <h4 className="text-[10px] text-jurassic-neon font-mono uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <MapPin className="w-3 h-3" /> Route Map
      </h4>
      <svg viewBox="0 0 300 160" className="w-full h-28" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id={`grid-${tourId}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id={`rg-${tourId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={t.gradientFrom} />
            <stop offset="100%" stopColor={t.gradientTo} />
          </linearGradient>
          <filter id={`gl-${tourId}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="300" height="160" fill={`url(#grid-${tourId})`} />
        <path d={pathData} fill="none" stroke={`url(#rg-${tourId})`} strokeWidth="2" strokeDasharray="6 3" opacity="0.4" />
        <path d={pathData} fill="none" stroke={`url(#rg-${tourId})`} strokeWidth="2.5" opacity="0.8" strokeLinecap="round" filter={`url(#gl-${tourId})`} />
        {points.map((point, i) => (
          <g key={i}>
            <circle cx={point.x * 3} cy={point.y * 2} r="7" fill="rgba(0,0,0,0.6)" stroke={t.gradientFrom} strokeWidth="1.5" />
            <circle cx={point.x * 3} cy={point.y * 2} r="3" fill={i === 0 || i === points.length - 1 ? t.gradientTo : t.gradientFrom} />
            <text x={point.x * 3} y={point.y * 2 - 12} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="6.5" fontFamily="monospace">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// --- Animated Price ---
const PriceCounter = ({ value }) => {
  const nodeRef = useRef();
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(0, value, {
      duration: 1.2,
      onUpdate: (v) => { node.textContent = Math.round(v); }
    });
    return () => controls.stop();
  }, [value]);
  return <span ref={nodeRef} />;
};

// ===== MAIN COMPONENT =====
const TourDetailDrawer = () => {
  const { activeTour, closeTourDrawer, addBooking } = useBookingStore();
  const [mode, setMode] = useState('details');
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', notes: '' });
  const [error, setError] = useState('');
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (activeTour) {
      setMode('details');
      setError('');
      setFormData({ name: '', phone: '', date: '', notes: '' });
      setWaiverAccepted(false);
      setVideoFailed(false);
    }
  }, [activeTour]);

  // Body scroll lock
  useEffect(() => {
    if (activeTour) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeTour]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      setError('Required fields missing. Complete all mandatory fields.');
      return;
    }
    if (new Date(formData.date) < new Date().setHours(0, 0, 0, 0)) {
      setError('Invalid temporal coordinates. Date cannot be in the past.');
      return;
    }
    if (activeTour.ageRestriction && !waiverAccepted) {
      setError('Liability waiver must be accepted for this sector.');
      return;
    }
    addBooking({
      ...formData, tour: activeTour.name, tourId: activeTour.id,
      price: activeTour.price, status: 'Confirmed'
    });
    setMode('success');
  };

  const getDinoById = (id) => encyclopedia.find(d => d.id === id);
  const theme = activeTour ? (tourThemes[activeTour.theme] || tourThemes.green) : tourThemes.green;
  const anchorDino = activeTour ? getDinoById(activeTour.anchorDinoId) : null;
  const bgImage = anchorDino ? dinoImages[anchorDino.imageKey] : null;
  const bgVideo = anchorDino ? dinoVideos[anchorDino.imageKey] : null;

  return (
    <AnimatePresence>
      {activeTour && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex bg-black"
        >
          {/* ============================================ */}
          {/*  LEFT COLUMN — INFO & BOOKING (40%)          */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`w-full md:w-[40%] h-full overflow-y-auto bg-black border-r ${theme.borderAccent} flex-shrink-0`}
          >
            <div className="p-6 md:p-8 lg:p-10 min-h-full">
              <AnimatePresence mode="wait">

                {/* ===== DETAILS VIEW ===== */}
                {mode === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.2em] bg-amber-500/15 border border-amber-500/25 text-amber-400 rounded-sm">
                        <Lock className="w-3 h-3 inline mr-1 -mt-0.5" />Mission Briefing
                      </span>
                      {activeTour.ageRestriction && (
                        <span className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.2em] bg-red-500/15 border border-red-500/25 text-red-400 rounded-sm">
                          <AlertTriangle className="w-3 h-3 inline mr-1 -mt-0.5" />Age {activeTour.ageRestriction}+
                        </span>
                      )}
                      {activeTour.familyFriendly && (
                        <span className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.2em] bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 rounded-sm">
                          <Heart className="w-3 h-3 inline mr-1 -mt-0.5" />Family
                        </span>
                      )}
                    </div>

                    {/* Tour Title */}
                    <div>
                      <p className="text-gray-600 text-[10px] font-mono uppercase tracking-[0.3em] mb-1">── Tour Package ──</p>
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-black font-mono text-white tracking-tight leading-[1.1]">
                        {activeTour.name}
                      </h1>
                      <p className={`text-base md:text-lg ${theme.accent} font-light mt-2`}>{activeTour.subtitle}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-mono flex-wrap">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeTour.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Max {activeTour.maxGroupSize}</span>
                      <span className="text-xl font-bold text-white">
                        $<PriceCounter value={activeTour.price} />
                        <span className="text-[10px] text-gray-500 font-normal ml-1">/person</span>
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                    {/* Description */}
                    <div>
                      <h3 className="text-[10px] text-jurassic-neon font-mono uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                        <Crosshair className="w-3 h-3" /> Mission Description
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm">{activeTour.description}</p>
                    </div>

                    {/* Vehicle */}
                    <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-4">
                      <h3 className="text-[10px] text-jurassic-neon font-mono uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                        <Shield className="w-3 h-3" /> Transport Vehicle
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl border ${theme.accentBg}`}>
                          {activeTour.vehicle.icon || '🚗'}
                        </div>
                        <div>
                          <div className="text-white font-bold font-mono">{activeTour.vehicle.name}</div>
                          <div className="text-gray-500 text-xs mt-1 leading-relaxed">{activeTour.vehicle.description}</div>
                        </div>
                      </div>
                    </div>

                    {/* Route Map */}
                    <RouteMap points={activeTour.routePoints} tourId={activeTour.id} theme={activeTour.theme} />

                    {/* Specimens */}
                    <div>
                      <h3 className="text-[10px] text-jurassic-neon font-mono uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                        <Eye className="w-3 h-3" /> Specimens Included
                      </h3>
                      <div className="space-y-2">
                        {activeTour.specimensIncluded.map((spec, idx) => {
                          const dino = spec.dinoId ? getDinoById(spec.dinoId) : null;
                          const badge = roleBadge[spec.role];
                          const BadgeIcon = badge.icon;
                          const displayName = dino ? dino.species : spec.customName;
                          const hasImage = dino && dinoImages[dino.imageKey];
                          return (
                            <div
                              key={spec.dinoId || `custom-${idx}`}
                              className="flex items-center gap-3 bg-white/[0.03] rounded-lg border border-white/[0.05] p-2.5 hover:bg-white/[0.06] transition-colors"
                            >
                              <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center bg-black/40">
                                {hasImage ? (
                                  <img src={dinoImages[dino.imageKey]} alt={displayName} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xl">{spec.customIcon || '🦴'}</span>
                                )}
                              </div>
                              <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-white font-bold text-xs font-mono truncate">{displayName}</span>
                                  <span className={`flex items-center gap-0.5 px-1.5 py-0.5 text-[8px] font-mono uppercase rounded border ${badge.color}`}>
                                    <BadgeIcon className="w-2 h-2" /> {badge.label}
                                  </span>
                                </div>
                                <p className="text-gray-500 text-[11px] mt-0.5 truncate">{spec.highlight}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dashboard */}
                    <div>
                      <h3 className="text-[10px] text-jurassic-neon font-mono uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                        <Activity className="w-3 h-3" /> Live Dashboard
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {activeTour.dashboard.map((item, i) => {
                          const colors = dashboardColors[item.color];
                          const IconComp = dashboardIcons[item.label] || Activity;
                          return (
                            <div key={i} className={`${colors.bg} border ${colors.border} rounded-lg p-2.5`}>
                              <div className="flex items-center gap-1 mb-0.5">
                                <IconComp className={`w-3 h-3 ${colors.text}`} />
                                <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">{item.label}</span>
                              </div>
                              <div className={`text-base font-bold font-mono ${colors.text}`}>{item.value}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Warning */}
                    <div className={`p-3 rounded-lg border text-xs leading-relaxed ${activeTour.ageRestriction
                        ? 'bg-red-500/10 border-red-500/15 text-red-300'
                        : activeTour.familyFriendly
                          ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-300'
                          : 'bg-amber-500/10 border-amber-500/15 text-amber-300'
                      }`}>
                      <div className="flex items-start gap-2">
                        {activeTour.familyFriendly
                          ? <Heart className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          : <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        }
                        <p>{activeTour.warningMessage}</p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-5">
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <div className="text-gray-500 text-[9px] font-mono uppercase tracking-widest">Total Per Person</div>
                          <div className="text-3xl font-black font-mono text-white mt-0.5">$<PriceCounter value={activeTour.price} /></div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-500 text-[9px] font-mono uppercase tracking-widest">Duration</div>
                          <div className="text-white font-mono mt-0.5">{activeTour.duration}</div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setMode('form')}
                        whileHover={activeTour.shakeButton ? {
                          x: [0, -2, 2, -2, 2, 0],
                          transition: { duration: 0.4, repeat: Infinity }
                        } : { scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full ${theme.ctaBg} ${theme.ctaText} font-bold py-4 rounded-lg transition-colors uppercase tracking-[0.15em] shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer`}
                      >
                        <Shield className="w-4 h-4" />
                        {activeTour.ctaLabel || 'CONFIRM SEAT RESERVATION'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ===== FORM VIEW ===== */}
                {mode === 'form' && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <button onClick={() => setMode('details')} className="text-xs text-gray-500 hover:text-white underline font-mono">
                      &larr; Back to Mission Briefing
                    </button>

                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight">PASSENGER MANIFEST</h2>
                      <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">{activeTour.name}</p>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2">
                        <AlertTriangle size={14} /> {error}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-600" size={16} />
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                          placeholder="Full Name"
                          className="w-full bg-white/[0.04] pl-10 p-3 rounded-lg text-white border border-white/10 focus:border-amber-warning focus:outline-none text-sm" />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-gray-600" size={16} />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                          placeholder="Comm Link (Phone)"
                          className="w-full bg-white/[0.04] pl-10 p-3 rounded-lg text-white border border-white/10 focus:border-amber-warning focus:outline-none text-sm" />
                      </div>
                      <div className="relative">
                        <Calendar 
                          className="absolute left-3 top-3.5 text-gray-600 cursor-pointer hover:text-white transition-colors z-10" 
                          size={16} 
                          onClick={() => dateInputRef.current?.showPicker()}
                        />
                        <input 
                          ref={dateInputRef}
                          type="date" 
                          name="date" 
                          value={formData.date} 
                          onChange={handleChange}
                          onClick={() => dateInputRef.current?.showPicker()}
                          className="w-full bg-white/[0.04] pl-10 p-3 rounded-lg text-white border border-white/10 focus:border-amber-warning focus:outline-none text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full" 
                        />
                      </div>
                      <textarea name="notes" value={formData.notes} onChange={handleChange}
                        placeholder="Additional Protocols (Notes)"
                        className="w-full bg-white/[0.04] p-3 rounded-lg text-white border border-white/10 focus:border-amber-warning focus:outline-none h-20 text-sm" />

                      {activeTour.ageRestriction && (
                        <label className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/15 rounded-lg cursor-pointer">
                          <input type="checkbox" checked={waiverAccepted}
                            onChange={(e) => setWaiverAccepted(e.target.checked)}
                            className="mt-1 accent-amber-warning scale-125" />
                          <span className="text-[11px] text-red-300 leading-relaxed">
                            {activeTour.ageRestriction >= 18
                              ? `I confirm all participants are aged ${activeTour.ageRestriction}+ and accept the Life Liability Waiver. InGen Corp is NOT responsible for injuries, trauma, or loss of life.`
                              : `I confirm all participants are aged ${activeTour.ageRestriction}+ and accept the liability waiver.`
                            }
                          </span>
                        </label>
                      )}
                    </div>

                    <motion.button
                      onClick={handleSubmit}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full ${theme.ctaBg} ${theme.ctaText} font-bold py-4 rounded-lg uppercase tracking-[0.15em] shadow-lg text-sm cursor-pointer`}
                    >
                      Confirm Extraction
                    </motion.button>
                  </motion.div>
                )}

                {/* ===== SUCCESS VIEW ===== */}
                {mode === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center min-h-[60vh] space-y-4"
                  >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
                      <CheckCircle className="w-20 h-20 text-green-500" />
                    </motion.div>
                    <h3 className="text-3xl font-black text-white font-mono tracking-tight">ACCESS GRANTED</h3>
                    <p className="text-gray-400 text-sm">
                      Your seat on <span className="text-amber-warning font-bold">{activeTour.name}</span> is confirmed.
                    </p>
                    <div className="p-5 bg-white/[0.03] rounded-lg text-left w-full space-y-3 border border-white/[0.06]">
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase font-mono tracking-widest">Confirmation</p>
                        <p className="font-mono text-amber-warning text-lg">{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase font-mono tracking-widest">Tour</p>
                        <p className="font-mono text-white text-sm">{activeTour.name}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase font-mono tracking-widest">Total</p>
                        <p className="font-mono text-green-400 text-lg">${activeTour.price}</p>
                      </div>
                    </div>
                    <motion.button onClick={closeTourDrawer}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-mono uppercase tracking-[0.2em] border border-white/10 cursor-pointer">
                      Close Terminal
                    </motion.button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/*  RIGHT COLUMN — VIDEO SHOWCASE (60%)         */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden md:block w-[60%] h-full relative overflow-hidden"
          >
            {/* Video / Fallback Image */}
            {bgVideo && !videoFailed ? (
              <video
                key={activeTour.id}
                autoPlay
                loop
                playsInline
                onError={() => setVideoFailed(true)}
                className="absolute inset-0 w-full h-full object-cover cinematic-zoom"
              >
                <source src={bgVideo} type="video/mp4" />
              </video>
            ) : bgImage ? (
              <img
                src={bgImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover cinematic-zoom"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            )}

            {/* Subtle bottom gradient — does NOT obscure center */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            {/* Subtle left edge blend into info panel */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

            {/* Tour name watermark on video */}
            <div className="absolute bottom-8 right-8 pointer-events-none select-none opacity-60">
              <p className="text-white/80 text-xs font-mono uppercase tracking-[0.3em] mb-1">Now Viewing</p>
              <p className={`text-lg font-black font-mono ${theme.accent}`}>{anchorDino?.species}</p>
            </div>

            {/* Close Button — top-right over video */}
            <button
              onClick={closeTourDrawer}
              className="absolute top-5 right-5 z-50 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-red-600/80 group-hover:border-red-400 transition-all duration-200">
                <X className="w-5 h-5 text-white/80 group-hover:text-white" />
              </div>
            </button>
          </motion.div>

          {/* Mobile close button (when video is hidden) */}
          <button
            onClick={closeTourDrawer}
            className="md:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TourDetailDrawer;
