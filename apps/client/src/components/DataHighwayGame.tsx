import { useCallback, useEffect, useRef, useState } from 'react';
import { Gamepad2, RotateCcw, Shield, Zap, Award, ChevronLeft, ChevronRight } from 'lucide-react';

export interface CollectibleItem {
  label: string;
  fact: string;
  chapter: string;
}

export interface ChapterItem {
  title: string;
  description: string;
}

export interface DataHighwayGameProps {
  collectibles?: CollectibleItem[];
  chapters?: ChapterItem[];
  missions?: string[];
  obstacleLabels?: string[];
  rewardLabels?: string[];
  vehicleLabel?: string;
  baseSpeed?: number;
  difficulty?: 'easy' | 'normal' | 'hard';
  mobileSimplifiedMode?: boolean;
}

interface ActiveToken {
  x: number;
  y: number;
  label: string;
  fact: string;
  chapter: string;
  collected: boolean;
  type: 'signal' | 'shield' | 'boost';
}

const DEFAULT_COLLECTIBLES: CollectibleItem[] = [
  { label: 'Academic Star', fact: 'Maintained a 3.99 CGPA across CSE curriculum.', chapter: 'Academic' },
  { label: 'Research Core', fact: 'Pioneered context-aware short-term load forecasting research.', chapter: 'Research' },
  { label: 'Project Chip', fact: 'Engineered high-performance full-stack web and AI systems.', chapter: 'Projects' },
  { label: 'Publication File', fact: 'Published peer-reviewed findings in international venues.', chapter: 'Publications' },
  { label: 'Impact Badge', fact: 'Led tech communities, workshops, and cross-functional teams.', chapter: 'Leadership' },
  { label: 'Community Beacon', fact: 'Organized national hackathons and developer summits.', chapter: 'Community' }
];

