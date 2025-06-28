import React from 'react';
import './DynamicForm.css';

const DynamicForm = ({ fields, values, onChange }) => {
  // Initialize required fields with their first option if not already set
  React.useEffect(() => {
    const initialValues = {};
    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
      if (fieldConfig.required && fieldConfig.options?.length > 0 && !values[fieldName]) {
        initialValues[fieldName] = fieldConfig.options[0].value;
      }
    });
    
    if (Object.keys(initialValues).length > 0) {
      // Call onChange for each initialized value
      Object.entries(initialValues).forEach(([fieldName, value]) => {
        onChange(fieldName, value);
      });
    }
  }, []);

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
            <label htmlFor={fieldName} className="control-label">
              {fieldConfig.label}
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
            <label className="control-label">
              {fieldConfig.label}
            </label>
            <div className="radio-group">
              {fieldConfig.options.map((option) => (
                <div key={option.value} className="radio-option">
                  <input
                    type="radio"
                    id={`${fieldName}-${option.value}`}
                    name={fieldName}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => onChange(fieldName, e.target.value)}
                    required={fieldConfig.required}
                  />
                  <label htmlFor={`${fieldName}-${option.value}`}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={fieldName} className={fieldClass}>
            <label className="control-label">{fieldConfig.label}</label>
            <div className="checkbox-group">
              {fieldConfig.options.map((option) => {
                const isChecked = Array.isArray(value) && value.includes(option.value);
                return (
                  <div key={option.value} className="checkbox-option">
                    <input
                      type="checkbox"
                      id={`${fieldName}-${option.value}`}
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
                    <label htmlFor={`${fieldName}-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'slider':
        return (
          <div key={fieldName} className={fieldClass}>
            <label htmlFor={fieldName} className="control-label">
              {fieldConfig.label}
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
          </div>
        );

      case 'toggle':
        return (
          <div key={fieldName} className={fieldClass}>
            <label className="toggle-field">
              <span className="control-label">{fieldConfig.label}</span>
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