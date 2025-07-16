"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getSavedIdeas } from "../store/slices/ideaSlice"
import type { RootState } from "../store"
import { useTheme } from "../contexts/ThemeContext"
import DashboardSkeleton from "../components/skeleton/DashboardSkelton"
import {
  Brain,
  FileText,
  Layout,
  MessageSquare,
  Star,
  ChevronRight,
  Users,
  Calendar,
  ArrowRight,
  Plus,
  Crown,
  CheckCircle2,
} from "lucide-react"
import { motion } from "framer-motion"

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { darkMode } = useTheme()

  const { user } = useSelector((state: RootState) => state.auth)
  const { ideas, loading } = useSelector((state: RootState) => state.idea)

  useEffect(() => {
    dispatch(getSavedIdeas() as any)
  }, [dispatch])

  const stats = [
    {
      name: "Total Ideas",
      value: ideas.length,
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
     
    },
    {
      name: "Pitch Decks",
      value: ideas.filter((idea) => idea.pitchDeckContent).length,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      
    },
    {
      name: "Canvases",
      value: ideas.filter((idea) => idea.canvasContent).length,
      icon: Layout,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      
    },
    {
      name: "Competitor Analyses",
      value: ideas.filter((idea) => idea.competitorAnalysis).length,
      icon: Users,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
     
    },
    {
      name: "Pitch Simulations",
      value: ideas.filter((idea) => idea.pitchSimulation).length,
      icon: MessageSquare,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
     
    },
    {
      name: "Average Score",
      value: ideas.length ? Math.round(ideas.reduce((acc, idea) => acc + idea.overallScore, 0) / ideas.length) : 0,
      icon: Star,
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      
    },
  ]

  const quickActions = [
    {
      title: "Submit New Idea",
      description: "Get instant AI validation for your startup idea with detailed analysis",
      icon: Brain,
      gradient: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      action: () => navigate("/submit-idea"),
      badge: "Popular",
    },
    {
      title: "View Saved Ideas",
      description: "Access your previously validated ideas and track progress",
      icon: FileText,
      gradient: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      action: () => navigate("/saved-ideas"),
      badge: null,
    },
    {
      title: "Investor Directory",
      description: "Browse our curated list of investors and funding opportunities",
      icon: Crown,
      gradient: "from-yellow-600 to-orange-600",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      action: () => navigate("/investors"),
      badge: "Premium",
      premium: true,
    },
  ]

  if (loading) {
    return (
      <div className="px-8 py-6">
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"
          : "bg-gradient-to-br from-white via-blue-50/30 to-white"
      }`}
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 ${
            darkMode
              ? "bg-gradient-to-br from-purple-600 via-pink-600 to-red-600"
              : "bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"
          } animate-pulse blur-3xl`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 ${
            darkMode
              ? "bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600"
              : "bg-gradient-to-br from-green-400 via-blue-400 to-purple-400"
          } animate-pulse delay-1000 blur-3xl`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 ${
            darkMode
              ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600"
              : "bg-gradient-to-br from-purple-400 via-pink-400 to-red-400"
          } animate-spin-slow blur-3xl`}
        ></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-1000 opacity-60"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-2000 opacity-60"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-cyan-400 rounded-full animate-bounce delay-3000 opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Welcome Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center mb-6">
            
            <div className="text-left">
              <h1 className={`text-xl md:text-3xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                Welcome back,
                <span className=" bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-500 bg-clip-text text-transparent">
                  {user?.name}!
                </span>
                {user?.isPremium && (
  <motion.div
    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-2xl ml-2"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, delay: 0.3 }}
  >
    <Crown className="w-4 h-4" />
  </motion.div>
)}

              </h1>
              <p className={`md:text-xl text-center ${darkMode ? "text-gray-300" : "text-gray-600"} font-medium mt-2`} >
                Your startup journey dashboard
              </p>
            </div>
            
          </div>

          {/* Premium Badge */}
         
        </motion.div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              className={`group relative pl-4 pt-4 rounded-3xl ${
                darkMode ? "bg-gray-800/80 hover:bg-gray-800" : "bg-white/80 hover:bg-white"
              } backdrop-blur-xl border ${
                darkMode ? "border-gray-700 hover:border-purple-500/50" : "border-gray-200 hover:border-purple-500/50"
              } transition-all duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              ></div>

              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div
                      className={`md:w-16 md:h-16 w-8 h-8 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500`}
                    >
                      <stat.icon className="md:h-8 md:w-8 h-4 w-4  text-white" />
                    </div>
                    <div className="ml-4">
                      <p className={`md:text-sm text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {stat.name}
                      </p>
                      <p
                        className={`md:text-xl text-xs font-black ${
                          darkMode
                            ? "text-white group-hover:text-purple-400"
                            : "text-gray-900 group-hover:text-purple-600"
                        } transition-colors duration-500`}
                      >
                        {stat.value}
                        {stat.name === "Average Score" && "%"}
                      </p>
                    </div>
                  </div>

                  {/* Change Indicator */}
                 
                </div>

                {/* Progress Ring */}
             
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Quick Actions */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-left mb-6 flex flex-col justify-start">
            <h2 className={`text-md md:text-xl font-black mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Quick Actions
            </h2>
            <p className={`md:text-sm text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium`}>
              Take your startup to the next level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {quickActions.map((action, index) => (
             <motion.button
  key={action.title}
  onClick={action.action}
  disabled={action.premium && !user?.isPremium}
  className={`group relative md:p-4 pl-4 py-4 rounded-3xl text-left transition-all duration-700 hover:scale-105 hover:shadow-2xl overflow-hidden
    ${darkMode ? "bg-gray-800/80 hover:bg-gray-800" : "bg-white/80 hover:bg-white"}
    backdrop-blur-xl border
    ${darkMode ? "border-gray-700 hover:border-purple-500/50" : "border-gray-200 hover:border-purple-500/50"}
    ${action.premium && !user?.isPremium ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.1 * index }}
  whileHover={action.premium && !user?.isPremium ? {} : { y: -10 }}
>
  {/* Background Gradient */}
  <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

  {/* Badge */}
  {action.badge && (
    <div
      className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold
        ${action.badge === "Premium" ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"}`}
    >
      {action.badge}
    </div>
  )}

  <div className="relative">
    <div className={`w-8 h-8 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
      <action.icon className="h-4 w-4 text-white" />
    </div>

    <h3 className={`md:text-md text-sm font-bold mb-2 ${darkMode ? "text-white group-hover:text-purple-400" : "text-gray-900 group-hover:text-purple-600"} transition-colors duration-500`}>
      {action.title}
    </h3>

    <p className={`md:text-xs text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} leading-relaxed mb-4`}>
      {action.description}
    </p>

    <div className="flex items-center text-purple-500 font-semibold group-hover:translate-x-2 transition-transform duration-300 text-xs md:text-sm">
      {action.premium && !user?.isPremium ? "Upgrade to Premium" : "Get Started"}
      <ArrowRight className="w-4 h-4 ml-2" />
    </div>
  </div>
</motion.button>

            ))}
          </div>
        </motion.div>

        {/* Enhanced Recent Ideas */}
        {ideas.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={`text-md md:text-xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Recent Ideas
                </h2>
                <p className={`md:text-sm text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium mt-2`}>
                  Your latest validated concepts
                </p>
              </div>
              <button
                onClick={() => navigate("/saved-ideas")}
                className="group flex items-center md:px-4 md:py-2 px-2 py-1 text-xs md:text-md bg-gradient-to-r from-cyan-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                View All
                <ArrowRight className="md:w-5 md:h-5 w-2 h-2 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

           <div
  className={`rounded-3xl ${
    darkMode ? "bg-gray-800/80" : "bg-white/80"
  } backdrop-blur-xl border ${
    darkMode ? "border-gray-700" : "border-gray-200"
  } shadow-2xl overflow-x-hidden w-full`}
>
  <div className="w-full">
    <table className="min-w-[800px] w-full text-sm">
      <thead className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50/50"}`}>
        <tr>
          {["Idea", "Score", "Status", "Date", ""].map((title, i) => (
            <th
              key={i}
              className={`px-4 md:px-8 text-left text-xs md:text-sm font-bold uppercase tracking-wider ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } py-2 md:py-4`}
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
        {ideas.slice(0, 5).map((idea, index) => (
          <motion.tr
            key={idea._id}
            className={`group cursor-pointer transition-all duration-300 ${
              darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50/50"
            }`}
            onClick={() => navigate(`/idea/${idea._id}`)}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <td className={`py-4 px-4 md:px-8 ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
              <div className="flex items-start flex-col">
                <p className="font-semibold text-xs md:text-md">
                  {idea.ideaText.length > 60 ? `${idea.ideaText.substring(0, 60)}...` : idea.ideaText}
                </p>
                <p className={`md:text-xs text-xs/10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Startup Idea</p>
              </div>
            </td>

            <td className="px-4 md:px-8 py-4">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                  idea.overallScore >= 80
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : idea.overallScore >= 60
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                      : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                }`}
              >
                <Star className="w-4 h-4 mr-2" />
                {idea.overallScore}%
              </div>
            </td>

            <td className="py-4 px-4 md:px-8">
              <div className="flex items-center text-xs md:text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                <span className={`font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}>Validated</span>
              </div>
            </td>

            <td className={`py-4 px-4 md:px-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <div className="flex items-center text-xs md:text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(idea.createdAt).toLocaleDateString()}
              </div>
            </td>

            <td className="py-4 px-4 md:px-8">
              <ChevronRight
                className={`w-5 h-5 ${
                  darkMode ? "text-gray-400 group-hover:text-purple-400" : "text-gray-400 group-hover:text-purple-600"
                } transition duration-300 group-hover:translate-x-1`}
              />
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

          </motion.div>
        )}

        {/* Empty State */}
        {ideas.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div
              className={`w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-8 shadow-2xl`}
            >
              <Brain className="h-16 w-16 text-white" />
            </div>
            <h3 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Ready to validate your first idea?
            </h3>
            <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"} mb-8 max-w-2xl mx-auto`}>
              Submit your startup idea and get instant AI-powered validation with detailed insights and recommendations.
            </p>
            <button
              onClick={() => navigate("/submit-idea")}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-6 h-6 mr-3 inline" />
              Submit Your First Idea
              <ArrowRight className="w-6 h-6 ml-3 inline group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
