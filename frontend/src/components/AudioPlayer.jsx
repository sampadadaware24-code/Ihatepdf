import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Download, Volume2 } from 'lucide-react';
import './AudioPlayer.css';

export default function AudioPlayer({ audioUrl, fileName }) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bars, setBars] = useState(Array.from({ length: 32 }, () => Math.random() * 0.3 + 0.1));

  const animationRef = useRef(null);

  const animateBars = useCallback(() => {
    if (isPlaying) {
      setBars(prev => prev.map(() => Math.random() * 0.8 + 0.2));
      animationRef.current = requestAnimationFrame(animateBars);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      // Throttle the bar animation to ~10fps for performance
      const interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 0.8 + 0.2));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setBars(Array.from({ length: 32 }, () => Math.random() * 0.3 + 0.1));
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * duration;
    setCurrentTime(audioRef.current.currentTime);
  };

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`audio-player ${isPlaying ? 'audio-player--playing' : ''}`} id="audio-player">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Header */}
      <div className="audio-player__header">
        <div className="audio-player__icon">
          <Volume2 size={20} strokeWidth={1.5} />
        </div>
        <div className="audio-player__meta">
          <p className="audio-player__file-name">{fileName || 'Audio'}</p>
          <p className="audio-player__duration">{formatTime(duration)} total</p>
        </div>
      </div>

      {/* Waveform */}
      <div className="audio-player__waveform">
        {bars.map((h, i) => (
          <span
            key={i}
            className="audio-player__wave-bar"
            style={{
              height: `${h * 100}%`,
              opacity: (i / bars.length) * 100 < progress ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="audio-player__controls">
        <button
          className="audio-player__play-btn"
          onClick={togglePlay}
          id="play-pause-btn"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 2 }} />}
        </button>

        <div className="audio-player__progress-wrapper">
          <span className="audio-player__time">{formatTime(currentTime)}</span>
          <div
            className="audio-player__progress"
            ref={progressRef}
            onClick={handleProgressClick}
            id="audio-progress-bar"
          >
            <div className="audio-player__progress-fill" style={{ width: `${progress}%` }}>
              <span className="audio-player__progress-dot" />
            </div>
          </div>
          <span className="audio-player__time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="audio-player__actions">
        <a
          href={audioUrl}
          download
          className="audio-player__download-btn"
          id="download-audio-btn"
        >
          <Download size={16} />
          Download Audio
        </a>
      </div>
    </div>
  );
}
