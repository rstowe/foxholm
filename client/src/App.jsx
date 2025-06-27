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
const FoxholmLogo = ({ className = '' }) => (
  <img 
    src="/logo.png" 
    alt="Foxholm" 
    className={`logo ${className}`}
  />
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
        {/* Background effect layer */}
        <div className="background-effect"></div>

        {/* Modern Dark Header */}
        <header className="app-header">
          <div className="header-container">
            <div className="logo-section" onClick={() => window.location.href = '/'}>
              <FoxholmLogo />
            </div>
            {!result && subdomainConfig && (
              <div className="header-content">
                <h2>{subdomainConfig.title}</h2>
                <p className="header-description">{subdomainConfig.description}</p>
              </div>
            )}
          </div>
        </header>

        <main className="app-main">
          <div className="app-container">
            {/* Main content grid */}
            <div className="content-wrapper">
              {!result ? (
                <>
                  {/* Upload Section */}
                  <div className="image-uploader-container">
                    <div className="glass-card glow-hover">
                      <ImageUploader
                        onImageUpload={handleImageUpload}
                        uploadedImage={uploadedImage}
                      />
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="form-container">
                    <div className="glass-card">
                      {subdomainConfig?.formFields && Object.keys(subdomainConfig.formFields).length > 0 ? (
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
                      
                      {/* Generate button */}
                      <button
                        className="btn btn-primary generate-button"
                        onClick={handleSubmit}
                        disabled={!uploadedImage || processing}
                        style={{ width: '100%', marginTop: '2rem' }}
                      >
                        {processing ? (
                          <>
                            <span className="spinner-small"></span>
                            Processing...
                          </>
                        ) : (
                          'Generate Enhanced Image'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error display */}
                  {error && (
                    <div className="error-message" style={{ gridColumn: '1 / -1' }}>
                      <span className="error-icon">⚠️</span>
                      {error}
                    </div>
                  )}
                </>
              ) : (
                /* Result Display */
                <div className="result-container glass-card">
                  <ResultDisplay
                    result={result}
                    onReset={handleReset}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Processing status modal */}
        {processing && <ProcessingStatus />}

        <footer className="app-footer">
          <div className="footer-content">
            <FoxholmLogo className="footer-logo" />
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