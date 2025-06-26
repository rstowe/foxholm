import React, { useRef, useState } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageUpload, uploadedImage }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_DIMENSION = 4096; // Max width/height in pixels

  const handleFile = (file) => {
    setError(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      return;
    }

    // Create an image element to check dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      // Validate image dimensions
      if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
        setError(`Image dimensions are too large. Maximum size is ${MAX_DIMENSION}x${MAX_DIMENSION}px.`);
        return;
      }
      
      // Read file as base64
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.onerror = () => {
        setError('Failed to process image. Please try another file.');
      };
      reader.readAsDataURL(file);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError('Invalid image file. Please try another file.');
    };
    
    img.src = objectUrl;
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
            <p>Drop your image here</p>
            <p className="upload-hint">or click to select • JPG, PNG, GIF</p>
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