import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

function CameraCapture({ onCapture, capturedFile, onClear }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setError(null);
    // Stop any existing stream first to prevent duplicate active streams
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      
      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera access is required for live photo submission. Please allow camera permissions.");
      setCameraActive(false);
    }
  };

  // Attach MediaStream to video element once mounted in DOM
  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((e) => {
        console.warn("Video autoplay notice:", e);
      });
    }
  }, [cameraActive, stream]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        if (blob.size > 2 * 1024 * 1024) {
          setError("Captured image exceeds 2 MB limit. Please try again.");
          return;
        }
        const file = new File([blob], `live_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file, URL.createObjectURL(blob));
        stopCamera();
      }
    }, 'image/jpeg', 0.85);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
          📷 Live Camera Capture (Optional &lt; 2MB)
        </label>
        <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Live Camera Only • No Gallery Uploads
        </span>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {capturedFile ? (
        <div className="relative rounded-lg overflow-hidden border border-emerald-300 bg-white p-2">
          <img 
            src={capturedFile.previewUrl} 
            alt="Live Capture" 
            className="w-full h-48 object-cover rounded"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-emerald-700 flex items-center font-medium">
              <CheckCircle className="w-4 h-4 mr-1 text-emerald-600" />
              Captured Photo ({(capturedFile.file.size / 1024).toFixed(1)} KB)
            </span>
            <button
              type="button"
              onClick={() => { onClear(); startCamera(); }}
              className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retake Photo</span>
            </button>
          </div>
        </div>
      ) : cameraActive ? (
        <div className="relative rounded-lg overflow-hidden bg-black flex flex-col items-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-56 object-cover bg-black"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute bottom-3 flex space-x-3">
            <button
              type="button"
              onClick={takePhoto}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg font-medium text-xs flex items-center space-x-1 border border-white/20"
            >
              <Camera className="w-4 h-4" />
              <span>Snap Photo</span>
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="bg-gray-800/80 hover:bg-gray-900 text-white px-3 py-2 rounded-full text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-3">
            Capture a real-time photo of the issue directly using your device camera.
          </p>
          <button
            type="button"
            onClick={startCamera}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm transition inline-flex items-center space-x-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>Open Camera</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default CameraCapture;
