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
  TrendingUp,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { darkMode } = useTheme()

  const { user } = useSelector((state: RootState) => state.auth)
  const { ideas, loading } = useSelector((state: RootState) => state.idea)

 useEffect(() => {
  if (ideas.length === 0) {
    dispatch(getSavedIdeas() as any)
  }
}, [dispatch, ideas.length])


  const stats = [
    {
      name: "Total Ideas",
      value: ideas.length,
      icon: Brain,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      bgGradient: "from-violet-500/10 to-fuchsia-500/10",
    },
    {
      name: "Pitch Decks",
      value: ideas.filter((idea) => idea.pitchDeckContent).length,
      icon: FileText,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      bgGradient: "from-cyan-500/10 to-indigo-500/10",
    },
    {
      name: "Canvases",
      value: ideas.filter((idea) => idea.canvasContent).length,
      icon: Layout,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-500/10 to-cyan-500/10",
    },
    {
      name: "Competitor Analyses",
      value: ideas.filter((idea) => idea.competitorAnalysis).length,
      icon: Users,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-500/10 to-pink-500/10",
    },
    {
      name: "Pitch Simulations",
      value: ideas.filter((idea) => idea.pitchSimulation).length,
      icon: MessageSquare,
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      bgGradient: "from-indigo-500/10 to-pink-500/10",
    },
    {
      name: "Average Score",
      value: ideas.length ? Math.round(ideas.reduce((acc, idea) => acc + idea.overallScore, 0) / ideas.length) : 0,
      icon: Star,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bgGradient: "from-amber-500/10 to-red-500/10",
    },
  ]

  const quickActions = [
    {
      title: "Submit New Idea",
      description: "Get instant AI validation for your startup idea with detailed analysis",
      icon: Brain,
      gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      bgGradient: "from-violet-500/10 to-fuchsia-500/10",
      action: () => navigate("/submit-idea"),
      badge: "Popular",
      glowColor: "shadow-violet-500/50"
    },
    {
      title: "View Saved Ideas",
      description: "Access your previously validated ideas and track progress",
      icon: FileText,
      gradient: "from-cyan-600 via-blue-600 to-indigo-600",
      bgGradient: "from-cyan-500/10 to-indigo-500/10",
      action: () => navigate("/saved-ideas"),
      badge: null,
      glowColor: "shadow-cyan-500/50"
    },
    {
      title: "Investor Directory",
      description: "Browse our curated list of investors and funding opportunities",
      icon: Crown,
      gradient: "from-amber-600 via-orange-600 to-red-600",
      bgGradient: "from-amber-500/10 to-red-500/10",
      action: () => navigate("/investors"),
      badge: "Premium",
      premium: true,
      glowColor: "shadow-amber-500/50"
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
          ? "bg-[#0a0118]"
          : "bg-gray-50"
      }`}
    >
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
        
       

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-purple-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-purple-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-violet-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-fuchsia-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] right-[25%] w-1 h-1 bg-amber-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative  z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Welcome Header */}
        <motion.div
          className="mb-6 "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-4">
  <div className="flex items-center gap-4 text-center">

             <div
  className={`hidden md:flex md:w-12 md:h-12 w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-purple-500 items-center justify-center shadow-2xl ${
    darkMode ? "shadow-violet-500/50" : "shadow-violet-500/30"
  }`}
>
  <Sparkles className="md:w-8 md:h-8 w-5 h-5 text-white" />
</div>

              <div>
                <h1 className={`text-xl md:text-xl font-black ${darkMode ? "text-white" : "text-gray-900"} `}>
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    {user?.name}!
                  </span>
                  {user?.isPremium && (
                    <motion.span
                      className="sm:inline-flex hidden items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/50 ml-2 md:ml-3 align-middle"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Crown className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.span>
                  )}
                </h1>
                <p className={`text-xs md:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium flex items-center gap-2`}>
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-violet-400" />
                  Your startup journey dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlight Banner - Only show if user has ideas */}
          {/* {ideas.length > 0 && (
            <div className={`relative overflow-hidden rounded-3xl p-4 md:p-3 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-fuchsia-600/10 border border-violet-500/20' : 'bg-gradient-to-r from-violet-100 via-purple-100 to-fuchsia-100 border border-violet-200'}`}>
              <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-violet-600/5 via-purple-600/5 to-fuchsia-600/5' : 'bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50'} backdrop-blur-3xl`} />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-purple-500 flex items-center justify-center shadow-xl">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-base md:text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                      Ready to scale your ideas?
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      You've validated {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'}. Time to turn insights into action!
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/submit-idea")}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-cyan-600 to-purple-500 text-white text-sm md:text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  Explore Tools
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )} */}
        </motion.div>

        {/* Enhanced Stats Grid */}
  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4 mb-8">
  {stats.map((stat, index) => (
    <motion.div
      key={stat.name}
      className={`group relative overflow-hidden rounded-2xl md:rounded-3xl pt-4 px-4 pb-2 md:pt-4 md:px-4 md:pb-2 ${
        darkMode
          ? "bg-gray-900/50 border border-gray-800/50"
          : "bg-white border border-gray-200"
      } backdrop-blur-xl hover:scale-105 transition-all duration-500 cursor-pointer`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      {/* Gradient Background on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>

      {/* Glow Effect */}
      <div
        className={`absolute -inset-1 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
      />

      <div className="relative">
        <div className="flex items-start gap-4">
          <div
            className={`w-6 h-6 md:w-8 md:h-8 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
          >
            <stat.icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </div>

          <div>
            <p
              className={`text-xs md:text-sm font-semibold ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {stat.name}
            </p>
            <p
              className={`text-md md:text-lg font-black mb-1 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {stat.value}
              {stat.name === "Average Score" && "%"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  ))}
</div>



        {/* Enhanced Quick Actions */}
        <motion.div
          className="mb-8 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="mb-6 md:mb-4">
            <h2 className={`text-sm md:text-md font-black mb-1  ${darkMode ? "text-white" : "text-gray-900"}`}>
              Quick Actions
            </h2>
            <p className={`text-xs  ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium`}>
              Take your startup to the next level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                disabled={action.premium && !user?.isPremium}
                className={`group relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-4 text-left transition-all duration-500 ${
                  darkMode ? "bg-gray-900/50 border border-gray-800/50" : "bg-white border border-gray-200"
                } backdrop-blur-xl hover:scale-105 ${
                  action.premium && !user?.isPremium ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                whileHover={action.premium && !user?.isPremium ? {} : { y: -10 }}
              >
                {/* Gradient Glow */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`} />

                {/* Badge */}
                {action.badge && (
                  <div
                    className={`absolute top-3 md:top-4 right-3 md:right-4 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-bold ${
                      action.badge === "Premium"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg"
                    }`}
                  >
                    {action.badge}
                  </div>
                )}

                <div className="relative">
                  <div
                    className={`w-8 h-8 md:w-8 md:h-8 rounded-xl md:rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 md:mb-3 shadow-2xl ${action.glowColor} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                  >
                    <action.icon className="w-4 h-4 md:w-4 md:h-4 text-white" />
                  </div>

                  <h3 className={`text-sm md:text-sm font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {action.title}
                  </h3>

                  <p className={`text-xs  ${darkMode ? "text-gray-400" : "text-gray-600"} leading-relaxed mb-3`}>
                    {action.description}
                  </p>

                  <div className={`flex items-center text-xs md:text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300 bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent`}>
                    {action.premium && !user?.isPremium ? "Upgrade to Premium" : "Get Started"}
                    <ArrowRight className={`w-4 h-4 md:w-5 md:h-5 ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Recent Ideas */}
        {ideas.length > 0 && (
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Header */}
           <div className="flex flex-row items-center justify-between flex-wrap mb-6 md:mb-4 gap-3">

              <div>
                <h2 className={`text-md md:text-md font-black mb-1  ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Recent Ideas
                </h2>
                <p className={`text-xs  ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium`}>
                  Your latest validated concepts
                </p>
              </div>
              <button
  onClick={() => navigate("/saved-ideas")}
  className="group flex items-center px-4 md:px-6 py-2 md:py-2 bg-gradient-to-r from-cyan-600 to-fuchsia-400 text-white text-sm md:text-xs font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 justify-center"
>
  View All
  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
</button>

            </div>

            {/* Table Wrapper */}
            <div
              className={`rounded-2xl md:rounded-3xl overflow-hidden ${
                darkMode ? "bg-gray-900/50 border border-gray-800/50" : "bg-white border border-gray-200"
              } backdrop-blur-xl shadow-2xl`}
            >
              <div >
                <table className="w-full">
                  <thead className={`${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
                    <tr>
                      <th
                        className={`px-3 sm:px-6 py-3 sm:py-2 text-left text-xs font-bold uppercase tracking-wider ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Idea
                      </th>
                      <th className={`hidden sm:table-cell px-6 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Score
                      </th>
                      <th className={`hidden sm:table-cell px-6 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Status
                      </th>
                      <th className={`hidden sm:table-cell px-6 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Date
                      </th>
                      <th className="hidden sm:table-cell px-6 py-2"></th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      darkMode ? "divide-gray-800" : "divide-gray-200"
                    }`}
                  >
                    {ideas.slice(0, 5).map((idea, index) => (
                      <motion.tr
                        key={idea._id}
                        className={`group cursor-pointer transition-all duration-300 ${
                          darkMode
                            ? "hover:bg-gray-800/50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => navigate(`/idea/${idea._id}`)}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <td
                          className={`py-2 px-3 sm:px-6 sm:py-2 ${
                            darkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          <div className="flex flex-col">
                            <p className="font-semibold text-xs mb-1">
                              {idea.ideaText.length > 60
                                ? `${idea.ideaText.substring(0, 60)}...`
                                : idea.ideaText}
                            </p>
                            <p
                              className={`hidden sm:block text-xs ${
                                darkMode ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              Startup Idea
                            </p>
                          </div>
                        </td>

                        <td className="hidden sm:table-cell px-6 py-2">
                          <div
                            className={`inline-flex items-center px-3 md:px-3 py-1  rounded-xl text-xs  font-bold shadow-lg ${
                              idea.overallScore >= 80
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                                : idea.overallScore >= 60
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                                : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                            }`}
                          >
                            <Star className="w-3 h-3 md:w-3 md:h-3 mr-2" />
                            {idea.overallScore}%
                          </div>
                        </td>

                        <td className="hidden sm:table-cell px-6 py-2">
                          <div className="flex items-center">
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mr-2" />
                            <span
                              className={`text-xs font-semibold ${
                                darkMode ? "text-emerald-400" : "text-emerald-600"
                              }`}
                            >
                              Validated
                            </span>
                          </div>
                        </td>

                        <td
                          className={`hidden sm:table-cell px-6 py-2 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <div className="flex items-center text-xs">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="hidden sm:table-cell px-6 py-2">
                          <ChevronRight
                            className={`w-4 h-4 md:w-4 md:h-4 ${
                              darkMode
                                ? "text-gray-600 group-hover:text-violet-400"
                                : "text-gray-400 group-hover:text-violet-600"
                            } transition duration-300 group-hover:translate-x-2`}
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
            className="text-center py-8 md:py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div
              className={`w-6 h-6 md:w-8 md:h-8 rounded-2xl bg-gradient-to-br from-cyan-600 to-fuchsia-500 flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-2xl ${darkMode ? 'shadow-violet-500/50' : 'shadow-violet-500/30'}`}
            >
              <Brain className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
            <h3 className={`text-lg md:text-xl font-bold mb-1 md:mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Ready to validate your first idea?
            </h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-6 md:mb-4 max-w-2xl mx-auto px-4`}>
              Submit your startup idea and get instant AI-powered validation with detailed insights and recommendations.
            </p>
            <button
              onClick={() => navigate("/submit-idea")}
              className="group px-6 md:px-8 py-2 md:py-2 bg-gradient-to-r from-cyan-600  to-fuchsia-500 text-white font-bold text-xs md:text-sm rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2 md:mr-3" />
              Submit Your First Idea
              <ArrowRight className="w-5 h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard