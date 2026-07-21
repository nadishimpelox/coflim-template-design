import React from 'react';
import { 
  Play, VolumeX, Camera, Clock, Globe, Book, 
  ExternalLink, TrendingDown, Clock3, Zap, Lightbulb,
  Copy, ThumbsUp, ThumbsDown, Bookmark, Plus, ArrowUp, X
} from 'lucide-react';
import './User.css';

const User = () => {
  return (
    <div className="user-container">
      {/* Top Banner */}
      <div className="user-top-banner">
        <Play size={14} fill="#000" />
        <strong>Learning center</strong> — watch video tutorials
      </div>

      <div className="pickup-banner">
        <div className="pickup-left">
          <div className="pickup-icon">
            <span role="img" aria-label="home">🏠</span>
          </div>
          <div>
            <div className="pickup-text">Pick up where you left off</div>
            <strong>Voice profile setup</strong> - just now
          </div>
        </div>
        <div className="pickup-actions">
          Continue &rarr;
          <X size={16} color="#999" style={{cursor: 'pointer'}} />
        </div>
      </div>

      {/* Navigation */}
      <div className="user-nav-row">
        <div className="board-tabs">
          <div className="board-tab active">New board</div>
          <div className="board-tab" style={{color: '#666', border: 'none', background: 'transparent'}}>
            ✨ Skills
          </div>
        </div>
        <div className="only-you">
          <span role="img" aria-label="lock">🔒</span> Only you
        </div>
      </div>

      <main className="user-content">
        <div className="link-row">
          <div className="link-bubble">https://www.instagram.com/reel/demo</div>
        </div>
        <div className="link-actions">
          <button className="icon-btn"><Copy size={16}/></button>
          <button className="icon-btn"><ThumbsUp size={16}/></button>
          <button className="icon-btn"><ThumbsDown size={16}/></button>
          <button className="icon-btn" style={{fontWeight: 500, fontSize: '0.85rem'}}>Save</button>
        </div>

        {/* Video Card */}
        <div className="video-card">
          <div className="video-player-mock">
            <div className="video-top-overlay">
              <span>0:41</span>
              <span className="talking-head-pill">Talking head</span>
              <VolumeX size={16} />
            </div>
            <div className="play-btn-circle">
              <Play size={20} fill="#000" style={{marginLeft: '4px'}} />
            </div>
          </div>

          <div className="video-details">
            <div className="account-info">
              <div className="ig-icon"><Camera size={20} /></div>
              <div>
                <div className="account-name">@getcofilms <span className="account-platform">INSTAGRAM</span></div>
                <div className="video-type">Your reel</div>
              </div>
            </div>

            <div className="meta-chips">
              <div className="meta-chip"><Clock size={14}/> 0:41</div>
              <div className="meta-chip"><Globe size={14}/> EN</div>
              <div className="meta-chip"><Book size={14}/> tutorial</div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label">VIEWS</div>
                <div className="stat-value">218</div>
              </div>
              <div className="stat-box alert">
                <div className="stat-label">AVG WATCH</div>
                <div className="stat-value">32%</div>
                <div className="stat-sub">Below average</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">ENGAGEMENT</div>
                <div className="stat-value">13</div>
              </div>
            </div>

            <div className="link-box">
              <Globe size={14} color="#888"/>
              www.instagram.com/reel/demo
              <ExternalLink size={14} color="#888"/>
            </div>
          </div>
        </div>

        {/* Action Chips */}
        <div className="action-chips">
          <div className="action-chip">
            <TrendingDown size={16} color="#db2777" /> Why viewers leave at the beginning
          </div>
          <div className="action-chip">
            <Clock3 size={16} color="#7c3aed" /> Why viewers leave at 8-10 sec
          </div>
          <div className="action-chip">
            <Zap size={16} color="#ef4444" /> How to improve the hook
          </div>
          <div className="action-chip">
            <Lightbulb size={16} color="#eab308" /> What works in this reel
          </div>
        </div>

        {/* Prompt Input */}
        <div className="prompt-area">
          <textarea className="prompt-input" placeholder="Ask about your video..."></textarea>
          <div className="prompt-footer">
            <div className="prompt-tools">
              <div className="tool-btn" style={{padding: '0.4rem', border: '1px solid #eaeaea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}><Plus size={16} color="#666"/></div>
              <div className="tool-chip"><span role="img" aria-label="memory">🧠</span> Memory</div>
              <div className="tool-chip"><span role="img" aria-label="opus">✴️</span> Opus 4.7 <ChevronDown size={14}/></div>
            </div>
            <button className="send-btn">
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

/* We need ChevronDown for Opus 4.7 chip, so I'll create a local component or import it. */
import { ChevronDown } from 'lucide-react';

export default User;
