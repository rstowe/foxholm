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
        
        {/* Processing Content */}
        <div className="processing-content">
          <div className="processing-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          
          <div className="processing-info">
            <h4>Processing Your Image</h4>
            <p>{message}</p>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="processing-note">
              This usually takes 20-30 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;