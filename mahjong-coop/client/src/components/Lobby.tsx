import React, { useState } from 'react';

interface LobbyProps {
  joinGame: (name: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ joinGame }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      setIsLoading(true);
      joinGame(name.trim());
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%, #111827 100%)',
    color: '#e2e8f0',
  };

  const glowStyle: React.CSSProperties = {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 0,
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1.2',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: '500px',
    marginBottom: '20px',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    padding: '40px',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    backdropFilter: 'blur(10px)',
  };

  const inputStyle: React.CSSProperties = {
    padding: '14px 16px',
    fontSize: '1.05rem',
    borderRadius: '10px',
    border: '2px solid #334155',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    color: '#e2e8f0',
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  const inputFocusStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#0ea5e9',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '14px 24px',
    fontSize: '1.05rem',
    cursor: isLoading || !name.trim() ? 'not-allowed' : 'pointer',
    backgroundColor:
      isLoading || !name.trim() ? '#475569' : 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    opacity: isLoading || !name.trim() ? 0.6 : 1,
    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const buttonHoverStyle: React.CSSProperties = {
    ...buttonStyle,
    transform: isLoading || !name.trim() ? 'none' : 'translateY(-2px)',
    boxShadow: isLoading || !name.trim() 
      ? '0 4px 15px rgba(14, 165, 233, 0.3)' 
      : '0 8px 25px rgba(14, 165, 233, 0.5)',
  };

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={glowStyle} />

      <div style={contentStyle}>
        <div>
          <div style={titleStyle}>🀄 Mahjong</div>
          <div
            style={{
              fontSize: '1.8rem',
              color: '#10b981',
              fontWeight: '600',
              textAlign: 'center',
              marginTop: '-5px',
            }}
          >
            Collaborative
          </div>
        </div>

        <p style={subtitleStyle}>
          Play with up to 5 friends in real-time. Find matching tiles and outscore your team!
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            style={isInputFocused ? inputFocusStyle : inputStyle}
            disabled={isLoading}
            autoFocus
            maxLength={20}
          />
          <span
            style={{
              fontSize: '0.8rem',
              color: '#64748b',
              textAlign: 'right',
              marginTop: '-12px',
            }}
          >
            {name.length}/20
          </span>
          <button
            type="submit"
            style={isHovering && !isLoading && name.trim() ? buttonHoverStyle : buttonStyle}
            disabled={isLoading || !name.trim()}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isLoading ? '⏳ Joining...' : '🎮 Join Game'}
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            gap: '30px',
            marginTop: '20px',
            padding: '20px',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            border: '1px solid #334155',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Up to 5 Players</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Real-time Sync</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🏆</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Live Scoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};