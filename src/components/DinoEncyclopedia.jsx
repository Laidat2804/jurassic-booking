import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Zap, Brain, Skull, Ruler, Weight, Wind, Clock, Leaf, Fish } from 'lucide-react';
import encyclopedia from '../data/encyclopedia.json';

// Import images
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

const typeFilters = [
  { key: 'all', label: 'ALL SPECIES', icon: '🦴' },
  { key: 'carnivore', label: 'CARNIVORE', icon: '🥩' },
  { key: 'herbivore', label: 'HERBIVORE', icon: '🌿' },
  { key: 'aquatic', label: 'AQUATIC', icon: '🌊' },
  { key: 'flying', label: 'FLYING', icon: '🦅' },
];

const typeColors = {
  carnivore: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', dot: 'bg-red-500' },
  herbivore: { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400', dot: 'bg-green-500' },
  aquatic: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', dot: 'bg-blue-500' },
  flying: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', dot: 'bg-purple-500' },
};

const DietIcon = ({ diet }) => {
  if (diet === 'Piscivore') return <Fish className="w-3 h-3" />;
  if (diet === 'Herbivore') return <Leaf className="w-3 h-3" />;
  return <Skull className="w-3 h-3" />;
};

// --- Stat Bar Component ---
const StatBar = ({ label, value, maxValue = 5, color = 'bg-jurassic-neon' }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-gray-400 w-20 sm:w-28 uppercase tracking-wider font-mono">{label}</span>
    <div className="flex-1 flex gap-1">
      {Array.from({ length: maxValue }).map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-sm transition-all duration-300 ${
            i < value ? color : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  </div>
);

// --- DinoCard Component ---
const DinoCard = ({ dino, onClick }) => {
  const colors = typeColors[dino.type] || typeColors.carnivore;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-command-light/50 backdrop-blur-sm hover:border-jurassic-neon/50 transition-colors duration-300 relative"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={dinoImages[dino.imageKey]}
          alt={dino.species}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-command-dark via-transparent to-transparent" />

        {/* Type Badge */}
        <div className={`absolute top-3 right-3 ${colors.bg} ${colors.border} border px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wider ${colors.text}`}>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
            {dino.type}
          </div>
        </div>

        {/* Status */}
        <div className="absolute top-3 left-3 bg-green-900/60 border border-green-500/30 px-2 py-0.5 rounded text-xs font-mono text-green-400 uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {dino.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white font-mono tracking-tight group-hover:text-jurassic-neon transition-colors">
            {dino.species}
          </h3>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-0.5">
            "{dino.nickname}" • {dino.era}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
          <div className="text-center">
            <div className="text-xs text-gray-500 font-mono uppercase">Height</div>
            <div className="text-sm text-white font-bold">{dino.height}</div>
          </div>
          <div className="text-center border-x border-white/5">
            <div className="text-xs text-gray-500 font-mono uppercase">Weight</div>
            <div className="text-sm text-white font-bold">{dino.weight}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 font-mono uppercase">Speed</div>
            <div className="text-sm text-white font-bold">{dino.speed}</div>
          </div>
        </div>

        {/* Danger indicator */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Threat</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-1.5 rounded-sm ${
                  i < dino.dangerLevel
                    ? dino.dangerLevel >= 4 ? 'bg-red-500' : dino.dangerLevel >= 3 ? 'bg-amber-500' : 'bg-green-500'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl shadow-[inset_0_0_30px_rgba(132,204,22,0.05)]" />
    </motion.div>
  );
};

// --- Detail Modal ---
const DinoDetailModal = ({ dino, onClose }) => {
  const colors = typeColors[dino.type] || typeColors.carnivore;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-command-light border border-white/10 rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header Image */}
        <div className="relative h-56 md:h-72 overflow-hidden">
          <img
            src={dinoImages[dino.imageKey]}
            alt={dino.species}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-command-light via-transparent to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-red-500/50 hover:border-red-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Species Name Overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className={`inline-flex items-center gap-2 ${colors.bg} ${colors.border} border px-3 py-1 rounded-full text-xs font-mono uppercase ${colors.text} mb-2`}>
              <DietIcon diet={dino.diet} />
              {dino.diet} • {dino.era}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-mono text-white tracking-tight drop-shadow-lg">
              {dino.species}
            </h2>
            <p className="text-gray-300 text-sm font-mono mt-1">
              "{dino.nickname}"
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xs text-jurassic-neon font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
              <Shield className="w-3 h-3" /> Species Profile
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">{dino.description}</p>
          </div>

          {/* Physical Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Ruler, label: 'Height', value: dino.height },
              { icon: Ruler, label: 'Length', value: dino.length },
              { icon: Weight, label: 'Weight', value: dino.weight },
              { icon: Wind, label: 'Speed', value: dino.speed },
            ].map((stat, i) => (
              <div key={i} className="bg-command/50 border border-white/5 rounded-lg p-3 text-center">
                <stat.icon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <div className="text-xs text-gray-500 font-mono uppercase">{stat.label}</div>
                <div className="text-white font-bold text-sm mt-1">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Behavioral Stats */}
          <div className="bg-command/50 border border-white/5 rounded-lg p-4 space-y-3">
            <h3 className="text-xs text-jurassic-neon font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Behavioral Analysis
            </h3>
            <StatBar label="Danger Level" value={dino.dangerLevel} color="bg-red-500" />
            <StatBar label="Intelligence" value={dino.intelligence} color="bg-blue-500" />
            <StatBar label="Aggression" value={dino.aggressiveness} color="bg-amber-500" />
          </div>

          {/* Fun Fact */}
          <div className="bg-jurassic-neon/5 border border-jurassic-neon/20 rounded-lg p-4">
            <h3 className="text-xs text-jurassic-neon font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
              <Brain className="w-3 h-3" /> Did You Know?
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed italic">"{dino.funFact}"</p>
          </div>

          {/* Habitat */}
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400">
              <span className="text-gray-500 font-mono uppercase text-xs">Habitat:</span>{' '}
              {dino.habitat}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Component ---
const DinoEncyclopedia = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDino, setSelectedDino] = useState(null);

  const filteredDinos =
    activeFilter === 'all'
      ? encyclopedia
      : encyclopedia.filter((d) => d.type === activeFilter);

  return (
    <section id="encyclopedia" className="py-20 bg-command-dark/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-jurassic-neon text-xs font-mono uppercase tracking-[0.3em] mb-3">
              InGen Classified Database
            </p>
            <h2 className="text-3xl md:text-5xl font-bold font-mono text-white tracking-tighter">
              DINO ENCYCLOPEDIA
            </h2>
            <div className="flex justify-center items-center gap-2 mt-4 mb-2">
              <span className="h-1 w-2 bg-jurassic-neon rounded-full animate-pulse" />
              <div className="h-0.5 w-24 bg-white/20 rounded" />
              <span className="h-1 w-2 bg-jurassic-neon rounded-full animate-pulse" />
            </div>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm">
              Access the complete InGen species database. Click on any specimen for full behavioral analysis and containment protocols.
            </p>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {typeFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-mono uppercase tracking-wider border transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                activeFilter === filter.key
                  ? 'bg-jurassic-neon/20 border-jurassic-neon/50 text-jurassic-neon shadow-lg shadow-jurassic-neon/10'
                  : 'bg-command-light/50 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Species Count */}
        <div className="text-center mb-6">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            {filteredDinos.length} Species Cataloged
          </span>
        </div>

        {/* Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDinos.map((dino) => (
              <DinoCard
                key={dino.id}
                dino={dino}
                onClick={() => setSelectedDino(dino)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        <AnimatePresence>
          {filteredDinos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-gray-500 font-mono text-sm">
                No species found in this classification.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDino && (
          <DinoDetailModal
            dino={selectedDino}
            onClose={() => setSelectedDino(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default DinoEncyclopedia;
