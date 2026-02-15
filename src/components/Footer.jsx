import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-command-dark border-t border-white/10 py-15">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center bg-command-light rounded shadow-lg p-5">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h4 className="text-xl font-bold font-mono text-white mb-2">
            JURASSIC WORLD
          </h4>
          <p className="text-gray-400 text-sm">
            Isla Nublar Sector 4, Costa Rica
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Authorized Personnel Only
          </p>
        </div>

        <div className="flex space-x-6 mb-4 md:mb-0">
          <a
            href="https://www.facebook.com/dat.laizz"
            className="text-gray-400 hover:text-amber-warning transition-colors"
          >
            <Facebook size={24} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-amber-warning transition-colors"
          >
            <Instagram size={24} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-amber-warning transition-colors"
          >
            <Twitter size={24} />
          </a>
        </div>

        <div className="text-center md:text-right">
          <p className="text-gray-600 text-xs">
            © 2026 InGen Corporation. All rights reserved.
          </p>
          <p className="text-gray-700 text-[10px] mt-1">Designed by Lai Dat</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
