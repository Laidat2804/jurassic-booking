import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Terminal, ChevronRight, Zap } from 'lucide-react';
import tours from '../data/tours.json';
import encyclopedia from '../data/encyclopedia.json';
import useBookingStore from '../store/useBookingStore';

// Find matching dino from encyclopedia for a tour
const findDinoForTour = (tour) => encyclopedia.find(d => d.id === tour.anchorDinoId);

// ===== CHATBOT KNOWLEDGE BASE =====
const greetings = [
  "Welcome to InGen Guest Relations Terminal v4.2. How may I assist you today?",
  "InGen Corp. — Your safety is our priority*. (*Terms and conditions apply.) How can I help?",
  "System online. All containment sectors nominal. What would you like to know?",
];

const quickReplies = [
  "🦕 Show all tours",
  "🔥 Most thrilling tour?",
  "👨‍👩‍👧 Family-friendly tours?",
  "💰 Cheapest tour?",
  "☠️ Most dangerous tour?",
  "🌊 Aquatic tours?",
];

// Maps keywords to response generators
const getResponse = (input, setActiveTour, setActiveZone) => {
  const lower = input.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|xin chào|chào)/.test(lower)) {
    return {
      text: "Greetings, guest. Welcome to Jurassic World — where 65 million years of evolution are at your fingertips. What can I help you with?",
      suggestions: ["🦕 Show all tours", "🔥 Most thrilling tour?"],
    };
  }

  // Show all tours
  if (lower.includes('all tour') || lower.includes('show tour') || lower.includes('list tour') || lower === '🦕 show all tours') {
    const tourList = tours.map(t => `• **${t.name}** — $${t.price} (${t.duration})`).join('\n');
    return {
      text: `Sector scan complete. ${tours.length} active tour packages detected:\n\n${tourList}\n\nWhich tour interests you?`,
      suggestions: ["🔥 Most thrilling tour?", "👨‍👩‍👧 Family-friendly tours?"],
    };
  }

  // Most thrilling / dangerous
  if (lower.includes('thrill') || lower.includes('danger') || lower.includes('scariest') || lower.includes('scary') || lower.includes('extreme') || lower === '🔥 most thrilling tour?' || lower === '☠️ most dangerous tour?') {
    const apex = tours.find(t => t.id === 'apex-predator');
    return {
      text: `⚠️ **APEX PREDATOR VIP NIGHT TOUR** — Threat Level: MAXIMUM\n\nEnter Zone 9 after sunset to witness T-Rex feeding time. Absolute silence required. One wrong move and... well.\n\n• Price: **$${apex.price}**\n• Age: **18+** only\n• Survival rate: 99.97%\n\n_"The most terrifying 2 hours of your life."_ — InGen Marketing\n\nShall I book this tour?`,
      suggestions: ["📋 Book Apex Predator", "👨‍👩‍👧 Something safer?"],
      tourRef: apex,
    };
  }

  // Family friendly
  if (lower.includes('family') || lower.includes('kid') || lower.includes('child') || lower.includes('safe') || lower === '👨‍👩‍👧 family-friendly tours?' || lower.includes('something safer')) {
    const familyTours = tours.filter(t => t.familyFriendly);
    const list = familyTours.map(t => `• **${t.name}** — $${t.price} (${t.duration})`).join('\n');
    return {
      text: `Family-approved packages with enhanced safety protocols:\n\n${list}\n\n✅ All tours include InGen safety staff escort, child-friendly zones, and emergency extraction systems.\n\nThe **Cretaceous Safari** is our most popular family choice — kids can hand-feed baby Triceratops!`,
      suggestions: ["📋 Book Cretaceous Safari", "💰 Cheapest tour?"],
    };
  }

  // Cheapest / budget
  if (lower.includes('cheap') || lower.includes('budget') || lower.includes('lowest price') || lower === '💰 cheapest tour?') {
    const sorted = [...tours].sort((a, b) => a.price - b.price);
    const cheapest = sorted[0];
    return {
      text: `Best value package: **${cheapest.name}**\n\n• Price: **$${cheapest.price}** — lowest in our catalog\n• Duration: ${cheapest.duration}\n• Family-friendly: ${cheapest.familyFriendly ? 'Yes ✅' : 'No'}\n\nFull tour lineup by price:\n${sorted.map(t => `• $${t.price} — ${t.name}`).join('\n')}`,
      suggestions: ["📋 Book " + cheapest.name.split(':')[0], "🔥 Most thrilling tour?"],
    };
  }

  // Aquatic / water
  if (lower.includes('aqua') || lower.includes('water') || lower.includes('ocean') || lower.includes('swim') || lower.includes('submarine') || lower.includes('diving') || lower === '🌊 aquatic tours?') {
    const aquatic = tours.filter(t => ['abyssal-grace', 'leviathan-frenzy', 'primeval-river'].includes(t.id));
    const list = aquatic.map(t => `• **${t.name}** — $${t.price}`).join('\n');
    return {
      text: `Aquatic sector tours detected:\n\n${list}\n\n🔵 **Abyssal Grace** — peaceful submarine dive with Plesiosaurus (family-friendly)\n🔴 **Leviathan Frenzy** — Mosasaurus feeding show, 13,000 PSI bite (you WILL get soaked)\n🟢 **Primeval River** — Spinosaurus territory by armored hovercraft (maximum danger)\n\nWhich aquatic adventure calls to you?`,
      suggestions: ["📋 Book Abyssal Grace", "📋 Book Leviathan Frenzy"],
    };
  }

  // Flying / aerial
  if (lower.includes('fly') || lower.includes('aerial') || lower.includes('ptero') || lower.includes('sky') || lower.includes('bird')) {
    const aerial = tours.filter(t => ['amber-canopy', 'coastal-cliffs'].includes(t.id));
    const list = aerial.map(t => `• **${t.name}** — $${t.price}`).join('\n');
    return {
      text: `Aerial sector packages:\n\n${list}\n\n🟣 **Amber Canopy** — Walk through the Aviary at 300m altitude with Pterosaurs\n🔵 **Coastal Cliffs** — Watch Pteranodon dive at 100km/h from suspended gondola\n\nBoth offer breathtaking views. Acrophobia disclaimer applies.`,
      suggestions: ["📋 Book Amber Canopy", "📋 Book Coastal Cliffs"],
    };
  }

  // T-Rex specific
  if (lower.includes('t-rex') || lower.includes('tyrannosaurus') || lower.includes('trex') || lower.includes('t rex')) {
    const apex = tours.find(t => t.id === 'apex-predator');
    return {
      text: `🦖 **Tyrannosaurus Rex** — The Apex Predator herself.\n\nLength: 12m | Weight: 8 tons | Bite Force: 12,800 PSI\n\nAvailable on: **APEX PREDATOR VIP NIGHT TOUR**\n• Enter Zone 9 at night\n• Witness feeding time\n• $${apex.price} | 18+ only\n\n_"When the T-Rex doesn't want to be found, she finds you."_`,
      suggestions: ["📋 Book Apex Predator", "🦕 Show all tours"],
      tourRef: apex,
    };
  }

  // Booking intent
  if (lower.includes('book')) {
    const matchedTour = tours.find(t => lower.includes(t.name.toLowerCase().split(' ')[0].toLowerCase()) || lower.includes(t.id));
    if (matchedTour) {
      return {
        text: `Initiating booking protocol for **${matchedTour.name}**...\n\n✅ Opening tour details panel now. Please complete the registration form.\n\n⚠️ ${matchedTour.warningMessage}`,
        suggestions: ["🦕 Show all tours"],
        action: () => {
          const dino = findDinoForTour(matchedTour);
          if (dino) setActiveZone(dino);
          setActiveTour(matchedTour);
        },
      };
    }
    return {
      text: "Which tour would you like to book? I can open the registration form for you.",
      suggestions: ["🦕 Show all tours", "🔥 Most thrilling tour?"],
    };
  }

  // Specific dino lookup
  const matchedDino = encyclopedia.find(d =>
    lower.includes(d.species.toLowerCase()) || lower.includes(d.id.toLowerCase())
  );
  if (matchedDino) {
    const relatedTour = tours.find(t => t.anchorDinoId === matchedDino.id);
    return {
      text: `🔬 **${matchedDino.species}** — *${matchedDino.type}*\n\nBio-scan data retrieved from InGen database.\n${relatedTour ? `\nFeatured in: **${relatedTour.name}** ($${relatedTour.price})` : ''}\n\nWould you like more details or to book a tour?`,
      suggestions: relatedTour ? [`📋 Book ${relatedTour.name.split(' ')[0]}`, "🦕 Show all tours"] : ["🦕 Show all tours"],
      tourRef: relatedTour,
    };
  }

  // Price / cost queries
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    const sorted = [...tours].sort((a, b) => a.price - b.price);
    return {
      text: `Current pricing matrix:\n\n${sorted.map(t => `• **$${t.price}** — ${t.name} (${t.duration})`).join('\n')}\n\nPrices include InGen liability insurance and emergency extraction.`,
      suggestions: ["💰 Cheapest tour?", "🔥 Most thrilling tour?"],
    };
  }

  // Help / what can you do
  if (lower.includes('help') || lower.includes('what can') || lower.includes('options') || lower.includes('?') && lower.length < 10) {
    return {
      text: "InGen Guest Relations Terminal — available commands:\n\n• Ask about specific **dinosaurs** (T-Rex, Triceratops, etc.)\n• Request **tour recommendations** (thrill, family, aquatic, aerial)\n• Check **pricing** and tour details\n• **Book** a tour directly\n• Ask about **safety** protocols\n\nOr just tell me what you're looking for!",
      suggestions: quickReplies.slice(0, 4),
    };
  }

  // Safety
  if (lower.includes('safety') || lower.includes('safe')) {
    return {
      text: "InGen Safety Protocols — Clearance Level: Guest\n\n• All vehicles are **reinforced titanium-glass** composites\n• Each zone has **24/7 armed response teams**\n• Emergency extraction available within **90 seconds**\n• Electrified containment fences: **10,000V - 120,000V**\n• Overall guest survival rate: **99.97%**\n\n_*The 0.03% were due to guests ignoring safety protocols._",
      suggestions: ["👨‍👩‍👧 Family-friendly tours?", "☠️ Most dangerous tour?"],
    };
  }

  // Default fallback
  const fallbacks = [
    "Signal unclear. Could you rephrase your query? Try asking about tours, dinosaurs, or pricing.",
    "InGen database returned no matches. Try asking about specific dinosaurs or tour packages.",
    "Command not recognized. Type 'help' for available options, or ask me about any tour or dinosaur species.",
  ];
  return {
    text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
    suggestions: quickReplies.slice(0, 3),
  };
};

