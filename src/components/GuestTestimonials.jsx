import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, Quote, Shield, Clock, MapPin } from 'lucide-react';

const testimonials = [
  {
    name: 'Marcus Chen',
    avatar: 'MC',
    rating: 5,
    quote: "I looked a T-Rex in the eye from 10 meters away. It blinked first. Best $599 I've ever spent.",
    tour: 'APEX PREDATOR VIP NIGHT TOUR',
    tourTheme: 'red',
    date: 'Jan 2026',
    location: 'Zone 9, Isla Nublar',
  },
  {
    name: 'Sarah Nakamura',
    avatar: 'SN',
    rating: 5,
    quote: "My daughter fed a baby Triceratops by hand. She hasn't stopped talking about it for three weeks. Worth every penny.",
    tour: 'CRETACEOUS SAFARI',
    tourTheme: 'emerald',
    date: 'Dec 2025',
    location: 'Central Grasslands',
  },
  {
    name: 'Dr. James Wright',
    avatar: 'JW',
    rating: 4,
    quote: "As a paleontologist, I thought nothing could surprise me anymore. The Spinosaurus breaching 3 meters from our boat proved me spectacularly wrong.",
    tour: 'PRIMEVAL RIVER EXPEDITION',
    tourTheme: 'swamp',
    date: 'Feb 2026',
    location: 'Delta Swamplands',
  },
  {
    name: 'Elena Vasquez',
    avatar: 'EV',
    rating: 5,
    quote: "Swimming with Plesiosaurus in the submarine was like being inside a David Attenborough documentary. Absolutely magical and surreal.",
    tour: 'THE ABYSSAL GRACE VOYAGE',
    tourTheme: 'deep-ocean',
    date: 'Jan 2026',
    location: 'Underwater Caverns',
  },
  {
    name: 'Raj Patel',
    avatar: 'RP',
    rating: 5,
    quote: "The Mosasaurus feeding show soaked me completely. My phone died. I regret nothing. 13,000 PSI of pure adrenaline.",
    tour: 'THE LEVIATHAN FEEDING FRENZY',
    tourTheme: 'leviathan',
    date: 'Feb 2026',
    location: 'Aquatic Stadium',
  },
  {
    name: 'Lisa Andersen',
    avatar: 'LA',
    rating: 5,
    quote: "Walking across the sky bridge at 300 meters with Pterosaurs gliding beside you... I've never felt so alive and terrified simultaneously.",
    tour: 'AMBER CANOPY ASCENT',
    tourTheme: 'purple',
    date: 'Nov 2025',
    location: 'Aviary Sector',
  },
];

const themeColorMap = {
  red: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' },
  emerald: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  swamp: { bg: 'bg-lime-500/15', border: 'border-lime-500/30', text: 'text-lime-400', dot: 'bg-lime-400' },
  'deep-ocean': { bg: 'bg-cyan-500/15', border: 'border-cyan-400/30', text: 'text-cyan-300', dot: 'bg-cyan-300' },
  leviathan: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' },
  purple: { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-400' },
  green: { bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-400' },
  cyan: { bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', text: 'text-cyan-400', dot: 'bg-cyan-400' },
};

const avatarColors = [
  'from-red-600 to-orange-500',
  'from-emerald-600 to-teal-500',
  'from-lime-600 to-green-500',
  'from-cyan-600 to-blue-500',
  'from-red-700 to-rose-500',
  'from-purple-600 to-violet-500',
];

const TestimonialCard = ({ item, index }) => {
  const colors = themeColorMap[item.tourTheme] || themeColorMap.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-white/[0.03] rounded-xl border border-white/[0.06] p-6 hover:bg-white/[0.05] transition-all duration-300 group"
    >
      {/* Quote icon */}
      <Quote className="absolute top-4 right-4 w-8 h-8 text-white/[0.04] group-hover:text-white/[0.08] transition-colors" />

      {/* Header: Avatar + Name */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarColors[index]} flex items-center justify-center text-white font-bold text-sm font-mono shadow-lg`}>
          {item.avatar}
        </div>
        <div>
          <h4 className="text-white font-bold text-sm">{item.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
              ))}
            </div>
            <span className="text-gray-600 text-[10px] font-mono">·</span>
            <span className="text-gray-500 text-[10px] font-mono">{item.date}</span>
          </div>
        </div>
      </div>

      {/* Quote */}
      <p className="text-white text-sm leading-relaxed mb-4 italic">
        "{item.quote}"
      </p>

      {/* Tour Badge + Location */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider border ${colors.bg} ${colors.border} ${colors.text}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {item.tour}
        </span>
        <span className="text-gray-600 text-[10px] font-mono flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" /> {item.location}
        </span>
      </div>
    </motion.div>
  );
};

const GuestTestimonials = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section
      ref={containerRef}
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-command-dark via-[#0a0f1a] to-command-dark"
    >
      {/* Parallax decorative elements */}
      <motion.div
        style={{ y: parallaxY1 }}
        className="absolute top-20 -left-20 w-72 h-72 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: parallaxY2 }}
        className="absolute bottom-20 -right-20 w-96 h-96 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none"
      />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}
      />

      <motion.div style={{ opacity: bgOpacity }} className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white text-[10px] font-mono uppercase tracking-[0.3em] mb-2">── Field Reports ──</p>
            <h2 className="text-3xl md:text-5xl font-black font-mono text-white tracking-tight mb-3">
              SURVIVOR <span className="text-amber-400">TESTIMONIALS</span>
            </h2>
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="h-1 w-2 bg-amber-warning rounded-full animate-pulse" />
              <div className="h-0.5 w-24 bg-white/20 rounded" />
              <span className="h-1 w-2 bg-amber-warning rounded-full animate-pulse" />
            </div>
            <p className="text-white max-w-lg mx-auto text-sm">
              Real accounts from guests who lived to tell the tale. Verified by InGen Guest Relations.
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-6 mt-6 flex-wrap"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-white">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              <span><span className="text-white font-bold">99.97%</span> Survival Rate</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span><span className="text-white font-bold">4.9</span> Average Rating</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span><span className="text-white font-bold">12,847</span> Guests Served</span>
            </div>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((item, i) => (
            <TestimonialCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-white text-[10px] font-mono uppercase tracking-[0.2em]">
            Will you be the next to survive?
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GuestTestimonials;
