import React, { useState, useEffect } from 'react';
import './ProcessingStatus.css';

const ProcessingStatus = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Initializing...');

  const messages = [
    'Uploading image...',
    'Analyzing content...',
    'Applying AI enhancements...',
    'Generating result...',
    'Finalizing...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const messageIndex = Math.floor(progress / 20);
    if (messageIndex < messages.length) {
      setMessage(messages[messageIndex]);
    }
  }, [progress]);

  return (
    <div className="processing-status">
      <div className="processing-modal-container">
        {/* Video Ad Placeholder */}
        <div className="video-ad-placeholder">
          <div className="ad-content">
            <span>Advertisement</span>
            <div className="ad-dimensions">360 x 450</div>
          </div>
        </div>
        
        {/* Compact Processing Info Below Ad */}
        <div className="processing-info-compact">
          <div className="loading-animation">
            <div className="loading-bar">
              <div className="loading-fill" style={{ width: `${progress}%` }}></div>
              <div className="loading-glow"></div>
            </div>
          </div>
          
          <p className="processing-message">
            {message}
            <span className="loading-dots">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </span>
          </p>
          <p className="processing-time">Processing time: 20-30 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;