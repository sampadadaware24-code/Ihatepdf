import { useState, useRef } from 'react';
import { FileUp, X, FileText } from 'lucide-react';
import './UploadBox.css';

export default function UploadBox({ file, onFileSelect, onRemove, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      onFileSelect(droppedFile);
    }
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      onFileSelect(selected);
    }
    e.target.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div
      className={`upload-box ${isDragging ? 'upload-box--dragging' : ''} ${file ? 'upload-box--has-file' : ''} ${disabled ? 'upload-box--disabled' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      id="upload-dropzone"
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        className="upload-box__input"
        id="pdf-file-input"
      />

      {!file ? (
        <div className="upload-box__empty">
          <div className="upload-box__icon-wrapper">
            <FileUp size={32} strokeWidth={1.5} />
          </div>
          <p className="upload-box__title">Drop your PDF here or click to upload</p>
          <p className="upload-box__subtitle">PDF files up to 10MB</p>
        </div>
      ) : (
        <div className="upload-box__preview" onClick={(e) => e.stopPropagation()}>
          <div className="upload-box__file-icon">
            <FileText size={28} strokeWidth={1.5} />
          </div>
          <div className="upload-box__file-info">
            <p className="upload-box__file-name">{file.name}</p>
            <p className="upload-box__file-size">{formatSize(file.size)}</p>
          </div>
          {!disabled && (
            <button
              className="upload-box__remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              id="remove-file-btn"
              aria-label="Remove file"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
