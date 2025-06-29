import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ImageUploader.css';

const ImageUploader = ({ onImageUpload, uploadedImage }) => {
  const { t } = useTranslation();
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
      setError(t('common.imageUploader.errors.invalidType'));
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(t('common.imageUploader.errors.fileTooLarge', {
        maxSize: MAX_FILE_SIZE / (1024 * 1024)
      }));
      return;
    }

    // Create an image element to check dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      // Validate image dimensions
      if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
        setError(t('common.imageUploader.errors.dimensionsTooLarge', {
          maxDimension: MAX_DIMENSION
        }));
        return;
      }
      
      // Read file as base64
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.onerror = () => {
        setError(t('common.imageUploader.errors.processError'));
      };
      reader.readAsDataURL(file);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError(t('common.imageUploader.errors.invalidFile'));
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
            <p>{t('common.imageUploader.dropText')}</p>
            <p className="upload-hint">{t('common.imageUploader.clickText')}</p>
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
              {t('common.imageUploader.changeButton')}
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