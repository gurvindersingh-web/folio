import React from 'react';
import GradientWaves from './GradientWaves';

const ProjectDMMVisualiser = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#111' }}>
      {/* Background */}
      <GradientWaves 
        horizonColor="#222"
        waveColor="#111"
        crestColor="#333"
        amplitude={1.5}
        waveScale={0.8}
        className="dmm-waves-bg"
      />

      {/* Overlay UI */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', padding: '1.5rem', pointerEvents: 'none' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"Press Start 2P", monospace', fontSize: '0.6rem', color: '#888' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>(写)</span>
            <span style={{ color: '#ccc' }}>DMMVisualiser</span>
            <span style={{ padding: '0.2rem 0.4rem', backgroundColor: '#222', borderRadius: '4px' }}>v2.0</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ pointerEvents: 'auto', cursor: 'pointer' }}>GitHub</span>
            <span style={{ pointerEvents: 'auto', cursor: 'pointer' }}>Docs</span>
          </div>
        </div>

        {/* Center Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
          <h2 style={{ 
            fontFamily: '"Press Start 2P", monospace', 
            fontSize: '1.8rem', 
            color: '#fff', 
            textAlign: 'center', 
            lineHeight: 1.5,
            margin: 0,
            textShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            Dynamic<br />Memory<br />Management<br />
            <span style={{ color: '#aaa' }}>Visualiser</span>
          </h2>

          <p style={{ 
            fontFamily: '"Inter", sans-serif', 
            fontSize: '0.75rem', 
            color: '#888', 
            textAlign: 'center',
            maxWidth: '400px',
            lineHeight: 1.6
          }}>
            Explore how your operating system manages memory in real-time. Visualise FIFO, LRU, and Optimal page replacement algorithms with stunning animations, TLB simulation, working set tracking, and Belady's anomaly detection — all in one interactive tool.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['3 Algorithms', 'Live TLB', 'Page Table', 'Thrashing Detection', 'PDF Export', 'Theme Options'].map((tag, i) => (
              <span key={i} style={{ 
                fontFamily: '"JetBrains Mono", monospace', 
                fontSize: '0.5rem', 
                padding: '0.3rem 0.6rem', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                color: '#aaa'
              }}>
                {tag}
              </span>
            ))}
          </div>

          <button style={{
            pointerEvents: 'auto',
            marginTop: '1rem',
            padding: '0.6rem 2rem',
            backgroundColor: '#d4cebd',
            color: '#111',
            border: 'none',
            borderRadius: '4px',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            ▶ Start Simulation
          </button>
          
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.5rem', color: '#555', marginTop: '0.5rem' }}>
            Press <span style={{ padding: '0.1rem 0.3rem', border: '1px solid #333', borderRadius: '2px' }}>Enter</span> to begin · <span style={{ padding: '0.1rem 0.3rem', border: '1px solid #333', borderRadius: '2px' }}>H</span> for help
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDMMVisualiser;
