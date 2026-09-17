import icon from '@/assets/icons/icon.png';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from "react-router-dom"

const Footer = () => {
  const socialLinks = [
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
    { name: 'GitHub', icon: Github, url: '#' },
  ];

  const quickLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Submit Idea", path: "/submit-idea" },
    { name: "Saved Ideas", path: "/saved-ideas" },
    { name: "Investors", path: "/investors" },
  ];

  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' }
  ];

  return (
    <footer className="w-full border-t border-white/5 bg-transparent py-16 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Logo and branding column */}
        <div className="col-span-1">
          <Link to="/" className="flex items-center mb-2">
            <img src={icon} alt="logo" className="w-6 h-6 mr-2 opacity-90" />
            <h3 className="text-2xl font-semibold tracking-tight text-white">PitchMint</h3>
          </Link>
          <p className="text-[11px] text-gray-500 font-medium tracking-widest uppercase mt-4">
            Designed, Built and Backed by <br />
            <span className="text-gray-300 mt-1 inline-block">PitchMint</span>
          </p>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="text-white font-semibold mb-6 text-[15px]">Platform</h4>
          <ul className="space-y-3.5">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-[14px] text-gray-400 hover:text-white transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal / Support Links */}
        <div>
          <h4 className="text-white font-semibold mb-6 text-[15px]">Legal</h4>
          <ul className="space-y-3.5">
            {supportLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-[14px] text-gray-400 hover:text-white transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-white font-semibold mb-6 text-[15px]">Socials</h4>
          <ul className="space-y-3.5">
            {socialLinks.map(({ name, icon: Icon, url }) => (
              <li key={name}>
                <a href={url} className="text-[14px] text-gray-400 hover:text-white transition-colors flex items-center gap-2.5">
                  <Icon className="w-4 h-4" /> {name}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[13px] text-gray-500 font-medium">
          © {new Date().getFullYear()} PitchMint. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[13px] text-gray-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;