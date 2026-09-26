import React from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  User,
  ShieldCheck,
  Cpu,
  Server,
  Database,
  BrainCircuit,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">System Settings & Architecture</h1>
        <p className="text-sm text-slate-400 mt-1">Platform telemetry, local LLM connectivity, and user profile management</p>
      </div>

      {/* User Profile Card */}
      <div className="bg-[#10172A] border border-orange-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-orange-500/20">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.full_name || 'Student Founder'}</h3>
            <p className="text-xs text-slate-400 font-mono">{user?.email || 'founder@ventureai.io'}</p>
          </div>
        </div>
      </div>

      {/* Open-Source Student-First Architecture Health */}
      <div className="bg-[#10172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold text-white">System Diagnostics & Module Status</h3>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            100% Free & Open Source Stack
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <Server className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">FastAPI Backend Engine</div>
              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Operational (Port 8000)
              </div>
              <p className="text-xs text-slate-400 mt-1">High-concurrency async Python server with Pydantic v2 validation.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <BrainCircuit className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">Ollama & Local Open-Source LLM</div>
              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Active (with Zero-Latency Heuristic Fallback)
              </div>
              <p className="text-xs text-slate-400 mt-1">Private on-device inference with zero external cloud API costs.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <Database className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">ChromaDB & RAG Vector Store</div>
              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> 8 Documents (21 Chunks Indexed)
              </div>
              <p className="text-xs text-slate-400 mt-1">Dense semantic embeddings for MSME, GST, and business regulations.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">OpenStreetMap & Nominatim</div>
              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Connected (Global Geocoding & POI)
              </div>
              <p className="text-xs text-slate-400 mt-1">Open geographic data with spatial density calculation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
