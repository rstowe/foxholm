import React, { useState, useEffect, useRef } from 'react';
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
  // Get subdomain links for footer
  const getSubdomainLinks = () => {
    if (!subdomains || !subdomains.length) return null;
    
    return subdomains.map((subdomain) => (
      <a 
        key={subdomain.path} 
        href={`https://${subdomain.path}.foxholm.com`}
        className="footer-link"
        target="_blank"
        rel="noopener noreferrer"
        title={subdomain.title}
      >
        {subdomain.emoji} {subdomain.title}
      </a>
    ));
  };
  const [subdomainConfig, setSubdomainConfig] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({});
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [subdomains, setSubdomains] = useState([]);
  const resultRef = useRef(null);

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  // Extract subdomain from hostname
  const extractSubdomain = (hostname) => {
    console.log('Extracting subdomain from:', hostname);
    
    // Handle local development with subdomains (e.g., restore.localhost:3001)
    if (hostname.includes('localhost')) {
      const domainParts = hostname.split('.');
      // If it's a subdomain like restore.localhost
      if (domainParts.length > 1 && domainParts[1] === 'localhost') {
        return domainParts[0];
      }
      // If it's localhost with a port
      if (domainParts[0] === 'localhost') {
        return null; // Root domain
      }
    }
    
    // Handle production domains (e.g., restore.example.com)
    const parts = hostname.split('.');
    // If we have more than 2 parts (e.g., subdomain.example.com)
    if (parts.length > 2) {
      return parts[0];
    }
    
    return null; // No subdomain found
  };

  // Fetch subdomain configuration and available subdomains on mount
  useEffect(() => {
    const fetchConfig = async () => {
      console.log('Fetching subdomain config...');
      try {
        const hostname = window.location.hostname;
        console.log('Current hostname:', hostname);
        const subdomain = extractSubdomain(hostname);
        console.log('Extracted subdomain:', subdomain);
        
        if (subdomain) {
          console.log('Fetching config for subdomain:', subdomain);
          const response = await fetch(`/api/subdomain-config?subdomain=${subdomain}`);
          console.log('Config response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to fetch subdomain config: ${response.status} ${response.statusText}`);
          }
          
          const result = await response.json();
          console.log('Config response data:', result);
          
          // Check if the response has the expected format
          if (result && result.success && result.config) {
            console.log('Setting subdomain config:', result.config);
            setSubdomainConfig(result.config);
            
            // Update document title and meta description
            document.title = result.config.seo?.title || 'Foxholm AI';
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute('content', result.config.seo?.description || '');
            }
          } else {
            console.error('Unexpected response format:', result);
            throw new Error('Invalid response format from subdomain config API');
          }
        }
      } catch (err) {
        console.error('Error in fetchConfig:', err);
        setError('Failed to load tool configuration. Please try again later.');
      }
    };

    const fetchSubdomains = async () => {
      console.log('Fetching subdomains...');
      try {
        const response = await fetch('/api/subdomains');
        console.log('Subdomains response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch subdomains: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Subdomains response data:', result);
        
        // Check if the response has the expected format
        if (result && result.success && Array.isArray(result.data)) {
          console.log('Setting subdomains:', result.data);
          setSubdomains(result.data);
        } else {
          console.error('Unexpected response format:', result);
          throw new Error('Invalid response format from subdomains API');
        }
      } catch (err) {
        console.error('Error in fetchSubdomains:', err);
        // Fallback to default subdomains if API fails
        const defaultSubdomains = [
          { name: 'Headshot', path: 'headshot' },
          { name: 'Restore', path: 'restore' },
          { name: 'Upscale', path: 'upscale' }
        ];
        console.log('Using default subdomains:', defaultSubdomains);
        setSubdomains(defaultSubdomains);
      }
    };

    fetchConfig();
    fetchSubdomains();
  }, []);

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
      // Extract subdomain from current URL
      const hostname = window.location.hostname;
      const subdomain = extractSubdomain(hostname);
      
      if (!subdomain) {
        throw new Error('Could not determine subdomain from URL');
      }

      const apiUrl = `${window.location.origin}/api/process-image`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          subdomain: subdomain,
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
            {subdomainConfig && (
              <div className="header-content">
                <h2>{subdomainConfig.title}</h2>
                <p className="header-description">
                  {result ? 'Your enhanced result is ready!' : subdomainConfig.description}
                </p>
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
                // Result Display
                <div className="result-container glass-card" ref={resultRef}>
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
            <div className="privacy-banner">
              <p>
                <span>No sign-ups</span>
                <span className="separator">|</span>
                <span>We do not store your images</span>
                <span className="separator">|</span>
                <span>No cookies</span>
              </p>
            </div>
            <FoxholmLogo className="footer-logo" />
            <p>&copy; 2025 Foxholm. Professional AI Image Studio.</p>
            <div className="footer-links">
              {getSubdomainLinks()}
            </div>
          </div>
        </footer>
      </div>
    </Provider>
  );
}

export default App;