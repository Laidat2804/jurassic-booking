import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud, Sun, CloudRain, CloudFog, Wind, Thermometer,
  Activity, AlertTriangle, ChevronUp, ChevronDown, Radio,
  Eye, MapPin, Waves, Zap, TreePine
} from 'lucide-react';

// ===== WEATHER CONFIGS =====
const weatherStates = [
  { id: 'clear', label: 'Clear Skies', icon: Sun, color: 'text-amber-400', bgGlow: 'bg-amber-500/10', temp: [31, 36] },
  { id: 'partly', label: 'Partly Cloudy', icon: Cloud, color: 'text-blue-300', bgGlow: 'bg-blue-500/10', temp: [28, 33] },
  { id: 'tropical-storm', label: 'Tropical Storm', icon: CloudRain, color: 'text-cyan-400', bgGlow: 'bg-cyan-500/10', temp: [24, 28] },
  { id: 'fog', label: 'Dense Fog', icon: CloudFog, color: 'text-gray-400', bgGlow: 'bg-gray-500/10', temp: [22, 26] },
  { id: 'trade-winds', label: 'Trade Winds', icon: Wind, color: 'text-emerald-400', bgGlow: 'bg-emerald-500/10', temp: [27, 31] },
];

const activityLevels = [
  { id: 'low', label: 'LOW', color: 'text-green-400', barColor: 'bg-green-400', barWidth: 'w-1/3', description: 'Minimal surface activity' },
  { id: 'medium', label: 'MEDIUM', color: 'text-amber-400', barColor: 'bg-amber-400', barWidth: 'w-2/3', description: 'Standard patrol patterns' },
  { id: 'high', label: 'HIGH', color: 'text-red-400', barColor: 'bg-red-400', barWidth: 'w-full', description: 'Heightened territorial behavior' },
];

const alerts = [
  { icon: '🦖', text: 'T-Rex spotted near Zone 9 perimeter', severity: 'critical' },
  { icon: '🌊', text: 'Mosasaurus feeding scheduled in 30 min', severity: 'info' },
  { icon: '⚡', text: 'Fence Section 7B voltage spike detected', severity: 'warning' },
  { icon: '🦕', text: 'Argentinosaurus herd migrating to Sector 4', severity: 'info' },
  { icon: '🔴', text: 'Spinosaurus sonar contact in river delta', severity: 'critical' },
  { icon: '🪺', text: 'Triceratops nesting activity confirmed', severity: 'info' },
  { icon: '⚠️', text: 'Pteranodon flock circling Cliff Station', severity: 'warning' },
  { icon: '🌧️', text: 'Tropical storm approaching western coast', severity: 'warning' },
  { icon: '🦎', text: 'Compy pack detected near Guest Lodge B', severity: 'warning' },
  { icon: '🔵', text: 'Plesiosaurus pod surfacing at Coral Bay', severity: 'info' },
  { icon: '🏗️', text: 'Containment breach drill in 45 min — Zone 3', severity: 'critical' },
  { icon: '🌡️', text: 'Thermal sensors indicate nest incubation peak', severity: 'info' },
];

// ===== DYNAMIC STATE LOGIC =====
const getWeatherByHour = (hour) => {
  // Simulate weather patterns through the day
  if (hour >= 6 && hour < 10) return weatherStates[0]; // Clear morning
  if (hour >= 10 && hour < 14) return weatherStates[1]; // Partly cloudy midday
  if (hour >= 14 && hour < 17) return weatherStates[4]; // Trade winds afternoon
  if (hour >= 17 && hour < 20) return weatherStates[3]; // Fog evening
  return weatherStates[2]; // Tropical storm night
};

const getActivityByHour = (hour) => {
  if (hour >= 5 && hour < 9) return activityLevels[1]; // Medium morning
  if (hour >= 9 && hour < 12) return activityLevels[0]; // Low midday rest
  if (hour >= 12 && hour < 17) return activityLevels[1]; // Medium afternoon
  if (hour >= 17 && hour < 21) return activityLevels[2]; // High dusk/feeding
  return activityLevels[2]; // High night predators
};

const getTemp = (weather) => {
  return Math.floor(weather.temp[0] + Math.random() * (weather.temp[1] - weather.temp[0]));
};

