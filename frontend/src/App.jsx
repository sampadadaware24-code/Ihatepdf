import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Sparkles, Check } from 'lucide-react';
import UploadBox from './components/UploadBox';
import Loader from './components/Loader';
import AudioPlayer from './components/AudioPlayer';
import './App.css';

const API_BASE = 'https://ihatepdf-dqii.onrender.com';

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | processing | success | error
  const [result, setResult] = useState(null);

  const handleFileSelect = (selected) => {
    setFile(selected);
    setStatus('idle');
    setResult(null);
  };

  const handleRemove = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    setStatus('uploading');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setStatus('processing');

      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000, // 5 minute timeout for large files
      });

      const data = response.data.data || response.data;

      setResult({
        audioUrl: data.audioUrl,
        pdfUrl: data.pdfUrl,
        status: data.status,
        fileName: file.name.replace('.pdf', '.mp3'),
      });

      setStatus('success');
      toast.success('Audio ready!', {
        style: {
          background: '#1E293B',
          color: '#F1F5F9',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          fontSize: '0.88rem',
        },
        iconTheme: { primary: '#10B981', secondary: '#fff' },
      });
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      toast.error(error.response?.data?.error || 'Upload failed, try again', {
        style: {
          background: '#1E293B',
          color: '#F1F5F9',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          fontSize: '0.88rem',
        },
        iconTheme: { primary: '#EF4444', secondary: '#fff' },
      });
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
  };

  const isProcessing = status === 'uploading' || status === 'processing';

  return (
    <div className="app">
      {/* Background */}
      <div className="app__bg">
        <div className="app__bg-gradient app__bg-gradient--1" />
        <div className="app__bg-gradient app__bg-gradient--2" />
        <div className="app__bg-gradient app__bg-gradient--3" />
        <div className="app__bg-noise" />
      </div>

      {/* Content */}
      <div className="app__content">
        {/* Header */}
        <header className="app__header">
          <div className="app__badge">
            <span className="app__badge-dot" />
            AI-Powered Conversion
          </div>
          <h1 className="app__title">Turn PDFs into<br />immersive audio</h1>
          <p className="app__subtitle">Upload, convert, and listen effortlessly</p>
        </header>

        {/* Main Card */}
        <div className="app__card">
          {status !== 'success' && (
            <>
              <UploadBox
                file={file}
                onFileSelect={handleFileSelect}
                onRemove={handleRemove}
                disabled={isProcessing}
              />

              {isProcessing ? (
                <Loader />
              ) : (
                <button
                  className="app__cta"
                  onClick={handleConvert}
                  disabled={!file || isProcessing}
                  id="convert-btn"
                >
                  Convert to Audio
                </button>
              )}

              {status === 'error' && (
                <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>
                  Conversion failed. Please try again.
                </p>
              )}
            </>
          )}

          {status === 'success' && result && (
            <>
              <div className="app__success-badge">
                <Check size={14} />
                Conversion complete
              </div>

              <AudioPlayer
                audioUrl={result.audioUrl}
                fileName={result.fileName}
              />

              <button
                className="app__reset"
                onClick={handleReset}
                id="upload-another-btn"
              >
                ← Upload another file
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="app__footer">
          <p>IHatePDF · PDF to Audio Converter</p>
        </footer>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{ duration: 4000 }}
      />
    </div>
  );
}