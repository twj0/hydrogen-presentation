import React, { useState, useMemo } from 'react';
import { SlideData } from '../types';
import { motion } from 'framer-motion';
import { 
    Wind, Zap, Droplets, Globe, ChevronRight, Beaker, Factory, Lock, 
    TrendingUp, AlertTriangle, CheckCircle2, Calculator, RefreshCw, 
    Atom, Sun, Thermometer, ShieldCheck, Anchor, Microscope, Leaf,
    Database, Gauge, ArrowRightLeft, Layers
} from 'lucide-react';
import clsx from 'clsx';

// --- Reusable Animated Components ---

const MotionFadeIn = ({ show, children, className = "", delay = 0 }: { show: boolean, children?: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
    animate={{ 
        opacity: show ? 1 : 0, 
        y: show ? 0 : 20, 
        filter: show ? 'blur(0px)' : 'blur(5px)'
    }}
    transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const GlassCard = ({ children, className, hoverEffect = true }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => (
    <div className={clsx(
        "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.2)]",
        hoverEffect && "hover:bg-white/10 transition-all duration-300 hover:border-teal-500/30 hover:shadow-[0_0_20px_rgba(45,212,191,0.1)]",
        className
    )}>
        {children}
    </div>
);

const DiagramCard = ({ src, alt, caption, className }: { src: string, alt: string, caption?: string, className?: string }) => (
    <div className={clsx("relative group h-full", className)}>
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative rounded-xl overflow-hidden bg-[#0F172A] border border-white/20 shadow-2xl h-full flex flex-col">
             <div className="p-2 bg-gray-900/80 border-b border-white/10 flex items-center justify-between backdrop-blur-sm z-10">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                </div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">FIGURE_VIEW_01</span>
             </div>
             <div className="relative flex-1 bg-white flex justify-center items-center overflow-hidden p-4 group">
                 {/* Grid Pattern */}
                 <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                 <img 
                    src={src} 
                    alt={alt} 
                    className="max-w-full max-h-full object-contain mix-blend-multiply z-10 transition-transform duration-700 group-hover:scale-105" 
                 />
             </div>
             {caption && (
                <div className="p-3 bg-gray-900/90 border-t border-white/10 text-xs text-gray-300 font-mono">
                    <span className="text-teal-400 font-bold mr-2">FIG.</span> {caption}
                </div>
             )}
        </div>
    </div>
);

const Highlight = ({ text, color = "teal" }: { text: string, color?: "teal" | "blue" | "purple" | "rose" | "orange" }) => {
    const colors = {
        teal: "text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]",
        blue: "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]",
        purple: "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
        rose: "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]",
        orange: "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]",
    };
    return <span className={`font-bold ${colors[color]}`}>{text}</span>;
};

const LCOHCalculator = () => {
    const [elecPrice, setElecPrice] = useState(0.20); // CNY/kWh
    const [efficiency, setEfficiency] = useState(4.5); // kWh/Nm3 (approx 50 kWh/kg)
    const [capex, setCapex] = useState(1.5); // CNY/Nm3 portion

    const lcoh = useMemo(() => {
        // Simple model: Cost = Elec + CAPEX/OPEX
        // 1 kg H2 ~= 11.2 Nm3. Standard usually quotes per kg or Nm3. Let's use per Nm3 for industrial, or kg for general.
        // Let's do per kg to match international standards. 
        // Input efficiency is usually ~50 kWh/kg.
        return (elecPrice * (efficiency * 11.2) + capex * 11.2).toFixed(2);
    }, [elecPrice, efficiency, capex]);

    const percentageElec = useMemo(() => {
        return Math.round(((elecPrice * (efficiency * 11.2)) / parseFloat(lcoh)) * 100);
    }, [elecPrice, efficiency, lcoh]);

    return (
        <div className="w-full h-full flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 uppercase font-bold tracking-wider">
                        <label>电价 (LCOE)</label>
                        <span className="font-mono text-teal-400">¥{elecPrice.toFixed(2)}/kWh</span>
                    </div>
                    <input 
                        type="range" min="0" max="1" step="0.01" 
                        value={elecPrice} onChange={e => setElecPrice(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-400 hover:accent-teal-300"
                    />
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 uppercase font-bold tracking-wider">
                        <label>系统能耗 (System Efficiency)</label>
                        <span className="font-mono text-blue-400">{efficiency} kWh/Nm³</span>
                    </div>
                    <input 
                        type="range" min="3.8" max="5.5" step="0.1" 
                        value={efficiency} onChange={e => setEfficiency(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400 hover:accent-blue-300"
                    />
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 uppercase font-bold tracking-wider">
                        <label>非电成本 (CAPEX/OPEX)</label>
                        <span className="font-mono text-purple-400">¥{capex}/Nm³</span>
                    </div>
                    <input 
                        type="range" min="0.5" max="3" step="0.1" 
                        value={capex} onChange={e => setCapex(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-400 hover:accent-purple-300"
                    />
                </div>
            </div>

            <GlassCard className="flex-1 flex flex-col justify-center items-center relative overflow-hidden group border-teal-500/30">
                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-100 transition duration-500"></div>
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-purple-500"></div>
                 
                 <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 relative z-10">Estimated LCOH</h3>
                 <div className="flex items-baseline gap-2 relative z-10">
                    <span className="text-2xl text-gray-400 font-light">¥</span>
                    <span className="text-7xl font-mono font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{lcoh}</span>
                 </div>
                 <div className="text-teal-400 text-xs font-mono mb-6 relative z-10">per kg H₂</div>
                 
                 <div className="w-full bg-gray-800/50 h-4 rounded-full overflow-hidden flex relative z-10 max-w-[200px]">
                    <div className="h-full bg-teal-500 transition-all duration-500" style={{width: `${percentageElec}%`}}></div>
                    <div className="h-full bg-purple-500 transition-all duration-500" style={{width: `${100-percentageElec}%`}}></div>
                 </div>
                 <div className="flex justify-between w-full max-w-[200px] mt-2 text-[10px] text-gray-500 font-mono">
                    <span>Power: {percentageElec}%</span>
                    <span>Fixed: {100 - percentageElec}%</span>
                 </div>
            </GlassCard>
        </div>
    );
}

// --- Slides Data ---

export const slides: SlideData[] = [
  // --- Section 1: Intro (Slides 1-3) ---
  
  // 1. Cover
  {
    id: 1,
    layout: 'cover',
    backgroundImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2070&auto=format&fit=crop', // Abstract Tech
    content: () => (
      <div className="text-center max-w-6xl flex flex-col items-center z-10">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-3 px-6 py-2 rounded-full border border-teal-500/30 bg-black/40 text-teal-300 text-xs tracking-[0.3em] uppercase backdrop-blur-md shadow-lg"
        >
            <Atom size={14} className="animate-spin-slow text-teal-400" />
            <span className="font-semibold">Future Energy Report 2025</span>
        </motion.div>
        
        <h1 className="text-8xl font-display font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-400 to-blue-500 animate-gradient-x drop-shadow-2xl leading-tight">
          氢气制取
        </h1>
        <h2 className="text-4xl font-light text-gray-200 tracking-wider mb-12 font-sans">
            从<span className="text-teal-400 font-semibold border-b-2 border-teal-500/50">工业基石</span>到<span className="text-blue-400 font-semibold border-b-2 border-blue-500/50">深蓝前沿</span>
        </h2>
        
        <div className="flex gap-8 text-gray-400 font-mono text-sm">
            <span className="flex items-center gap-2"><div className="w-2 h-2 bg-teal-500 rounded-full"></div>ALK</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div>PEM</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div>AEM</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-500 rounded-full"></div>SOEC</span>
        </div>
      </div>
    ),
    clicks: 0,
    ttsText: "欢迎进入氢气制取技术的世界。本次演示将深入探讨氢气制取技术，重点对比工业成熟的ALK与商业化的PEM技术，并展望海水直接制氢的前沿突破。"
  },

  // 2. Context: The Color of Hydrogen
  {
    id: 2,
    layout: 'center',
    title: '氢能光谱',
    content: (step) => (
      <div className="w-full max-w-5xl">
         <h1 className="text-5xl font-display font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">制氢路线演变</h1>
         <div className="grid grid-cols-3 gap-6">
            <GlassCard className="border-t-4 border-gray-500 opacity-60 hover:opacity-100">
                <div className="flex justify-between items-start mb-4">
                    <Factory className="text-gray-400" size={32}/>
                    <span className="text-4xl font-black text-gray-700">95%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-2">灰氢 (Grey)</h3>
                <p className="text-xs text-gray-500 font-mono mb-4">SMR: CH₄ + H₂O → CO₂ + H₂</p>
                <div className="text-sm text-gray-400">化石燃料重整，碳排放高，成本低廉 ($1.5/kg)。</div>
            </GlassCard>

            <GlassCard className="border-t-4 border-blue-500 opacity-80 hover:opacity-100">
                <div className="flex justify-between items-start mb-4">
                    <Database className="text-blue-400" size={32}/>
                    <span className="text-4xl font-black text-blue-900/50">CCS</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-300 mb-2">蓝氢 (Blue)</h3>
                <p className="text-xs text-gray-500 font-mono mb-4">Grey H₂ + CCS</p>
                <div className="text-sm text-gray-400">在灰氢基础上增加碳捕集封存，是过渡性方案。</div>
            </GlassCard>

            <GlassCard className="border-t-4 border-teal-400 bg-teal-900/10 transform scale-105 shadow-2xl border border-teal-500/30">
                <div className="flex justify-between items-start mb-4">
                    <Wind className="text-teal-400" size={32}/>
                    <span className="text-4xl font-black text-teal-500/30">&lt;1%</span>
                </div>
                <h3 className="text-2xl font-bold text-teal-300 mb-2">绿氢 (Green)</h3>
                <p className="text-xs text-teal-500/70 font-mono mb-4">2H₂O + Electricity → 2H₂ + O₂</p>
                <div className="text-sm text-gray-300">完全利用可再生能源电解水，<Highlight text="零碳排放" />，是终极目标。</div>
            </GlassCard>
         </div>
      </div>
    ),
    clicks: 0,
    ttsText: "目前全球95%的氢气仍是化石燃料制取的灰氢。我们的目标是向绿氢转型，即利用风能、太阳能电解水制氢。"
  },

  // 3. Tech Map
  {
    id: 3,
    layout: 'center',
    title: '技术全景图',
    content: (step) => (
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-4">
            <Microscope className="text-teal-400" />
            主流电解水技术路线
        </h1>
        
        <div className="grid grid-cols-2 gap-6 h-[500px]">
            <div className="space-y-6">
                <GlassCard className="flex-1 h-[230px] border-l-4 border-l-blue-500 flex flex-col justify-center group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Beaker size={100}/></div>
                    <div className="relative z-10">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-3xl font-bold text-blue-400">ALK</h3>
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">Commercial</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">碱性电解水 (Alkaline)</p>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• <b className="text-white">电解质:</b> KOH 溶液</li>
                            <li>• <b className="text-white">特点:</b> 廉价、耐用、大基地首选</li>
                        </ul>
                    </div>
                </GlassCard>
                <GlassCard className="flex-1 h-[230px] border-l-4 border-l-teal-500 flex flex-col justify-center group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={100}/></div>
                    <div className="relative z-10">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-3xl font-bold text-teal-400">PEM</h3>
                            <span className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded text-xs">Commercial</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">质子交换膜 (Proton Exchange)</p>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• <b className="text-white">电解质:</b> 固态聚合物膜</li>
                            <li>• <b className="text-white">特点:</b> 响应快、紧凑、适合离网</li>
                        </ul>
                    </div>
                </GlassCard>
            </div>
            
            <div className="space-y-6">
                 <GlassCard className="flex-1 h-[230px] border-l-4 border-l-purple-500 flex flex-col justify-center opacity-80 hover:opacity-100 transition group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Atom size={100}/></div>
                    <div className="relative z-10">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-3xl font-bold text-purple-400">AEM</h3>
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">Pilot</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">阴离子交换膜 (Anion Exchange)</p>
                         <ul className="text-sm text-gray-300 space-y-1">
                            <li>• <b className="text-white">潜力:</b> 结合ALK成本与PEM性能</li>
                            <li>• <b className="text-white">现状:</b> 膜稳定性待突破</li>
                        </ul>
                    </div>
                </GlassCard>
                 <GlassCard className="flex-1 h-[230px] border-l-4 border-l-orange-500 flex flex-col justify-center opacity-80 hover:opacity-100 transition group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Thermometer size={100}/></div>
                    <div className="relative z-10">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-3xl font-bold text-orange-400">SOEC</h3>
                            <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs">Demo</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">固体氧化物 (Solid Oxide)</p>
                         <ul className="text-sm text-gray-300 space-y-1">
                            <li>• <b className="text-white">工作温度:</b> 700-850°C</li>
                            <li>• <b className="text-white">特点:</b> 电效率极高 (~100%)</li>
                        </ul>
                    </div>
                </GlassCard>
            </div>
        </div>
      </div>
    ),
    clicks: 0,
    ttsText: "目前主流技术路线有四种：ALK最为成熟廉价；PEM响应速度最快；AEM和SOEC则代表了未来的方向。"
  },

  // --- Section 2: ALK Deep Dive (Slides 4-8) ---

  // 4. ALK Principle
  {
    id: 4,
    layout: 'two-cols',
    title: 'ALK 反应机理',
    content: (step) => (
      <div className="grid grid-cols-2 gap-8 items-center h-full">
        <MotionFadeIn show={true} className="h-full">
            <DiagramCard 
                src="https://ars.els-cdn.com/content/image/1-s2.0-S2352484722020625-gr3.jpg" 
                alt="ALK Diagram"
                caption="Alkaline Cell Structure"
            />
        </MotionFadeIn>
        <div className="space-y-6 pl-4">
            <h2 className="text-4xl font-bold text-blue-400 mb-2">成熟的工业基石</h2>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-6">Alkaline Water Electrolysis</div>
            
            <div className="space-y-4">
                 <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                    <span className="text-xs text-blue-400 font-bold block mb-1">CATHODE (HER)</span>
                    <span className="font-mono text-white text-lg">2H₂O + 2e⁻ → H₂↑ + 2OH⁻</span>
                 </div>
                 <div className="bg-rose-900/20 border border-rose-500/30 p-4 rounded-xl">
                    <span className="text-xs text-rose-400 font-bold block mb-1">ANODE (OER)</span>
                    <span className="font-mono text-white text-lg">2OH⁻ → ½O₂↑ + H₂O + 2e⁻</span>
                 </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mt-4">
                依靠 30% wt KOH 溶液作为电解质。中间采用多孔隔膜（PPS或石棉）隔离气体，但允许 OH⁻ 离子穿透。
            </p>
        </div>
      </div>
    ),
    clicks: 0,
    ttsText: "ALK 依靠高浓度的氢氧化钾溶液导电。水在阴极还原生成氢气和氢氧根，氢氧根穿过隔膜到达阳极生成氧气。"
  },

  // 5. ALK Structure
  {
    id: 5,
    layout: 'image-right',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=2070&auto=format&fit=crop', // Industrial Pipes
    title: 'ALK 设备结构',
    content: (step) => (
      <div className="flex flex-col justify-center h-full">
         <h1 className="text-4xl font-bold mb-6">双极压滤式结构</h1>
         <p className="text-gray-400 mb-8">Bipolar Filter Press Design</p>

         <div className="space-y-4">
            <MotionFadeIn show={true} delay={0.1}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-gray-700 flex items-center justify-center font-bold text-gray-300">1</div>
                    <div>
                        <h4 className="font-bold text-teal-300">电极 (Electrodes)</h4>
                        <p className="text-xs text-gray-400">镍网或泡沫镍 (Raney Nickel)。非贵金属，成本极低。</p>
                    </div>
                </div>
            </MotionFadeIn>
            <MotionFadeIn show={true} delay={0.2}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-gray-700 flex items-center justify-center font-bold text-gray-300">2</div>
                    <div>
                        <h4 className="font-bold text-blue-300">隔膜 (Diaphragm)</h4>
                        <p className="text-xs text-gray-400">PPS 织物。需防止气体渗透，是安全核心。</p>
                    </div>
                </div>
            </MotionFadeIn>
            <MotionFadeIn show={true} delay={0.3}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-gray-700 flex items-center justify-center font-bold text-gray-300">3</div>
                    <div>
                        <h4 className="font-bold text-purple-300">极框 (Bipolar Plate)</h4>
                        <p className="text-xs text-gray-400">碳钢镀镍。支撑结构并串联电路。</p>
                    </div>
                </div>
            </MotionFadeIn>
         </div>
      </div>
    ),
    clicks: 0,
    ttsText: "工业ALK电解槽通常采用双极压滤式结构。核心材料是镍，这也是ALK成本优势的来源。"
  },

  // 6. ALK Scale
  {
    id: 6,
    layout: 'center',
    title: 'ALK 规模化优势',
    content: (step) => (
      <div className="w-full max-w-5xl">
         <div className="grid grid-cols-2 gap-12 items-center">
            <div className="text-left">
                <h1 className="text-6xl font-display font-bold text-white mb-2">1000<span className="text-3xl text-teal-500">Nm³/h</span></h1>
                <p className="text-gray-400 text-lg mb-8">当前主流单槽产量 (5MW)</p>
                <div className="bg-teal-900/20 border-l-4 border-teal-500 p-6 rounded-r-xl">
                    <p className="text-xl text-teal-100 font-light italic">"中国拥有全球最完整的ALK供应链，产能占全球80%以上。"</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <GlassCard className="text-center py-8">
                    <div className="text-4xl font-bold text-white mb-2">2000+</div>
                    <div className="text-xs text-gray-500 uppercase">Nm³/h (Next Gen)</div>
                 </GlassCard>
                  <GlassCard className="text-center py-8">
                    <div className="text-4xl font-bold text-green-400 mb-2">&lt;200</div>
                    <div className="text-xs text-gray-500 uppercase">$/kW (CAPEX)</div>
                 </GlassCard>
                  <GlassCard className="text-center py-8 col-span-2">
                    <div className="text-4xl font-bold text-blue-400 mb-2">30-40</div>
                    <div className="text-xs text-gray-500 uppercase">Years Lifespan</div>
                 </GlassCard>
            </div>
         </div>
      </div>
    ),
    clicks: 0,
    ttsText: "规模化是ALK最大的护城河。单槽1000标方已是标配，下一代将突破2000标方，且造价低廉，寿命极长。"
  },

  // 7. ALK Pros & Cons
  {
    id: 7,
    layout: 'two-cols',
    title: 'ALK 优劣势分析',
    content: (step) => (
       <div className="flex flex-col gap-6 h-full justify-center">
          <GlassCard className="border-l-4 border-l-green-500">
             <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-green-500"/>
                <h3 className="text-xl font-bold">优势 (Pros)</h3>
             </div>
             <ul className="list-disc list-inside text-gray-300 text-sm space-y-2 pl-2">
                <li>技术极其成熟，工程经验丰富。</li>
                <li>非贵金属催化剂 (Ni)，CAPEX 极低。</li>
                <li>单槽规模大，适合大规模化工应用。</li>
             </ul>
          </GlassCard>

          <GlassCard className="border-l-4 border-l-red-500">
             <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-500"/>
                <h3 className="text-xl font-bold">劣势 (Cons)</h3>
             </div>
             <ul className="list-disc list-inside text-gray-300 text-sm space-y-2 pl-2">
                <li><Highlight text="动态响应慢" color="rose"/>: 难以跟随风光波动。</li>
                <li>启停时间长 (冷启动~50min)。</li>
                <li>低负载下气体互窜风险大 (通常需 &gt;30% 负载)。</li>
                <li>占地面积大，需处理腐蚀性碱液。</li>
             </ul>
          </GlassCard>
       </div>
    ),
    clicks: 0,
    ttsText: "虽然成本低廉，但ALK的动态响应较差，难以适应风光发电的剧烈波动，且低负载运行存在安全隐患。"
  },

  // 8. ALK Visual Summary
  {
    id: 8,
    layout: 'image-left',
    image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=2070&auto=format&fit=crop', // Chemistry Lab/Plant
    title: 'ALK 适用场景',
    content: (step) => (
      <div className="flex flex-col justify-center h-full p-8">
        <h1 className="text-4xl font-bold mb-6 text-teal-400">稳态运行之王</h1>
        <p className="text-gray-300 leading-relaxed text-lg mb-8">
            鉴于其特性，ALK 最适合：
        </p>
        <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <Factory className="text-gray-400" />
                <span>网电制氢 (Stable Grid Power)</span>
            </div>
             <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <RefreshCw className="text-blue-400" />
                <span>源网荷储一体化 (Base Load)</span>
            </div>
             <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <TrendingUp className="text-green-400" />
                <span>大规模化工园区 (Ammonia/Methanol)</span>
            </div>
        </div>
      </div>
    ),
    clicks: 0,
    ttsText: "因此，ALK常被誉为“稳态运行之王”，最适合有稳定电源或配合电池缓冲的大规模化工场景。"
  },

  // --- Section 3: PEM Deep Dive (Slides 9-13) ---

  // 9. PEM Intro
  {
    id: 9,
    layout: 'cover',
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', // Tech Network
    content: () => (
      <div className="text-center z-10 bg-black/60 p-12 rounded-3xl border border-teal-500/30 backdrop-blur-md">
        <div className="text-teal-400 font-bold tracking-widest uppercase mb-4">The Game Changer</div>
        <h1 className="text-7xl font-bold text-white mb-6">PEM</h1>
        <p className="text-2xl text-gray-300">Proton Exchange Membrane</p>
        <p className="text-lg text-teal-200 mt-4">为可再生能源的波动性而生</p>
      </div>
    ),
    clicks: 0,
    ttsText: "接下来是PEM，质子交换膜技术。它的出现，就是为了解决可再生能源的波动性难题。"
  },

  // 10. PEM Principle
  {
    id: 10,
    layout: 'two-cols',
    title: 'PEM 反应机理',
    content: (step) => (
      <div className="grid grid-cols-2 gap-8 items-center h-full">
         <div className="space-y-6">
            <h2 className="text-4xl font-bold text-teal-400 mb-2">质子传导机制</h2>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-6">Solid Polymer Electrolyte</div>
            
            <div className="space-y-4">
                 <div className="bg-rose-900/20 border border-rose-500/30 p-4 rounded-xl">
                    <span className="text-xs text-rose-400 font-bold block mb-1">ANODE (OER)</span>
                    <span className="font-mono text-white text-lg">2H₂O → O₂↑ + 4H⁺ + 4e⁻</span>
                    <div className="text-xs text-gray-500 mt-2">Catalyst: IrO₂ (Iridium)</div>
                 </div>
                 <div className="flex justify-center text-teal-500"><ArrowRightLeft className="rotate-90"/> <span className="text-xs ml-2">H⁺ passes through membrane</span></div>
                 <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                    <span className="text-xs text-blue-400 font-bold block mb-1">CATHODE (HER)</span>
                    <span className="font-mono text-white text-lg">4H⁺ + 4e⁻ → 2H₂↑</span>
                     <div className="text-xs text-gray-500 mt-2">Catalyst: Pt/C (Platinum)</div>
                 </div>
            </div>
        </div>
        <MotionFadeIn show={true} className="h-full pl-4">
            <DiagramCard 
                src="https://www.energy.gov/sites/default/files/styles/full_article_width/public/2021-06/pem-electrolyzer-diagram.png?itok=9g6ez4Z_" 
                alt="PEM Diagram"
                caption="PEM Cell: Zero Gap Structure"
            />
        </MotionFadeIn>
      </div>
    ),
    clicks: 0,
    ttsText: "PEM 使用固态聚合物膜传导质子。水在阳极分解，质子穿过膜到阴极结合电子生成氢气。这一过程需要贵金属催化。"
  },

  // 11. PEM Structure (Zero Gap)
  {
    id: 11,
    layout: 'image-left',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop', // Micro structure
    title: '零间距结构',
    content: (step) => (
      <div className="flex flex-col justify-center h-full p-8">
        <h1 className="text-4xl font-bold mb-4 text-purple-400">MEA: 膜电极组件</h1>
        <p className="text-gray-400 mb-8">Membrane Electrode Assembly</p>
        
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-6">
            <p className="text-gray-300 leading-relaxed">
                PEM 采用<Highlight text="零间距 (Zero-Gap)" color="purple"/>结构。催化剂直接涂覆在质子膜两侧，极大降低了欧姆电阻。
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-black/40 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-white">2 A/cm²</div>
                    <div className="text-[10px] text-gray-500">Current Density</div>
                </div>
                 <div className="bg-black/40 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-white">compact</div>
                    <div className="text-[10px] text-gray-500">Size</div>
                </div>
            </div>
            <div className="text-sm text-gray-400 italic border-l-2 border-purple-500 pl-4">
                "像三明治一样紧密压合，体积仅为同规模ALK的 1/5。"
            </div>
        </div>
      </div>
    ),
    clicks: 0,
    ttsText: "其核心是膜电极组件MEA，采用零间距结构，使得电流密度极高，设备体积大幅缩小。"
  },

  // 12. PEM Response
  {
    id: 12,
    layout: 'center',
    title: 'PEM 动态响应',
    content: (step) => (
      <div className="w-full max-w-4xl">
         <h1 className="text-4xl font-bold mb-8 text-center">为何它是风光的最佳拍档？</h1>
         
         <div className="relative h-64 w-full bg-gray-900 rounded-xl border border-gray-700 overflow-hidden mb-8 p-4">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-4 gap-1 opacity-10 pointer-events-none">
                {Array.from({length: 48}).map((_,i) => <div key={i} className="border border-teal-500/20"></div>)}
            </div>
            {/* Visualizing Response Time */}
            <div className="flex h-full items-end gap-2 px-8">
                <div className="w-1/2 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-blue-500/30 h-[20%] rounded-t-lg relative transition-all duration-1000 group-hover:h-[80%]">
                        <div className="absolute bottom-0 w-full bg-blue-500 h-full animate-pulse-slow opacity-50"></div>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition">Seconds</span>
                    </div>
                    <span className="font-bold text-blue-400">ALK</span>
                </div>
                <div className="w-1/2 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-teal-500/30 h-[20%] rounded-t-lg relative transition-all duration-200 group-hover:h-[95%]">
                        <div className="absolute bottom-0 w-full bg-teal-500 h-full animate-pulse opacity-80"></div>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-teal-400 font-bold opacity-0 group-hover:opacity-100 transition">Milliseconds</span>
                    </div>
                    <span className="font-bold text-teal-400">PEM</span>
                </div>
            </div>
         </div>

         <div className="grid grid-cols-3 gap-4 text-center">
            <GlassCard className="py-4">
                <div className="text-teal-400 font-bold text-xl">ms 级</div>
                <div className="text-xs text-gray-500">响应速度</div>
            </GlassCard>
            <GlassCard className="py-4">
                <div className="text-teal-400 font-bold text-xl">0-160%</div>
                <div className="text-xs text-gray-500">负载范围</div>
            </GlassCard>
            <GlassCard className="py-4">
                <div className="text-teal-400 font-bold text-xl">&lt; 5 min</div>
                <div className="text-xs text-gray-500">冷启动时间</div>
            </GlassCard>
         </div>
      </div>
    ),
    clicks: 0,
    ttsText: "PEM 拥有毫秒级的响应速度和极宽的负载调节范围（0到160%），能完美跟随风光发电的瞬时波动。"
  },

  // 13. PEM Bottleneck (Iridium)
  {
    id: 13,
    layout: 'center',
    title: 'PEM 的瓶颈',
    content: (step) => (
      <div className="flex flex-col items-center justify-center max-w-4xl w-full">
         <div className="bg-rose-900/10 border border-rose-500/40 p-10 rounded-3xl text-center relative overflow-hidden backdrop-blur-md w-full">
             <div className="absolute top-0 right-0 p-6 opacity-10"><Lock size={120} className="text-rose-500"/></div>
             
             <h2 className="text-lg text-rose-400 font-bold uppercase tracking-widest mb-4">The Grand Challenge</h2>
             <h1 className="text-6xl font-black text-white mb-8">铱 (Iridium)</h1>
             
             <div className="grid grid-cols-2 gap-12 text-left mb-8">
                <div>
                    <div className="text-4xl font-mono font-bold text-rose-300">7-9 Tons</div>
                    <div className="text-sm text-gray-400">Global Annual Production</div>
                </div>
                 <div>
                    <div className="text-4xl font-mono font-bold text-rose-300">~$160,000</div>
                    <div className="text-sm text-gray-400">Price per kg</div>
                </div>
             </div>
             
             <p className="text-gray-300 max-w-2xl mx-auto">
                作为铂金开采的副产物，铱是地壳中最稀有的元素之一。目前PEM电解槽的铱载量 (~1-2 mg/cm²) 无法支撑太瓦(TW)级的氢能扩张。
             </p>
             
             <div className="mt-8 inline-block px-6 py-2 rounded-full border border-rose-500 text-rose-400 text-sm font-bold animate-pulse">
                Target 2030: &lt; 0.1 g/kW
             </div>
         </div>
      </div>
    ),
    clicks: 0,
    ttsText: "然而，PEM 严重依赖稀有贵金属铱。全球年产量仅个位数吨，这是限制其大规模扩张的最大瓶颈。"
  },

  // --- Section 4: Frontier Tech (Slides 14-17) ---

  // 14. AEM
  {
    id: 14,
    layout: 'image-right',
    image: 'https://images.unsplash.com/photo-1628126235206-526053308ac2?q=80&w=2070&auto=format&fit=crop', // Lab research
    title: 'AEM: 融合之道',
    content: (step) => (
      <div className="flex flex-col justify-center h-full">
         <h1 className="text-4xl font-bold mb-2 text-purple-400">AEM: 融合之道</h1>
         <h2 className="text-xl text-gray-400 mb-6">Anion Exchange Membrane</h2>

         <div className="space-y-4">
            <p className="text-gray-300">
                阴离子交换膜电解水 (AEM) 试图结合 ALK 和 PEM 的优点。
            </p>
            <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/20">
                <h3 className="text-lg font-bold text-white mb-2">The Best of Both Worlds?</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> 使用非贵金属催化剂 (Ni, Fe) → <b>Low Cost</b></li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> 采用零间距结构 → <b>High Performance</b></li>
                </ul>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <span className="text-xs text-orange-400 font-bold block mb-1">CURRENT STATUS</span>
                <p className="text-xs text-gray-400">
                    膜的碱性稳定性差，寿命仅几千小时。需要开发新型聚合物骨架（如无醚键芳香族聚合物）。
                </p>
            </div>
         </div>
      </div>
    ),
    clicks: 0,
    ttsText: "AEM 试图结合 ALK 的低成本和 PEM 的高性能。它使用非贵金属催化剂，但目前的挑战在于膜的寿命。"
  },

  // 15. Seawater Intro
  {
    id: 15,
    layout: 'cover',
    backgroundImage: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?q=80&w=2070&auto=format&fit=crop', // Ocean
    content: () => (
      <div className="absolute inset-0 bg-blue-900/30 flex items-center justify-center">
         <div className="max-w-4xl text-center">
            <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-6 shadow-lg shadow-blue-500/50">frontier breakthrough</div>
            <h1 className="text-7xl font-bold text-white mb-6 drop-shadow-lg">海水直接制氢</h1>
            <p className="text-2xl text-blue-200 font-light italic">"Hydrogen from the Ocean"</p>
         </div>
      </div>
    ),
    clicks: 0,
    ttsText: "在更遥远的前沿，是海水直接制氢。这被视为氢能领域的“圣杯”。"
  },

  // 16. Seawater Challenge & Solution
  {
    id: 16,
    layout: 'two-cols',
    title: '相变迁移机制',
    content: (step) => (
       <div className="grid grid-cols-2 gap-8 items-center h-full">
         <MotionFadeIn show={true} className="h-full">
             <DiagramCard 
                src="https://en.szu.edu.cn/__local/B/A5/85/7CAD345EA2B4099CACFB28A300C_FAE36121_2AA24.png?e=.png" 
                alt="Nature 2022 Mechanism"
                caption="Phase-Change Migration (Xie et al., Nature 2022)"
             />
         </MotionFadeIn>
         <div className="space-y-6">
             <div>
                <h3 className="text-xl font-bold text-red-400 mb-2">The Problem</h3>
                <p className="text-sm text-gray-400">海水中的杂质离子(Mg²⁺, Ca²⁺)会结垢，Cl⁻ 会腐蚀电极并产生有毒氯气。</p>
             </div>
             <div className="h-px bg-gray-700 w-full"></div>
             <div>
                <h3 className="text-xl font-bold text-green-400 mb-2">The Solution</h3>
                <h4 className="text-lg text-white font-bold mb-2">相变迁移 (Phase-Change Migration)</h4>
                <ul className="text-sm text-gray-300 space-y-3">
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold shrink-0">1</div>
                        利用气液界面压差，海水自然蒸发为水蒸气。
                    </li>
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold shrink-0">2</div>
                        水蒸气穿过疏水膜，在电解液侧冷凝为纯水。
                    </li>
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold shrink-0">3</div>
                        物理隔绝所有离子，实现<Highlight text="原位纯化" color="teal"/>。
                    </li>
                </ul>
             </div>
         </div>
       </div>
    ),
    clicks: 0,
    ttsText: "谢和平院士团队提出的相变迁移机制，利用水蒸气渗透膜物理隔绝了海水中所有的腐蚀性离子，实现了根本性突破。"
  },

  // 17. System Integration
  {
    id: 17,
    layout: 'image-left',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop', // Solar/Wind park
    title: '离网系统集成',
    content: (step) => (
      <div className="flex flex-col justify-center h-full p-8">
        <h1 className="text-4xl font-bold mb-6">离网制氢架构</h1>
        <p className="text-gray-400 mb-8">Wind-Solar-Hydrogen Coupling</p>
        
        <div className="space-y-4 text-sm">
             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition border border-transparent hover:border-teal-500/30">
                <Wind className="text-teal-400"/>
                <div className="flex-1">
                    <div className="text-white font-bold">波动电源</div>
                    <div className="text-gray-500">风电/光伏直接输入，无需并网。</div>
                </div>
             </div>
             <div className="flex justify-center text-gray-600">↓</div>
             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition border border-transparent hover:border-yellow-500/30">
                <Layers className="text-yellow-400"/>
                <div className="flex-1">
                    <div className="text-white font-bold">柔性直流微网 (DC/DC)</div>
                    <div className="text-gray-500">配备少量电池储能作为缓冲。</div>
                </div>
             </div>
             <div className="flex justify-center text-gray-600">↓</div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition border border-transparent hover:border-blue-500/30">
                <Factory className="text-blue-400"/>
                <div className="flex-1">
                    <div className="text-white font-bold">电解槽阵列</div>
                    <div className="text-gray-500">ALK (基荷) + PEM (调节) 混合配置。</div>
                </div>
             </div>
        </div>
      </div>
    ),
    clicks: 0,
    ttsText: "未来，我们将看到更多的离网系统。通过混合配置廉价的ALK和灵活的PEM，我们可以最大化系统效率并降低成本。"
  },

  // --- Section 5: Conclusion (Slides 18-20) ---

  // 18. Cost Model
  {
    id: 18,
    layout: 'center',
    title: 'LCOH 成本模型',
    content: (step) => (
      <div className="w-full flex flex-col items-center h-full justify-center">
         <h1 className="text-3xl font-bold mb-2">绿氢成本试算 (LCOH)</h1>
         <p className="text-gray-400 text-sm mb-8">Levelized Cost of Hydrogen</p>
         <div className="w-full max-w-4xl bg-gray-900/50 p-8 rounded-2xl border border-gray-700">
            <LCOHCalculator />
         </div>
      </div>
    ),
    clicks: 0,
    ttsText: "成本是商业化的关键。通过这个模型，我们可以看到电价和系统效率对最终氢气成本的巨大影响。"
  },

  // 19. Future Trends
  {
    id: 19,
    layout: 'center',
    title: '未来趋势',
    content: (step) => (
       <div className="grid grid-cols-3 gap-6 w-full max-w-6xl">
          <GlassCard className="text-center group border-t-4 border-t-teal-500">
             <div className="w-16 h-16 mx-auto bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition">
                <TrendingUp size={32}/>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">规模化 (Scale Up)</h3>
             <p className="text-sm text-gray-400">单体容量迈向 10MW+，部署规模迈向 GW 级。</p>
          </GlassCard>
          <GlassCard className="text-center group border-t-4 border-t-blue-500">
             <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition">
                <Gauge size={32}/>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">高压化 (Pressure)</h3>
             <p className="text-sm text-gray-400">电解槽直接产出 30-70bar 氢气，减少压缩机能耗。</p>
          </GlassCard>
           <GlassCard className="text-center group border-t-4 border-t-purple-500">
             <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition">
                <Microscope size={32}/>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">低载量 (Thrifting)</h3>
             <p className="text-sm text-gray-400">PEM 铱载量降低 90%，或完全被 AEM 取代。</p>
          </GlassCard>
       </div>
    ),
    clicks: 0,
    ttsText: "未来趋势可以概括为三个关键词：规模更大，压力更高，贵金属用量更少。"
  },

  // 20. End
  {
    id: 20,
    layout: 'cover',
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', // Earth
    content: () => (
      <div className="text-center z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl font-display font-bold mb-8 text-white tracking-tight">The Future is Hydrogen</h1>
        <p className="text-2xl text-teal-300 font-light italic mb-12">"Hydrogen is not just a fuel, it's a vector."</p>
        
        <div className="flex gap-12 text-sm text-gray-400 border-t border-white/10 pt-8">
            <div className="flex flex-col items-center gap-2">
                <Globe className="text-teal-400"/>
                <span>Decarbonization</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                <Anchor className="text-blue-400"/>
                <span>Energy Security</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Leaf className="text-green-400"/>
                <span>Sustainability</span>
            </div>
        </div>
      </div>
    ),
    clicks: 0,
    ttsText: "氢不仅仅是燃料，更是连接未来的能源载体。感谢观看。"
  }
];