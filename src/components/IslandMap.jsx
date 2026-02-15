import { useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useBookingStore from '../store/useBookingStore';

import encyclopedia from '../data/encyclopedia.json';
import tours from '../data/tours.json';

import mapImg from '../assets/nublar-map.png'; 

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const dinoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="32" height="32">
  <path d="M448 32C448 14.3 433.7 0 416 0S384 14.3 384 32v64H288V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h96v64H96c-17.7 0-32 14.3-32 32s14.3 32 32 32h128v64H64c-17.7 0-32 14.3-32 32s14.3 32 32 32h160v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h192c17.7 0 32-14.3 32-32V352h32v128c0 17.7 14.3 32 32 32s32-14.3 32-32V256h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V88h32c17.7 0 32-14.3 32-32s-14.3-32-32-32h-32V32z" fill="#84cc16"/>
</svg>
`;
const dinoIconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(dinoSvg)}`;

const dinoIcon = new L.Icon({
    iconUrl: dinoIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const MapController = () => {
  const map = useMap();
  useEffect(() => {
    map.setView([500, 500], 0); 
  }, [map]);
  return null;
};

const IslandMap = () => {
    const { activeZone, setActiveZone, compareTours, toggleCompareTour } = useBookingStore();
    
    const bounds = [[0, 0], [1000, 1000]]; 

    // Find matching tour for a dino
    const getTourForDino = (dinoId) => tours.find(t => t.anchorDinoId === dinoId);
    const isInCompare = (tourId) => compareTours.some(t => t.id === tourId);

    return (
        <div className="w-full h-full relative rounded-xl overflow-hidden border-2 border-jurassic-neon/30 shadow-2xl shadow-black bg-jurassic-lab">
            <MapContainer 
                crs={L.CRS.Simple} 
                bounds={bounds} 
                center={[500, 500]} 
                zoom={0}
                zoomControl={false}
                minZoom={0}
                maxZoom={0}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                dragging={false}
                touchZoom={false}
                style={{ height: '100%', width: '100%', background: '#0F172A' }}
            >
                <ImageOverlay
                    url={mapImg} 
                    bounds={bounds}
                />
                
                {encyclopedia.map((dino) => {
                    const matchedTour = getTourForDino(dino.id);
                    const inCompare = matchedTour ? isInCompare(matchedTour.id) : false;

                    return (
                        <Marker 
                            key={dino.id} 
                            position={dino.coordinates}
                            icon={dinoIcon}
                            eventHandlers={{
                                click: () => setActiveZone(dino),
                            }}
                        >
                            <Popup className="font-sans">
                                <div className="text-jurassic-neon font-bold uppercase text-sm tracking-wide">{dino.species}</div>
                                <div className="text-xs text-gray-400 font-mono mt-1 tracking-wider border-t border-gray-700 pt-1">{dino.type.toUpperCase()}</div>
                                
                                {matchedTour && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCompareTour(matchedTour);
                                        }}
                                        className={`mt-2 w-full px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                                            inCompare
                                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {inCompare ? '✓ Added to Compare' : '⚔ Compare'}
                                    </button>
                                )}
                            </Popup>
                        </Marker>
                    );
                })}
                <MapController />
            </MapContainer>
            
            {!activeZone && (
                <div className="absolute top-4 left-4 z-[400] bg-jurassic-lab/80 backdrop-blur-md px-4 py-2 rounded border border-jurassic-neon/40 text-jurassic-neon text-xs tracking-widest uppercase animate-pulse">
                    Select a zone regarding tour protocols
                </div>
            )}
        </div>
    );
};

export default IslandMap;