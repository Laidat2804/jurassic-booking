import { motion } from 'framer-motion';
import jurassicLogo from '../assets/JurassicLogo.jpg';

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-jungle-dark to-command-dark flex items-center justify-center text-center px-4">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000&auto=format&fit=crop" 
          alt="Jungle Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-command-dark via-transparent to-jungle-dark/50 mix-blend-multiply"></div>
      </div>

      {/* HUD Logo */}
      <motion.img
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        src={jurassicLogo}
        alt="Jurassic World"
        className="absolute top-4 md:top-6 left-2/2 -translate-x-1/2 z-50 h-28 sm:h-36 md:h-48 w-auto mix-blend-lighten rounded-full"
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold font-mono tracking-tighter text-white mb-6 drop-shadow-[0_0_15px_rgba(4,120,87,0.8)]"
        >
          JURASSIC WORLD <span className="text-amber-warning">TRAVEL</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-300 mb-10 font-light tracking-wide"
        >
          EXPERIENCE THE PREHISTORIC MAJESTY
        </motion.p>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-amber-warning text-command-dark font-bold text-lg rounded-sm uppercase tracking-widest hover:bg-amber-400 transition-colors"
          onClick={() => document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' })}
        >
          Book Your Adventure
        </motion.button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-command to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
