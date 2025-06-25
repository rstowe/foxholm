import React, { useRef, useState } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageUpload, uploadedImage }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const handleFile = (file) => {
    setError(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageUpload(reader.result);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      {!uploadedImage ? (
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDrop={handleDrop}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          
          <div className="upload-content">
            <div className="upload-icon">📸</div>
            <h3>Upload Your Image</h3>
            <p>Drag and drop or click to browse</p>
            <p className="upload-hint">JPG, PNG, or WebP • Max 10MB</p>
          </div>
        </div>
      ) : (
        <div className="preview-area">
          <div className="preview-container">
            <img src={uploadedImage} alt="Uploaded" className="preview-image" />
            <button
              className="change-image-btn"
              onClick={handleClick}
              type="button"
            >
              Change Image
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
      
      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;