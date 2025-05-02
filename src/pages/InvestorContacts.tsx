import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { AlertCircle, ExternalLink, Filter } from 'lucide-react';

interface Investor {
  _id: string;
  name: string;
  type: string;
  industryFocus: string[];
  description: string;
  location: string;
  contactLink: string;
  investmentRange: {
    min: number;
    max: number;
  };
}

const InvestorContacts = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    industry: ''
  });
  
  const { darkMode } = useTheme();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const response = await axios.get(
          `${API_URL}/api/investors${filters.type || filters.industry ? `?type=${filters.type}&industry=${filters.industry}` : ''}`,
          config
        );
        
        setInvestors(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch investors');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, [token, filters]);

  const investorTypes =  ['All', 'VC', 'Angel', 'Incubator', 'Accelerator'];
  const industries = ['All', 'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Enterprise'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-xl font-medium text-red-500">Error</h3>
          <p className="mt-1 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Investor Directory
            </h1>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Connect with top investors, VCs, and accelerators
            </p>
          </div>

          {/* Filters */}
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className={`rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <option value="">All Types</option>
              {investorTypes.map((type) => (
                <option key={type} value={type === 'All' ? '' : type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={filters.industry}
              onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
              className={`rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <option value="">All Industries</option>
              {industries.map((industry) => (
                <option key={industry} value={industry === 'All' ? '' : industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Investors Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {investors.map((investor) => (
            <div
              key={investor._id}
              className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-lg overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {investor.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                    } mt-2`}>
                      {investor.type}
                    </span>
                  </div>
                </div>

                <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {investor.description}
                </p>

                <div className="mt-4">
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Industry Focus
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {investor.industryFocus.map((industry) => (
                      <span
                        key={industry}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          darkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Investment Range
                  </h4>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ${investor.investmentRange.min.toLocaleString()} - $
                    {investor.investmentRange.max.toLocaleString()}
                  </p>
                </div>

                <div className="mt-6">
                  <a
                    href={investor.contactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Contact <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {investors.length === 0 && (
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-lg p-8 text-center`}
          >
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              No investors found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorContacts;