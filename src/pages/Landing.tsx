import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { Lightbulb, Rocket, BarChart as ChartBar, Award } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import StartupImage from "../assets/startup.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden flex flex-col-reverse lg:block ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <motion.div
                className="sm:text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span
                    className={`block ${
                      darkMode ? "text-white" : "text-gray-900"
                    } xl:inline`}
                  >
                    Turn Your Startup
                  </span>{" "}
                  <span className="block text-indigo-600 xl:inline">
                    Dreams Into Reality
                  </span>
                </h1>
                <p className="mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Validate your startup ideas with AI-powered analysis. Get
                  instant feedback, generate pitch decks, and create business
                  model canvases in minutes.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => navigate("/login")}
                      className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md ${
                        darkMode
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      } md:py-4 md:text-lg md:px-10`}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/3 lg:mt-16 lg:mr-24 ">
          <motion.img
          className="p-4"
            src={StartupImage}
            alt="Startup meeting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-12 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
              Supercharge Your Startup Journey
            </p>
            <p className="mt-4 max-w-2xl text-xl lg:mx-auto">
              Everything you need to validate and launch your startup idea.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <motion.div
                className={`relative p-6 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-700" : "bg-white"
                }`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Lightbulb size={24} />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium">
                    Idea Validation
                  </p>
                </dt>
                <dd className="mt-2 ml-16">
                  Get instant AI-powered analysis of your startup idea with
                  scores for market demand, competition, and monetization
                  potential.
                </dd>
              </motion.div>

              <motion.div
                className={`relative p-6 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-700" : "bg-white"
                }`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Rocket size={24} />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium">
                    Pitch Deck Generator
                  </p>
                </dt>
                <dd className="mt-2 ml-16">
                  Generate professional investor-ready pitch decks with one
                  click. Includes problem, solution, market size, business
                  model, and more.
                </dd>
              </motion.div>

              <motion.div
                className={`relative p-6 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-700" : "bg-white"
                }`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <ChartBar size={24} />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium">
                    Business Model Canvas
                  </p>
                </dt>
                <dd className="mt-2 ml-16">
                  Create a complete business model canvas outlining your value
                  proposition, customer segments, revenue streams, and more.
                </dd>
              </motion.div>

              <motion.div
                className={`relative p-6 rounded-lg shadow-md ${
                  darkMode ? "bg-gray-700" : "bg-white"
                }`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Award size={24} />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium">
                    Investor Contacts
                  </p>
                </dt>
                <dd className="mt-2 ml-16">
                  Premium users get access to a curated list of investors,
                  incubators, and accelerators to help fund their startups.
                </dd>
              </motion.div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span
              className={`block ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Ready to bring your idea to life?
            </span>
            <span className="block text-indigo-600">
              Start your journey today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
