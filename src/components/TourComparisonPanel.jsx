import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Trash2, Shield, Clock, Users, DollarSign, Skull, Heart,
  AlertTriangle, Zap, ChevronRight, BarChart3
} from 'lucide-react';
import useBookingStore from '../store/useBookingStore';
import tours from '../data/tours.json';
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

const tourThemeColors = {
  green: { main: '#84cc16', bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-400' },
  purple: { main: '#a855f7', bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400' },
  red: { main: '#ef4444', bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400' },
  emerald: { main: '#10b981', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  cyan: { main: '#06b6d4', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  swamp: { main: '#a3e635', bg: 'bg-lime-500/15', border: 'border-lime-500/30', text: 'text-lime-400' },
  'deep-ocean': { main: '#22d3ee', bg: 'bg-cyan-500/15', border: 'border-cyan-400/30', text: 'text-cyan-300' },
  leviathan: { main: '#dc2626', bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400' },
};

const statLabels = ['Thrill', 'Safety', 'Duration', 'Value', 'Exclusivity'];
const statKeys = ['thrill', 'safety', 'duration', 'value', 'exclusivity'];

// ===== SVG RADAR CHART =====
const RadarChart = ({ toursData }) => {
  const cx = 150, cy = 150, maxR = 110;
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2;

  const getPoint = (index, value) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 10) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Grid rings
  const rings = [2, 4, 6, 8, 10];

  return (
    <svg viewBox="-50 -10 400 320" className="w-full max-w-sm mx-auto">
      {/* Background grid */}
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={Array.from({ length: 5 }, (_, i) => {
            const p = getPoint(i, ring);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {Array.from({ length: 5 }, (_, i) => {
        const p = getPoint(i, 10);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
      })}

      {/* Axis labels */}
      {statLabels.map((label, i) => {
        const p = getPoint(i, 12.2);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">
            {label.toUpperCase()}
          </text>
        );
      })}

      {/* Tour polygons */}
      {toursData.map((tour, tIdx) => {
        const color = tourThemeColors[tour.theme]?.main || '#ffffff';
        const stats = tour.comparisonStats;
        if (!stats) return null;
        const points = statKeys.map((key, i) => {
          const p = getPoint(i, stats[key]);
          return `${p.x},${p.y}`;
        }).join(' ');

        return (
          <g key={tour.id}>
            <polygon points={points} fill={color} fillOpacity={0.12} stroke={color} strokeWidth="2" strokeOpacity={0.8} />
            {statKeys.map((key, i) => {
              const p = getPoint(i, stats[key]);
              return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke="black" strokeWidth="1" />;
            })}
          </g>
        );
      })}
    </svg>
  );
};

// ===== DANGER METER =====
const DangerMeter = ({ ageRestriction }) => {
  let level = 1;
  if (ageRestriction >= 18) level = 5;
  else if (ageRestriction >= 16) level = 4;
  else if (ageRestriction >= 12) level = 3;
  else if (ageRestriction >= 10) level = 2;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Skull key={i} className={`w-3.5 h-3.5 ${i <= level ? 'text-red-400' : 'text-gray-700'}`} />
      ))}
    </div>
  );
};

// ===== FLOATING COMPARE BAR =====
const FloatingCompareBar = () => {
  const { compareTours, openCompare, clearCompare } = useBookingStore();
  const getDino = (dinoId) => encyclopedia.find(d => d.id === dinoId);

  if (compareTours.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] bg-black/70 backdrop-blur-xl border border-white/15 rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl shadow-black/60"
    >
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">
          Compare ({compareTours.length}/3)
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {compareTours.map(tour => {
          const dino = getDino(tour.anchorDinoId);
          const img = dino ? dinoImages[dino.imageKey] : null;
          return (
            <div key={tour.id} className="w-9 h-9 rounded-full border-2 border-white/20 overflow-hidden bg-black/50">
              {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : null}
            </div>
          );
        })}
        {Array.from({ length: 3 - compareTours.length }, (_, i) => (
          <div key={`empty-${i}`} className="w-9 h-9 rounded-full border-2 border-dashed border-white/10" />
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openCompare}
        disabled={compareTours.length < 2}
        className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
          compareTours.length >= 2
            ? 'bg-amber-500 text-black hover:bg-amber-400'
            : 'bg-white/10 text-gray-500 cursor-not-allowed'
        }`}
      >
        Compare Now
      </motion.button>

      <button onClick={clearCompare} className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ===== MAIN COMPARISON PANEL =====
const TourComparisonPanel = () => {
  const { compareTours, isCompareOpen, closeCompare, clearCompare, setActiveTour, toggleCompareTour } = useBookingStore();
  const getDino = (dinoId) => encyclopedia.find(d => d.id === dinoId);

  // Body scroll lock
  useEffect(() => {
    if (isCompareOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCompareOpen]);

  return (
    <>
      {/* Floating Bar */}
      <AnimatePresence>
        {compareTours.length > 0 && !isCompareOpen && <FloatingCompareBar />}
      </AnimatePresence>

      {/* Full Panel */}
      <AnimatePresence>
        {isCompareOpen && compareTours.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-sm overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-gray-600 text-[10px] font-mono uppercase tracking-[0.3em] mb-1">── Tactical Analysis ──</p>
                  <h2 className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight">
                    TOUR COMPARISON
                  </h2>
                  <p className="text-gray-500 text-xs font-mono mt-1">
                    Analyzing {compareTours.length} tour packages
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { clearCompare(); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-lg text-xs text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                  <button
                    onClick={closeCompare}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-600/80 border border-white/10 hover:border-red-400 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5 text-white/80" />
                  </button>
                </div>
              </div>

              {/* Tour Cards Row */}
              <div className={`grid gap-4 mb-8 ${compareTours.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                {compareTours.map((tour) => {
                  const dino = getDino(tour.anchorDinoId);
                  const img = dino ? dinoImages[dino.imageKey] : null;
                  const color = tourThemeColors[tour.theme] || tourThemeColors.green;

                  return (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative rounded-xl border overflow-hidden ${color.border} bg-white/[0.02]`}
                    >
                      {/* Tour Image Header */}
                      <div className="relative h-40 overflow-hidden">
                        {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <button
                          onClick={() => toggleCompareTour(tour)}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-red-600/80 transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5 text-white/80" />
                        </button>
                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="text-base font-black font-mono text-white leading-tight">{tour.name}</h3>
                          <p className={`text-xs ${color.text} mt-0.5`}>{tour.subtitle}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="p-4 space-y-3">
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> Price
                          </span>
                          <span className="text-xl font-black font-mono text-white">${tour.price}</span>
                        </div>

                        <div className="w-full h-px bg-white/5" />

                        {/* Duration */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Duration
                          </span>
                          <span className="text-sm font-mono text-gray-300">{tour.duration}</span>
                        </div>

                        {/* Group Size */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider flex items-center gap-1">
                            <Users className="w-3 h-3" /> Max Group
                          </span>
                          <span className="text-sm font-mono text-gray-300">{tour.maxGroupSize}</span>
                        </div>

                        {/* Danger Level */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Danger
                          </span>
                          <DangerMeter ageRestriction={tour.ageRestriction} />
                        </div>

                        {/* Family Friendly */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider flex items-center gap-1">
                            <Heart className="w-3 h-3" /> Family
                          </span>
                          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                            tour.familyFriendly
                              ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
                              : 'text-red-400 bg-red-500/15 border-red-500/30'
                          }`}>
                            {tour.familyFriendly ? '✓ YES' : '✗ NO'}
                          </span>
                        </div>

                        {/* Age Restriction */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Age Req
                          </span>
                          <span className="text-xs font-mono text-gray-300">
                            {tour.ageRestriction ? `${tour.ageRestriction}+` : 'All Ages'}
                          </span>
                        </div>

                        <div className="w-full h-px bg-white/5" />

                        {/* Comparison Stats Bars */}
                        {tour.comparisonStats && statKeys.map((key, i) => (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">{statLabels[i]}</span>
                              <span className={`text-[10px] font-mono font-bold ${color.text}`}>{tour.comparisonStats[key]}/10</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${tour.comparisonStats[key] * 10}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: color.main }}
                              />
                            </div>
                          </div>
                        ))}

                        {/* Book CTA */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            closeCompare();
                            setActiveTour(tour);
                          }}
                          className={`w-full mt-2 py-3 rounded-lg font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer transition-colors ${color.bg} ${color.border} border ${color.text} hover:bg-white/10`}
                        >
                          <Zap className="w-3.5 h-3.5" /> Book This Tour <ChevronRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Radar Chart Section */}
              <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6 md:p-8">
                <h3 className="text-[10px] text-amber-400 font-mono uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
                  <BarChart3 className="w-3 h-3" /> Tactical Radar Analysis
                </h3>
                <p className="text-gray-500 text-[10px] font-mono mb-4">Multi-axis performance comparison</p>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 max-w-md mx-auto w-full">
                    <RadarChart toursData={compareTours} />
                  </div>

                  {/* Legend */}
                  <div className="flex-shrink-0 space-y-2">
                    {compareTours.map(tour => {
                      const color = tourThemeColors[tour.theme] || tourThemeColors.green;
                      return (
                        <div key={tour.id} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: color.main }} />
                          <span className="text-xs font-mono text-gray-300 truncate max-w-[200px]">{tour.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TourComparisonPanel;
