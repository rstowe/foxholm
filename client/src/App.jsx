import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ImageUploader from './components/ImageUploader';
import DynamicForm from './components/DynamicForm';
import ProcessingStatus from './components/ProcessingStatus';
import ResultDisplay from './components/ResultDisplay';
import './App.css';

// Redux store
const store = configureStore({
  reducer: {
    app: (state = { subdomain: null, config: null }, action) => {
      switch (action.type) {
        case 'SET_CONFIG':
          return { ...state, ...action.payload };
        default:
          return state;
      }
    }
  }
});

// Foxholm Logo Component
const FoxholmLogo = () => (
  <div className="logo">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 2L20.5 11L30 11L22.5 17.5L26 26.5L16 20L6 26.5L9.5 17.5L2 11L11.5 11L16 2Z" 
            fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  </div>
);

function App() {
  const [subdomainConfig, setSubdomainConfig] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({});
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch subdomain configuration on mount
  useEffect(() => {
    fetchSubdomainConfig();
  }, []);

  // Debug: Log form fields and state changes
  useEffect(() => {
    console.log('Form fields:', subdomainConfig?.formFields);
    console.log('Form data:', formData);
  }, [subdomainConfig, formData]);

  const fetchSubdomainConfig = async () => {
    try {
      // Extract subdomain from the current hostname
      const hostname = window.location.hostname;
      let subdomain = null;
      
      // Handle local development with subdomains (e.g., headshot.localhost)
      if (hostname.endsWith('.localhost')) {
        subdomain = hostname.split('.')[0];
        if (subdomain === 'localhost') subdomain = null;
      } 
      // Handle production domains (e.g., headshot.example.com)
      else if (hostname.split('.').length > 2) {
        subdomain = hostname.split('.')[0];
      }
      
      // Build the API URL with the subdomain if available
      const apiUrl = subdomain 
        ? `${window.location.origin}/api/subdomain-config?subdomain=${encodeURIComponent(subdomain)}`
        : `${window.location.origin}/api/subdomain-config`;
        
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSubdomainConfig(data.config);
        store.dispatch({
          type: 'SET_CONFIG',
          payload: {
            subdomain: data.subdomain,
            config: data.config
          }
        });
      } else {
        setError('Invalid subdomain configuration');
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
      setError('Failed to load configuration');
    }
  };

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    setResult(null);
    setError(null);
  };

  const handleFormChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const apiUrl = `${window.location.origin}/api/process-image`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          subdomain: store.getState().app.subdomain,
          imageData: uploadedImage,
          options: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Processing failed');
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError('Failed to process image');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setFormData({});
    setResult(null);
    setError(null);
  };

  if (!subdomainConfig) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading Foxholm Studio...</p>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <div className="app">
        {/* Professional Header */}
        <header className="app-header">
          <div className="header-container">
            <div className="logo-section">
              <FoxholmLogo />
              <div>
                <h1>Foxholm</h1>
                <p className="header-tagline">AI Image Studio</p>
              </div>
            </div>
            {!result && (
              <div className="header-content">
                <h2>{subdomainConfig.title}</h2>
                <p className="header-description">{subdomainConfig.description}</p>
              </div>
            )}
          </div>
        </header>

        <main className="app-main">
          <div className="app-container">


            {/* Main Content Area */}
            <div className="content-wrapper">
              <div className="main-content">
                {!result ? (
                  <>
                    {/* Image uploader */}
                    <ImageUploader
                      onImageUpload={handleImageUpload}
                      uploadedImage={uploadedImage}
                    />

                    {/* Dynamic form based on subdomain */}
                    {uploadedImage && subdomainConfig?.formFields && (
                      <div className="form-container">
                        {Object.keys(subdomainConfig.formFields).length > 0 ? (
                          <DynamicForm
                            fields={subdomainConfig.formFields}
                            values={formData}
                            onChange={handleFormChange}
                          />
                        ) : (
                          <div className="no-fields-message">
                            No customization options available for this service.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submit button */}
                    {uploadedImage && (
                      <div className="action-buttons">
                        <button
                          className="btn btn-primary"
                          onClick={handleSubmit}
                          disabled={processing}
                        >
                          {processing ? (
                            <>
                              <span className="spinner-small"></span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <span>🚀</span>
                              Process Image
                            </>
                          )}
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={handleReset}
                          disabled={processing}
                        >
                          Reset
                        </button>
                      </div>
                    )}

                    {/* Error display */}
                    {error && (
                      <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Result display */}
                    <ResultDisplay
                      result={result}
                      onReset={handleReset}
                    />
                  </>
                )}
              </div>

              {/* Side Panel - Tips */}
              {!result && (
                <aside className="side-panel">
                  <h3>Pro Tips</h3>
                  <div className="tip-item">
                    <span className="tip-icon">💡</span>
                    <span className="tip-text">Use high-resolution images for best results</span>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">📸</span>
                    <span className="tip-text">Ensure good lighting in your photos</span>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">🎨</span>
                    <span className="tip-text">Supported formats: JPG, PNG, WebP</span>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">⚡</span>
                    <span className="tip-text">Processing takes 20-30 seconds</span>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </main>

        {/* Processing status modal */}
        {processing && <ProcessingStatus />}

        <footer className="app-footer">
          <div className="footer-content">
            <FoxholmLogo />
            <p>&copy; 2025 Foxholm. Professional AI Image Studio.</p>
            <div className="footer-links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/sitemap.html">Sitemap</a>
            </div>
          </div>
        </footer>
      </div>
    </Provider>
  );
}

export default App;