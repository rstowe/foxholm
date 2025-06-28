import React, { useState, useEffect, useRef } from 'react';
import './ResultDisplay.css';

const ResultDisplay = ({ result, onReset }) => {
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
          title: 'Check out my AI-enhanced image!',
          text: 'Created with Foxholm AI Image Tools',
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
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
      aria-label="Image processing results"
    >
      <div className="result-content">
        {showComparison ? (
          <div className="comparison-view">
            {/* Enhanced image first for mobile */}
            <div className="image-container processed">
              <h4>Enhanced</h4>
              <img src={result.processedImage} alt="Enhanced" />
            </div>
            <div className="comparison-divider"></div>
            <div className="image-container original">
              <h4>Original</h4>
              <img src={result.originalImage} alt="Original" />
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
            Compare
          </button>
          <button
            className={`toggle-btn ${!showComparison ? 'active' : ''}`}
            onClick={() => setShowComparison(false)}
          >
            Result Only
          </button>
        </div>
      </div>

      {result.processingDetails && (
        <div className="processing-details">
          <h4>Processing Details</h4>
          <ul>
            {result.originalDimensions && (
              <li>
                Original: {result.originalDimensions.width} × {result.originalDimensions.height}
              </li>
            )}
            {result.targetDimensions && (
              <li>
                Enhanced: {result.targetDimensions.width} × {result.targetDimensions.height}
              </li>
            )}
            {result.analysis && (
              <li>
                Detected: {result.analysis.damageDetected.join(', ')}
              </li>
            )}
            <li>Processed at: {new Date(result.processingDetails.timestamp).toLocaleString()}</li>
          </ul>
        </div>
      )}

      <div className="result-actions">
        <button
          className={`btn btn-download ${downloadComplete ? 'download-complete' : ''}`}
          onClick={handleDownload}
        >
          {downloadComplete ? '✓ Downloaded!' : '⬇ Download Image'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={onReset}
        >
          🔄 Try Another
        </button>
      </div>

      <div className="result-footer">
        <p className="satisfaction-prompt">
          Happy with the result? Share your experience!
        </p>
        <div className="social-links">
          <a href="#" className="social-link">Twitter</a>
          <a href="#" className="social-link">Facebook</a>
          <a href="#" className="social-link">Instagram</a>
        </div>
      </div>
    </section>
  );
};

export default ResultDisplay;