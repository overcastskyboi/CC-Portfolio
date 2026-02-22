import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BPMTimingCalculator = () => {
  const navigate = useNavigate();
  const [bpm, setBpm] = useState(120);
  const [timings, setTimings] = useState(null);

  const calculateBPMTimings = (bpm) => {
    if (!bpm || bpm <= 0) return null;

    const quarterNoteMs = 60000 / bpm;

    const baseTimings = {
      whole: quarterNoteMs * 4,
      half: quarterNoteMs * 2,
      quarter: quarterNoteMs,
      eighth: quarterNoteMs / 2,
      sixteenth: quarterNoteMs / 4,
      thirtySecond: quarterNoteMs / 8,
      sixtyFourth: quarterNoteMs / 16,
      oneTwentyEighth: quarterNoteMs / 32
    };

    const generateVariations = (ms) => ({
      straight: Number(ms.toFixed(2)),
      dotted: Number((ms * 1.5).toFixed(2)),
      triplet: Number((ms * 0.66667).toFixed(2))
    });

    return {
      bpm,
      delays: {
        "1/4": generateVariations(baseTimings.quarter),
        "1/8": generateVariations(baseTimings.eighth),
        "1/16": generateVariations(baseTimings.sixteenth),
        "1/32": generateVariations(baseTimings.thirtySecond)
      },
      reverb: {
        preDelayTightMs: Number(baseTimings.oneTwentyEighth.toFixed(2)),
        preDelayLooseMs: Number(baseTimings.sixtyFourth.toFixed(2)),
        tailDecayMs: Number((baseTimings.whole + baseTimings.half).toFixed(2))
      },
      compressor: {
        releaseFastMs: Number(baseTimings.sixteenth.toFixed(2)),
        releaseMediumMs: Number(baseTimings.eighth.toFixed(2)),
        releaseSlowMs: Number(baseTimings.quarter.toFixed(2)),
        attackSnapMs: Number((baseTimings.oneTwentyEighth / 2).toFixed(2)) 
      },
      lfoHz: {
        "1/4": Number((1000 / baseTimings.quarter).toFixed(3)),
        "1/8": Number((1000 / baseTimings.eighth).toFixed(3)),
        "1/16": Number((1000 / baseTimings.sixteenth).toFixed(3)),
        "1/32": Number((1000 / baseTimings.thirtySecond).toFixed(3))
      }
    };
  };

  const handleCalculate = () => {
    const calculated = calculateBPMTimings(bpm);
    setTimings(calculated);
  };

  const handleReset = () => {
    setBpm(120);
    setTimings(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-700 rounded text-yellow-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-lg font-bold">BPM Timing Calculator</h2>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* BPM Input */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">BPM</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value) || 0)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-center text-2xl font-bold w-32 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleCalculate}
              className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Calculate
            </button>
            {timings && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {timings && (
          <div className="space-y-6">
            {/* Delays Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-4">Delays</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(timings.delays).map(([note, variations]) => (
                  <div key={note} className="bg-gray-700 rounded-lg p-4">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{note}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Straight</span>
                        <span className="font-bold text-white">{variations.straight} ms</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Dotted</span>
                        <span className="font-bold text-white">{variations.dotted} ms</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Triplet</span>
                        <span className="font-bold text-white">{variations.triplet} ms</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reverb Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-4">Reverb</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Pre-delay</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Tight</span>
                      <span className="font-bold text-white">{timings.reverb.preDelayTightMs} ms</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Loose</span>
                      <span className="font-bold text-white">{timings.reverb.preDelayLooseMs} ms</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Tail Decay</div>
                  <div className="text-center text-2xl font-bold text-white">
                    {timings.reverb.tailDecayMs} ms
                  </div>
                </div>
              </div>
            </div>

            {/* Compressor Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-4">Compressor</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Release</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Fast</span>
                      <span className="font-bold text-white">{timings.compressor.releaseFastMs} ms</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Medium</span>
                      <span className="font-bold text-white">{timings.compressor.releaseMediumMs} ms</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Slow</span>
                      <span className="font-bold text-white">{timings.compressor.releaseSlowMs} ms</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Attack</div>
                  <div className="text-center text-2xl font-bold text-white">
                    {timings.compressor.attackSnapMs} ms
                  </div>
                </div>
              </div>
            </div>

            {/* LFO Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-4">LFO Rate</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(timings.lfoHz).map(([note, hz]) => (
                  <div key={note} className="bg-gray-700 rounded-lg p-4">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{note}</div>
                    <div className="text-center text-2xl font-bold text-white">
                      {hz} Hz
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BPMTimingCalculator;