// ===== FORMAT MESSAGE TEXT (simple markdown) =====
const FormatText = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Bold
        let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
        // Italic
        formatted = formatted.replace(/_(.*?)_/g, '<em class="text-gray-400 italic">$1</em>');
        // Bullet
        if (formatted.startsWith('• ')) {
          return <div key={i} className="pl-2" dangerouslySetInnerHTML={{ __html: formatted }} />;
        }
        if (formatted.trim() === '') return <div key={i} className="h-1" />;
        return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
      })}
    </div>
  );
};

// ===== MAIN CHATBOT COMPONENT =====
const InGenChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState(quickReplies.slice(0, 4));
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { setActiveTour, setActiveZone } = useBookingStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Show greeting on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ role: 'bot', text: greeting, time: new Date() }]);
        setIsTyping(false);
      }, 600);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    // Add user message
    const userMsg = { role: 'user', text: msg, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setSuggestions([]);

    // Simulate typing delay
    const delay = 400 + Math.random() * 800;
    setTimeout(() => {
      const response = getResponse(msg, setActiveTour, setActiveZone);

      // Execute action if any
      if (response.action) {
        setTimeout(() => response.action(), 500);
      }

      setMessages(prev => [...prev, { role: 'bot', text: response.text, time: new Date() }]);
      setSuggestions(response.suggestions || []);
      setIsTyping(false);
    }, delay);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-[70] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/30 cursor-pointer group"
          >
            <Terminal className="w-6 h-6 text-black" />
            {/* Ping animation */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-black animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[70] w-full sm:w-[380px] sm:max-w-[calc(100vw-2rem)] h-[85vh] sm:h-[560px] sm:max-h-[calc(100vh-4rem)] bg-[#0a0e14] sm:rounded-2xl border-t sm:border border-white/10 shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500/10 to-transparent border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-bold font-mono flex items-center gap-1.5">
                    InGen AI
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  </h3>
                  <p className="text-gray-500 text-[9px] font-mono uppercase tracking-wider">Guest Relations Terminal</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.role === 'user'
                    ? 'bg-amber-500/15 border border-amber-500/20 rounded-2xl rounded-br-md px-3.5 py-2.5'
                    : 'bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-md px-3.5 py-2.5'
                  }`}>
                    {msg.role === 'bot' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <ChevronRight className="w-2.5 h-2.5 text-amber-400" />
                        <span className="text-[9px] text-amber-400/60 font-mono uppercase">INGEN SYS</span>
                      </div>
                    )}
                    <div className={`text-[13px] leading-relaxed ${msg.role === 'user' ? 'text-amber-100' : 'text-gray-300'}`}>
                      {msg.role === 'bot' ? <FormatText text={msg.text} /> : msg.text}
                    </div>
                    <div className={`text-[9px] font-mono mt-1.5 ${msg.role === 'user' ? 'text-amber-400/40 text-right' : 'text-gray-600'}`}>
                      {formatTime(msg.time)}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-3 py-2 border-t border-white/[0.04] flex flex-wrap gap-1.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="px-2.5 py-1 bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.06] hover:border-amber-500/20 rounded-full text-[10px] font-mono text-gray-400 hover:text-amber-300 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="px-3 py-3 border-t border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl border border-white/[0.08] focus-within:border-amber-500/30 transition-colors px-3 py-1.5">
                <span className="text-amber-500/50 text-xs font-mono select-none">&gt;_</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a command..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none font-mono"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    input.trim()
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'bg-white/5 text-gray-600'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[8px] text-gray-700 font-mono text-center mt-1.5">
                InGen Corp. AI — All responses are simulated
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InGenChatbot;
