import React from 'react';
import './DynamicForm.css';

const DynamicForm = ({ fields, values, onChange }) => {
  const renderField = (fieldName, fieldConfig) => {
    const value = values[fieldName] || fieldConfig.default || '';
    
    // Determine if field should be full width
    const isFullWidth = fieldConfig.type === 'checkbox' || 
                       fieldConfig.type === 'radio' ||
                       (fieldConfig.options && fieldConfig.options.length > 3);
    
    const fieldClass = `form-field ${isFullWidth ? 'full-width' : ''}`;

    switch (fieldConfig.type) {
      case 'select':
        return (
          <div key={fieldName} className={fieldClass}>
            <label htmlFor={fieldName}>
              {fieldConfig.label}
              {fieldConfig.required && <span className="required">*</span>}
            </label>
            <select
              id={fieldName}
              value={value}
              onChange={(e) => onChange(fieldName, e.target.value)}
              required={fieldConfig.required}
            >
              <option value="">Select an option</option>
              {fieldConfig.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div key={fieldName} className={fieldClass}>
            <label>
              {fieldConfig.label}
              {fieldConfig.required && <span className="required">*</span>}
            </label>
            <div className="radio-group">
              {fieldConfig.options.map((option) => (
                <label 
                  key={option.value} 
                  className={`radio-option ${value === option.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={fieldName}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => onChange(fieldName, e.target.value)}
                    required={fieldConfig.required}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={fieldName} className={fieldClass}>
            <label>{fieldConfig.label}</label>
            <div className="checkbox-group">
              {fieldConfig.options.map((option) => {
                const isChecked = Array.isArray(value) && value.includes(option.value);
                return (
                  <label 
                    key={option.value} 
                    className={`checkbox-option ${isChecked ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={isChecked}
                      onChange={(e) => {
                        const currentValues = Array.isArray(value) ? value : [];
                        const newValues = e.target.checked
                          ? [...currentValues, option.value]
                          : currentValues.filter(v => v !== option.value);
                        onChange(fieldName, newValues);
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 'slider':
        return (
          <div key={fieldName} className={fieldClass}>
            <label htmlFor={fieldName}>
              {fieldConfig.label}
              {fieldConfig.required && <span className="required">*</span>}
            </label>
            <div className="slider-container">
              <div className="slider-value">
                {value || fieldConfig.default || fieldConfig.min}
                {fieldConfig.unit || ''}
              </div>
              <input
                type="range"
                id={fieldName}
                min={fieldConfig.min}
                max={fieldConfig.max}
                step={fieldConfig.step || 1}
                value={value || fieldConfig.default || fieldConfig.min}
                onChange={(e) => onChange(fieldName, Number(e.target.value))}
                required={fieldConfig.required}
              />
            </div>
            {fieldConfig.labels && (
              <div className="slider-labels">
                {fieldConfig.labels.map((label, index) => (
                  <span key={index} className="slider-label">
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      case 'toggle':
        return (
          <div key={fieldName} className={fieldClass}>
            <label className="toggle-field">
              <span>{fieldConfig.label}</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={value === true}
                  onChange={(e) => onChange(fieldName, e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dynamic-form">
      <h3>Customize Settings</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          {Object.entries(fields).map(([fieldName, fieldConfig]) =>
            renderField(fieldName, fieldConfig)
          )}
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;