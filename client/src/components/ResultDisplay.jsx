import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './ResultDisplay.css';

const ResultDisplay = ({ result, onReset }) => {
  const { t } = useTranslation();
  const resultRef = useRef(null);
  const [showComparison, setShowComparison] = useState(true);
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    // Focus the result display when it appears or when result changes
    if (result && resultRef.current) {
      // Using setTimeout to ensure the element is in the DOM and focusable
      const timer = setTimeout(() => {
        resultRef.current.focus({ preventScroll: true });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleDownload = async () => {
    try {
      // If the processed image is a URL, fetch it first
      let imageData = result.processedImage;
      
      if (imageData.startsWith('http')) {
        const response = await fetch(imageData);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          imageData = reader.result;
          downloadImage(imageData);
        };
        reader.readAsDataURL(blob);
      } else {
        downloadImage(imageData);
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const downloadImage = (imageData) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `foxholm-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadComplete(true);
    setTimeout(() => setDownloadComplete(false), 3000);
  };

  const shareImage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('common.resultDisplay.share.title'),
          text: t('common.resultDisplay.share.text'),
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(t('common.resultDisplay.share.linkCopied'));
    }
  };

  // Use a semantic section element for better accessibility
  return (
    <section 
      className="result-display" 
      ref={resultRef}
      tabIndex="-1"
      role="region"
      aria-live="polite"
      aria-atomic="true"
      aria-label={t('common.resultDisplay.aria.regionLabel')}
    >
      <div className="result-content">
        {showComparison ? (
          <div className="comparison-view">
            {/* Enhanced image first for mobile */}
            <div className="image-container processed">
              <h4>{t('common.resultDisplay.comparisonView.enhanced')}</h4>
              <img src={result.processedImage} alt={t('common.resultDisplay.comparisonView.enhanced')} />
            </div>
            <div className="comparison-divider"></div>
            <div className="image-container original">
              <h4>{t('common.resultDisplay.comparisonView.original')}</h4>
              <img src={result.originalImage} alt={t('common.resultDisplay.comparisonView.original')} />
            </div>
          </div>
        ) : (
          <div className="single-view">
            <img src={result.processedImage} alt="Enhanced" />
          </div>
        )}

        <div className="view-toggle">
          <button
            className={`toggle-btn ${showComparison ? 'active' : ''}`}
            onClick={() => setShowComparison(true)}
          >
            {t('common.resultDisplay.comparisonView.compare')}
          </button>
          <button
            className={`toggle-btn ${!showComparison ? 'active' : ''}`}
            onClick={() => setShowComparison(false)}
          >
            {t('common.resultDisplay.comparisonView.resultOnly')}
          </button>
        </div>
      </div>

      {result.processingDetails && (
        <div className="processing-details">
          <h4>{t('common.resultDisplay.processingDetails.title')}</h4>
          <ul>
            {result.originalDimensions && (
              <li>
                {t('common.resultDisplay.processingDetails.original')}: {t('common.resultDisplay.processingDetails.dimensions', {
                  width: result.originalDimensions.width,
                  height: result.originalDimensions.height
                })}
              </li>
            )}
            {result.targetDimensions && (
              <li>
                {t('common.resultDisplay.processingDetails.enhanced')}: {t('common.resultDisplay.processingDetails.dimensions', {
                  width: result.targetDimensions.width,
                  height: result.targetDimensions.height
                })}
              </li>
            )}
            {result.analysis && (
              <li>
                {t('common.resultDisplay.processingDetails.detected')}: {result.analysis.damageDetected.join(', ')}
              </li>
            )}
            <li>{t('common.resultDisplay.processingDetails.processedAt')}: {new Date(result.processingDetails.timestamp).toLocaleString()}</li>
          </ul>
        </div>
      )}

      <div className="result-actions">
        <button
          className={`btn btn-download ${downloadComplete ? 'download-complete' : ''}`}
          onClick={handleDownload}
        >
          {downloadComplete ? t('common.resultDisplay.actions.downloadComplete') : t('common.resultDisplay.actions.download')}
        </button>
        <button
          className="btn btn-secondary"
          onClick={onReset}
        >
          {t('common.resultDisplay.actions.tryAnother')}
        </button>
      </div>

      <div className="result-footer">
        <p className="satisfaction-prompt">
          {t('common.resultDisplay.share.satisfactionPrompt')}
        </p>
        <div className="social-links">
          <a href="#" className="social-link">{t('common.resultDisplay.share.social.twitter')}</a>
          <a href="#" className="social-link">{t('common.resultDisplay.share.social.facebook')}</a>
          <a href="#" className="social-link">{t('common.resultDisplay.share.social.instagram')}</a>
        </div>
      </div>
    </section>
  );
};

export default ResultDisplay;