import React, { useState } from 'react';
import './ResultDisplay.css';

const ResultDisplay = ({ result, onReset }) => {
  const [showComparison, setShowComparison] = useState(true);
  const [downloadComplete, setDownloadComplete] = useState(false);

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

  return (
    <div className="result-display">
      <div className="result-header">
        <h2>Your Image is Ready!</h2>
        <p>Here's your AI-enhanced image. Download it or try again with different settings.</p>
      </div>

      <div className="result-content">
        {showComparison ? (
          <div className="comparison-view">
            <div className="image-container original">
              <h4>Original</h4>
              <img src={result.originalImage} alt="Original" />
            </div>
            <div className="comparison-divider"></div>
            <div className="image-container processed">
              <h4>Enhanced</h4>
              <img src={result.processedImage} alt="Enhanced" />
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
          className="btn btn-primary btn-download"
          onClick={handleDownload}
        >
          {downloadComplete ? '✓ Downloaded!' : '⬇ Download Image'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={shareImage}
        >
          🔗 Share
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
    </div>
  );
};

export default ResultDisplay;