import React from 'react';

type ColorTheme = 'violet' | 'amber' | 'emerald' | 'blue' | 'orange' | 'cyan' | 'purple' | 'red';

interface PageBackgroundProps {
  theme?: ColorTheme;
}

const colorMap = {
  violet: {
    orb1: 'from-violet-600/30 via-purple-600/20 to-fuchsia-600/30',
    orb2: 'from-cyan-600/30 via-blue-600/20 to-indigo-600/30',
    orb3: 'from-emerald-600/20 via-teal-600/10 to-cyan-600/20',
    mesh: 'via-purple-500/5',
    grid: 'rgba(139,92,246,0.03)',
    float1: 'bg-violet-400',
    float2: 'bg-purple-400',
    float3: 'bg-fuchsia-400',
  },
  amber: {
    orb1: 'from-amber-600/30 via-yellow-600/20 to-orange-600/30',
    orb2: 'from-blue-600/30 via-cyan-600/20 to-teal-600/30',
    orb3: 'from-purple-600/20 via-pink-600/10 to-fuchsia-600/20',
    mesh: 'via-amber-500/5',
    grid: 'rgba(245,158,11,0.03)',
    float1: 'bg-amber-400',
    float2: 'bg-yellow-400',
    float3: 'bg-orange-400',
  },
  emerald: {
    orb1: 'from-emerald-600/30 via-teal-600/20 to-cyan-600/30',
    orb2: 'from-blue-600/30 via-indigo-600/20 to-purple-600/30',
    orb3: 'from-amber-600/20 via-orange-600/10 to-red-600/20',
    mesh: 'via-emerald-500/5',
    grid: 'rgba(16,185,129,0.03)',
    float1: 'bg-emerald-400',
    float2: 'bg-teal-400',
    float3: 'bg-cyan-400',
  },
  blue: {
    orb1: 'from-blue-600/30 via-cyan-600/20 to-teal-600/30',
    orb2: 'from-indigo-600/30 via-violet-600/20 to-purple-600/30',
    orb3: 'from-emerald-600/20 via-teal-600/10 to-cyan-600/20',
    mesh: 'via-blue-500/5',
    grid: 'rgba(59,130,246,0.03)',
    float1: 'bg-blue-400',
    float2: 'bg-cyan-400',
    float3: 'bg-indigo-400',
  },
  orange: {
    orb1: 'from-orange-600/30 via-red-600/20 to-rose-600/30',
    orb2: 'from-amber-600/30 via-yellow-600/20 to-orange-600/30',
    orb3: 'from-pink-600/20 via-rose-600/10 to-red-600/20',
    mesh: 'via-orange-500/5',
    grid: 'rgba(249,115,22,0.03)',
    float1: 'bg-orange-400',
    float2: 'bg-red-400',
    float3: 'bg-amber-400',
  },
  cyan: {
    orb1: 'from-cyan-600/30 via-blue-600/20 to-indigo-600/30',
    orb2: 'from-teal-600/30 via-emerald-600/20 to-green-600/30',
    orb3: 'from-purple-600/20 via-fuchsia-600/10 to-pink-600/20',
    mesh: 'via-cyan-500/5',
    grid: 'rgba(6,182,212,0.03)',
    float1: 'bg-cyan-400',
    float2: 'bg-blue-400',
    float3: 'bg-teal-400',
  },
  purple: {
    orb1: 'from-purple-600/30 via-fuchsia-600/20 to-pink-600/30',
    orb2: 'from-violet-600/30 via-indigo-600/20 to-blue-600/30',
    orb3: 'from-rose-600/20 via-pink-600/10 to-fuchsia-600/20',
    mesh: 'via-purple-500/5',
    grid: 'rgba(168,85,247,0.03)',
    float1: 'bg-purple-400',
    float2: 'bg-fuchsia-400',
    float3: 'bg-pink-400',
  },
  red: {
    orb1: 'from-red-600/30 via-rose-600/20 to-pink-600/30',
    orb2: 'from-orange-600/30 via-amber-600/20 to-yellow-600/30',
    orb3: 'from-purple-600/20 via-fuchsia-600/10 to-pink-600/20',
    mesh: 'via-red-500/5',
    grid: 'rgba(239,68,68,0.03)',
    float1: 'bg-red-400',
    float2: 'bg-rose-400',
    float3: 'bg-orange-400',
  }
};

const PageBackground: React.FC<PageBackgroundProps> = ({ theme = 'violet' }) => {
  const t = colorMap[theme] || colorMap.violet;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Primary Gradient Orbs */}
      <div
        className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse bg-gradient-to-br ${t.orb1}`}
        style={{ animationDuration: '8s' }}
      ></div>
      <div
        className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse bg-gradient-to-br ${t.orb2}`}
        style={{ animationDuration: '10s', animationDelay: '2s' }}
      ></div>
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse bg-gradient-to-br ${t.orb3}`}
        style={{ animationDuration: '12s', animationDelay: '4s' }}
      ></div>

      {/* Mesh Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${t.mesh} to-transparent`} />
      
      {/* Animated Grid */}
      <div className={`absolute inset-0 bg-[linear-gradient(${t.grid}_1px,transparent_1px),linear-gradient(90deg,${t.grid}_1px,transparent_1px)] bg-[size:64px_64px]`} />

      {/* Floating Elements */}
      <div className={`absolute top-20 left-[10%] w-2 h-2 ${t.float1} rounded-full animate-bounce opacity-60`} style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
      <div className={`absolute top-40 right-[15%] w-1.5 h-1.5 ${t.float2} rounded-full animate-bounce opacity-60`} style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      <div className={`absolute bottom-32 left-[20%] w-2.5 h-2.5 ${t.float3} rounded-full animate-bounce opacity-60`} style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] right-[25%] w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
    </div>
  );
};

export default PageBackground;