// ===== ALERT TICKER =====
const AlertTicker = ({ alerts: tickerAlerts }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % tickerAlerts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerAlerts.length]);

  const current = tickerAlerts[currentIdx];
  const severityColor = {
    critical: 'text-red-400',
    warning: 'text-amber-400',
    info: 'text-cyan-400',
  };

  return (
    <div className="relative h-5 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center gap-1.5 text-[10px] font-mono ${severityColor[current.severity]}`}
        >
          <span>{current.icon}</span>
          <span className="truncate">{current.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ===== MAIN WIDGET =====
const IslandConditionsWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weather, setWeather] = useState(null);
  const [activity, setActivity] = useState(null);
  const [temp, setTemp] = useState(0);
  const [time, setTime] = useState(new Date());
  const [shuffledAlerts, setShuffledAlerts] = useState([]);

  // Initialize and update every minute
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now);
      const hour = now.getHours();
      const w = getWeatherByHour(hour);
      setWeather(w);
      setActivity(getActivityByHour(hour));
      setTemp(getTemp(w));
    };

    // Shuffle alerts on mount
    setShuffledAlerts([...alerts].sort(() => Math.random() - 0.5));

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!weather || !activity) return null;

  const WeatherIcon = weather.icon;
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5, type: 'spring' }}
      className="fixed top-2 left-2 md:top-4 md:left-4 z-[60]"
    >
      <div className="bg-black/70 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 overflow-hidden w-[220px] sm:w-[260px]">
        {/* Header — always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            {/* Live dot */}
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
              <span className="relative block w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="text-left">
              <div className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.15em]">Isla Nublar</div>
              <div className="text-white text-xs font-mono font-bold">{timeStr} <span className="text-gray-500">LOCAL</span></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <WeatherIcon className={`w-4 h-4 ${weather.color}`} />
            <span className="text-white text-xs font-mono">{temp}°C</span>
            {isExpanded
              ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
              : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            }
          </div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-3.5 pb-3.5 space-y-3">
                {/* Divider */}
                <div className="w-full h-px bg-white/[0.06]" />

                {/* Weather Row */}
                <div className={`flex items-center justify-between p-2.5 rounded-lg border border-white/[0.04] ${weather.bgGlow}`}>
                  <div className="flex items-center gap-2">
                    <WeatherIcon className={`w-5 h-5 ${weather.color}`} />
                    <div>
                      <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Weather</div>
                      <div className={`text-xs font-mono font-bold ${weather.color}`}>{weather.label}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-mono text-white">
                      <Thermometer className="w-3 h-3 text-gray-500" />
                      {temp}°C
                    </div>
                    <div className="text-[9px] text-gray-600 font-mono">
                      Humidity {Math.floor(65 + Math.random() * 25)}%
                    </div>
                  </div>
                </div>

                {/* Dino Activity */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Dino Activity
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${activity.color}`}>{activity.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: activity.id === 'low' ? '33%' : activity.id === 'medium' ? '66%' : '100%' }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${activity.barColor}`}
                    />
                  </div>
                  <p className="text-[9px] text-gray-600 font-mono mt-1">{activity.description}</p>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-1.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                    <Eye className="w-3 h-3 text-green-400 mx-auto mb-0.5" />
                    <div className="text-[8px] text-gray-600 font-mono">VISIBILITY</div>
                    <div className="text-[10px] text-white font-mono font-bold">
                      {weather.id === 'fog' ? 'LOW' : weather.id === 'tropical-storm' ? 'MED' : 'HIGH'}
                    </div>
                  </div>
                  <div className="text-center p-1.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                    <Wind className="w-3 h-3 text-cyan-400 mx-auto mb-0.5" />
                    <div className="text-[8px] text-gray-600 font-mono">WIND</div>
                    <div className="text-[10px] text-white font-mono font-bold">{Math.floor(8 + Math.random() * 35)} km/h</div>
                  </div>
                  <div className="text-center p-1.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                    <Waves className="w-3 h-3 text-blue-400 mx-auto mb-0.5" />
                    <div className="text-[8px] text-gray-600 font-mono">SEISMIC</div>
                    <div className="text-[10px] text-white font-mono font-bold">{(1.2 + Math.random() * 2.5).toFixed(1)}</div>
                  </div>
                </div>

                {/* Alert Ticker */}
                <div className="bg-white/[0.02] rounded-lg border border-white/[0.04] p-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                    <span className="text-[8px] text-red-400/70 font-mono uppercase tracking-[0.2em]">Live Feed</span>
                  </div>
                  <AlertTicker alerts={shuffledAlerts} />
                </div>

                {/* Fence Status */}
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-amber-400" /> Fence Grid
                  </span>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> ALL SECTORS NOMINAL
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default IslandConditionsWidget;
