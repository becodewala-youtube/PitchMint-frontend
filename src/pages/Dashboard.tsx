import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useAppDispatch } from "../store/hooks"
import { getSavedIdeas } from "../store/slices/ideaSlice"
import type { RootState } from "../store"

import DashboardSkeleton from "../components/skeleton/DashboardSkeleton"
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
  Zap,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { user } = useSelector((state: RootState) => state.auth)
  const { ideas, loading } = useSelector((state: RootState) => state.idea)

  useEffect(() => {
    if (ideas.length === 0) {
      dispatch(getSavedIdeas())
    }
  }, [dispatch, ideas.length])

  const stats = [
    {
      name: "Total Ideas",
      value: ideas.length,
      icon: Brain,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    },
    {
      name: "Pitch Decks",
      value: ideas.filter((idea) => idea.pitchDeckContent).length,
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    },
    {
      name: "Canvases",
      value: ideas.filter((idea) => idea.canvasContent).length,
      icon: Layout,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    {
      name: "Competitor Analyses",
      value: ideas.filter((idea) => idea.competitorAnalysis).length,
      icon: Users,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    },
    {
      name: "Pitch Simulations",
      value: ideas.filter((idea) => idea.pitchSimulation).length,
      icon: MessageSquare,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    },
    {
      name: "Average Score",
      value: ideas.length ? Math.round(ideas.reduce((acc, idea) => acc + idea.overallScore, 0) / ideas.length) : 0,
      icon: Star,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    },
  ]

  const quickActions = [
    {
      title: "Submit New Idea",
      description: "Get instant AI validation for your startup idea with detailed analysis",
      icon: Brain,
      action: () => navigate("/submit-idea"),
      badge: "Popular",
    },
    {
      title: "View Saved Ideas",
      description: "Access your previously validated ideas and track progress",
      icon: FileText,
      action: () => navigate("/saved-ideas"),
      badge: null,
    },
    {
      title: "Investor Directory",
      description: "Browse our curated list of investors and funding opportunities",
      icon: Crown,
      action: () => navigate("/investors"),
      badge: "Premium",
      premium: true,
    },
  ]

  if (loading) {
    return (
      <div className="px-8 py-6 pt-24 bg-[#000000] min-h-screen">
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white">
      {/* Subtle Dot Grid Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-inner">
              <Sparkles className="w-6 h-6 text-[#7c3aed]" />
            </div>

            <div>
              <h1 className="text-[26px] md:text-3xl font-medium tracking-tighter text-white">
                Welcome back,{" "}
                <span className="text-white">
                  {user?.name}!
                </span>
                {user?.isPremium && (
                  <motion.span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 ml-3 align-middle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                  </motion.span>
                )}
              </h1>
              <p className="text-[13px] text-gray-400 font-medium flex items-center gap-1.5 mt-1">
                <Zap className="w-3.5 h-3.5 text-[#7c3aed]" />
                Your startup journey dashboard
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              className="group relative overflow-hidden rounded-2xl p-5 bg-[#0a0a0a] border border-white/10 hover:border-white/20 hover:bg-[#111111] hover:-translate-y-1 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
            >
              <div className="flex flex-col items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-400 mb-1">
                    {stat.name}
                  </p>
                  <p className="text-[22px] font-semibold text-white tracking-tight">
                    {stat.value}
                    {stat.name === "Average Score" && "%"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <div className="mb-5">
            <h2 className="text-[20px] font-medium text-white tracking-tighter">
              Quick Actions
            </h2>
            <p className="text-[14px] text-gray-400 mt-1 leading-relaxed">
              Take your startup to the next level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                disabled={action.premium && !user?.isPremium}
                className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 bg-[#0a0a0a] border border-white/10 hover:border-white/20 hover:bg-[#111111] hover:-translate-y-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ${
                  action.premium && !user?.isPremium ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 + 0.1 * index }}
              >
                {/* Badge */}
                {action.badge && (
                  <div
                    className={`absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      action.badge === "Premium"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-purple-500/10 text-[#7c3aed] border border-purple-500/20"
                    }`}
                  >
                    {action.badge}
                  </div>
                )}

                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                  <action.icon className="w-5 h-5 text-gray-300" />
                </div>

                <h3 className="text-[17px] font-semibold text-white mb-2 tracking-tight">
                  {action.title}
                </h3>

                <p className="text-[14px] text-gray-400 leading-relaxed mb-5">
                  {action.description}
                </p>

                <div className="flex items-center text-[13px] font-semibold text-[#7c3aed] group-hover:text-[#8b5cf6] transition-colors">
                  {action.premium && !user?.isPremium ? "Upgrade to Premium" : "Get Started"}
                  <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Ideas */}
        {ideas.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <div className="flex flex-row items-center justify-between mb-5">
              <div>
                <h2 className="text-[20px] font-medium text-white tracking-tighter">
                  Recent Ideas
                </h2>
                <p className="text-[14px] text-gray-400 mt-1 leading-relaxed">
                  Your latest validated concepts
                </p>
              </div>
              <button
                onClick={() => navigate("/saved-ideas")}
                className="btn-secondary px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-1.5 transition-all"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/[0.02] border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Idea
                      </th>
                      <th className="hidden sm:table-cell px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="hidden sm:table-cell px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="hidden sm:table-cell px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="hidden sm:table-cell px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ideas.slice(0, 5).map((idea, index) => (
                      <motion.tr
                        key={idea._id}
                        className="group cursor-pointer hover:bg-white/[0.02] transition-colors"
                        onClick={() => navigate(`/idea/${idea._id}`)}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <p className="text-[13.5px] font-medium text-white mb-0.5">
                              {idea.ideaText.length > 60
                                ? `${idea.ideaText.substring(0, 60)}...`
                                : idea.ideaText}
                            </p>
                            <p className="hidden sm:block text-[11px] text-gray-500">
                              Startup Idea
                            </p>
                          </div>
                        </td>

                        <td className="hidden sm:table-cell px-6 py-4">
                          <div
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                              idea.overallScore >= 80
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : idea.overallScore >= 60
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            <Star className="w-3 h-3 mr-1.5" />
                            {idea.overallScore}%
                          </div>
                        </td>

                        <td className="hidden sm:table-cell px-6 py-4">
                          <div className="flex items-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
                            <span className="text-[12px] font-semibold text-emerald-400">
                              Validated
                            </span>
                          </div>
                        </td>

                        <td className="hidden sm:table-cell px-6 py-4">
                          <div className="flex items-center text-[12px] text-gray-400">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-gray-500" />
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="hidden sm:table-cell px-6 py-4 text-right">
                          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1 inline-block" />
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
            className="text-center py-16 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
              <Brain className="w-8 h-8 text-[#7c3aed]" />
            </div>
            <h3 className="text-[20px] font-medium text-white tracking-tighter mb-2">
              Ready to validate your first idea?
            </h3>
            <p className="text-[14px] text-gray-400 leading-relaxed mb-8 max-w-md mx-auto">
              Submit your startup idea and get instant AI-powered validation with detailed insights and recommendations.
            </p>
            <button
              onClick={() => navigate("/submit-idea")}
              className="btn-primary px-6 py-3 rounded-xl text-[14px] font-semibold inline-flex items-center transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit Your First Idea
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard