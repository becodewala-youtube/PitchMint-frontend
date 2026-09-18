import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  /**
   * Fallback destination URL if no browser history exists (e.g. direct link or new tab).
   * Default is '/dashboard'.
   */
  fallbackUrl?: string;
  /**
   * Text label to display next to the arrow icon.
   * Default is 'Back'.
   */
  label?: string;
  /**
   * Additional custom CSS classes.
   */
  className?: string;
}

export const BackButton = ({
  fallbackUrl = '/dashboard',
  label = 'Back',
  className = '',
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Check if there is browser navigation history within the app
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-medium text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer backdrop-blur-md group mb-4 select-none ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 text-gray-400 group-hover:text-purple-400" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