export function DataHighwayGame({
  collectibles = DEFAULT_COLLECTIBLES,
  chapters = [],
  missions = [],
  obstacleLabels = ['Latency Spike', 'Memory Leak', 'Drop Wall'],
  rewardLabels = ['Shield Cell', 'Cache Boost'],
  vehicleLabel = 'Nexus Runner',
  baseSpeed = 4,
  difficulty = 'normal',
  mobileSimplifiedMode = false
}: DataHighwayGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeItems = collectibles.length > 0 ? collectibles : DEFAULT_COLLECTIBLES;

  const [score, setScore] = useState(0);
  const [integrity, setIntegrity] = useState(100);
  const [shield, setShield] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [recentFact, setRecentFact] = useState<string>('Press Left / Right or A / D to steer. Collect verified portfolio signals!');
  const [collectedFacts, setCollectedFacts] = useState<string[]>([]);

  const speedMultiplier = difficulty === 'hard' ? 1.3 : difficulty === 'easy' ? 0.8 : 1.0;
  const currentSpeed = baseSpeed * speedMultiplier;

  const stateRef = useRef({
    carX: 250,
    speed: currentSpeed,
    distance: 0,
    keys: new Set<string>(),
    tokens: [] as ActiveToken[],
    running: true,
    integrity: 100,
    shield: 1,
    score: 0
  });

  const reset = useCallback(() => {
    const tokens: ActiveToken[] = activeItems.map((item, index) => ({
      x: 100 + ((index * 137) % 300),
      y: -100 - index * 190,
      label: item.label,
      fact: item.fact,
      chapter: item.chapter,
      collected: false,
      type: 'signal'
    }));

    // Add intermittent bonus tokens
    tokens.push({
      x: 250,
      y: -450,
      label: 'Shield +1',
      fact: 'System defenses reinforced.',
      chapter: 'Bonus',
      collected: false,
      type: 'shield'
    });

    stateRef.current = {
      carX: 250,
      speed: currentSpeed,
      distance: 0,
      keys: new Set<string>(),
      tokens,
      running: true,
      integrity: 100,
      shield: 1,
      score: 0
    };

    setScore(0);
    setIntegrity(100);
    setShield(1);
    setCompleted(false);
    setGameOver(false);
    setCollectedFacts([]);
    setRecentFact('Route initialized. Accelerating onto the Data Highway...');
  }, [activeItems, currentSpeed]);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's'].includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
      stateRef.current.keys.add(event.key.toLowerCase());
    };
    const up = (event: KeyboardEvent) => {
      stateRef.current.keys.delete(event.key.toLowerCase());
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;

    const render = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Cyber Sky/Highway
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#040b10');
      bgGrad.addColorStop(0.5, '#051314');
      bgGrad.addColorStop(1, '#020607');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Highway perspective bounds
      ctx.strokeStyle = 'rgba(98,245,210,.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, canvas.height);
      ctx.lineTo(170, 0);
      ctx.moveTo(canvas.width - 50, canvas.height);
      ctx.lineTo(canvas.width - 170, 0);
      ctx.stroke();

      // Highway lane dividers
      for (let i = 0; i < 12; i++) {
        const y = ((i * 68 + state.distance * 3) % (canvas.height + 80)) - 80;
        const progress = Math.max(0.1, y / canvas.height);
        const centerX = canvas.width / 2;
        const laneW = 4 + progress * 6;
        ctx.fillStyle = `rgba(98, 245, 210, ${0.15 + progress * 0.4})`;
        ctx.fillRect(centerX - laneW / 2, y, laneW, 24 + progress * 24);
      }

      // Handle Vehicle Movement
      if (state.running) {
        const steerSpeed = 6;
        if (state.keys.has('arrowleft') || state.keys.has('a')) {
          state.carX -= steerSpeed;
        }
        if (state.keys.has('arrowright') || state.keys.has('d')) {
          state.carX += steerSpeed;
        }
        state.carX = Math.max(80, Math.min(canvas.width - 80, state.carX));
        state.distance += state.speed;
      }

      // Draw Vehicle (Cyber Car)
      const carY = canvas.height - 90;
      ctx.save();
      ctx.translate(state.carX, carY);

      // Neon Thruster Glow
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#62f5d2';
      ctx.fillStyle = '#62f5d2';
      ctx.beginPath();
      ctx.roundRect(-22, -38, 44, 76, 12);
      ctx.fill();

      // Vehicle Cockpit & Detailing
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#061313';
      ctx.fillRect(-14, -22, 28, 20);

      // Cyber Neon Headlights & Tail Lights
      ctx.fillStyle = '#8f7cff';
      ctx.fillRect(-18, 20, 10, 8);
      ctx.fillRect(8, 20, 10, 8);

      // Shield Aura if active
      if (state.shield > 0) {
        ctx.strokeStyle = 'rgba(143, 124, 255, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 44, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Render Tokens & Collectibles
      const totalSignals = state.tokens.filter(t => t.type === 'signal').length;
      let collectedSignals = 0;

      state.tokens.forEach((token) => {
        if (token.collected) {
          if (token.type === 'signal') collectedSignals++;
          return;
        }

        if (state.running) {
          token.y += state.speed;
        }

        // Token Visuals
        const isShield = token.type === 'shield';
        const color = isShield ? '#8f7cff' : '#62f5d2';
        const pulse = 13 + Math.sin(performance.now() / 200 + token.x) * 2.5;

        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(token.x, token.y, pulse, 0, Math.PI * 2);
        ctx.fill();

        // Label above token
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 11px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(token.label, token.x, token.y - 18);
        ctx.restore();

        // Collision Check
        const distDist = Math.hypot(token.x - state.carX, token.y - carY);
        if (distDist < 42) {
          token.collected = true;
          if (token.type === 'signal') {
            state.score += 1;
            setScore(state.score);
            setRecentFact(token.fact);
            setCollectedFacts((prev) => [...prev, token.fact]);
          } else if (token.type === 'shield') {
            state.shield = Math.min(3, state.shield + 1);
            setShield(state.shield);
            setRecentFact('Defensive shields boosted!');
          }
        }
      });

      // Victory Condition
      if (collectedSignals >= totalSignals && totalSignals > 0) {
        state.running = false;
        setCompleted(true);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const nudge = (direction: -1 | 1) => {
    stateRef.current.carX = Math.max(80, Math.min(420, stateRef.current.carX + direction * 45));
  };

  const totalTokens = activeItems.length;

  return (
    <div className="game-shell game-shell--arcade">
      {/* Header HUD */}
      <div className="game-hud">
        <div className="game-hud__title">
          <span>
            <Gamepad2 size={18} /> DATA HIGHWAY // {vehicleLabel.toUpperCase()}
          </span>
          <small>DIFFICULTY: {difficulty.toUpperCase()} | TARGET SIGNALS: {totalTokens}</small>
        </div>
        <div className="game-hud__meta">
          <div>
            <small>SIGNALS</small>
            <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--accent)' }}>
              {score} / {totalTokens}
            </strong>
          </div>
          <div>
            <small>INTEGRITY</small>
            <strong style={{ display: 'block', fontSize: '1.25rem', color: '#62f5d2' }}>
              {integrity}%
            </strong>
          </div>
          <div>
            <small>SHIELDS</small>
            <strong style={{ display: 'block', fontSize: '1.25rem', color: '#8f7cff' }}>
              {shield} ACTIVE
            </strong>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="canvas-wrap" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={560}
          style={{ width: '100%', maxWidth: '500px', display: 'block', borderRadius: '8px' }}
        />

        {/* Completion Modal */}
        {completed && (
          <div
            className="game-complete"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 12, 18, 0.94)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              textAlign: 'center',
              borderRadius: '8px'
            }}
          >
            <div style={{ color: 'var(--accent)', marginBottom: '12px' }}>
              <Award size={48} />
            </div>
            <b style={{ fontSize: '1.5rem', letterSpacing: '0.05em', color: '#fff' }}>MISSION COMPLETE</b>
            <p style={{ color: 'var(--muted)', maxWidth: '380px', margin: '12px 0 20px' }}>
              All {totalTokens} portfolio milestones mapped successfully! You unlocked Choyon Dhor&apos;s verified research and engineering profile.
            </p>
            <button className="button" onClick={reset}>
              <RotateCcw size={16} /> Replay Mission
            </button>
          </div>
        )}
      </div>

      {/* Live Discovery Feed */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(191, 214, 255, 0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Zap size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)' }}>
            DISCOVERY FEED
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#d0e2e0', lineHeight: 1.5 }}>
          {recentFact}
        </p>
      </div>

      {/* Steering Controls */}
      <div className="game-controls game-controls--arcade" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onPointerDown={() => nudge(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', cursor: 'pointer' }}
        >
          <ChevronLeft size={18} /> STEER LEFT
        </button>
        <p className="game-controls__hint" style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
          Keyboard: [← / →] or [A / D] to steer
        </p>
        <button
          type="button"
          onPointerDown={() => nudge(1)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', cursor: 'pointer' }}
        >
          STEER RIGHT <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
