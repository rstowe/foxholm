import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ProcessingStatus.css';

const ProcessingStatus = () => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(t('common.processingStatus.messages[0]'));
  
  // Get all messages from translations
  const messages = t('common.processingStatus.messages', { returnObjects: true });

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
            <span>{t('common.processingStatus.advertisement')}</span>
            <div className="ad-dimensions">{t('common.processingStatus.adDimensions')}</div>
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
          <p className="processing-time">{t('common.processingStatus.timeEstimate')}</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;