import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();
  
  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <span className="font-bold text-xl">
              Pitch<span className="text-indigo-600">Mint</span>
            </span>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-sm">
              &copy; {new Date().getFullYear()} Pitchmint. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;