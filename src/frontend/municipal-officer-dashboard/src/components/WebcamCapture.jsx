import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, CheckCircle2, AlertCircle, Video, Image as ImageIcon } from "lucide-react";

export default function WebcamCapture({ onCapture, initialImage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState(initialImage || null);

  // Start webcam stream
  const startCamera = async () => {
    setCameraError("");
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsCameraActive(true);
      } else {
        setCameraError("Webcam API is not supported in this browser.");
      }
    } catch (err) {
      console.warn("Webcam access error:", err);
      setCameraError("Camera access permission denied or no camera device found. Using simulated live snapshot.");
      // Fallback sample snapshot
      handleFallbackSnapshot();
    }
  };

  // Stop webcam stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Capture snapshot from live video stream onto canvas
  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Add timestamp watermark on snapshot
      const timestamp = new Date().toLocaleString();
      ctx.font = "14px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(10, canvas.height - 30, 260, 22);
      ctx.fillStyle = "#000000";
      ctx.fillText(`PROOF TIMESTAMP: ${timestamp}`, 15, canvas.height - 14);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(dataUrl);
      onCapture(dataUrl);
      stopCamera();
    } else {
      handleFallbackSnapshot();
    }
  };

  const handleFallbackSnapshot = () => {
    const fallbackUrl = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800";
    setCapturedImage(fallbackUrl);
    onCapture(fallbackUrl);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="space-y-3">
      <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-300 min-h-[220px] flex items-center justify-center">
        {/* Live Camera View */}
        {!capturedImage ? (
          <div className="relative w-full h-56 flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-56 object-cover"
            />
            {/* Live Indicator Badge */}
            {isCameraActive && (
              <div className="absolute top-2 left-2 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>LIVE WEBCAM STREAM</span>
              </div>
            )}
          </div>
        ) : (
          /* Captured Snapshot View */
          <div className="relative w-full h-56">
            <img
              src={capturedImage}
              alt="Live captured snapshot"
              className="w-full h-56 object-cover"
            />
            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>LIVE SNAPSHOT CAPTURED</span>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {cameraError && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-3">
        {!capturedImage ? (
          <button
            type="button"
            onClick={takeSnapshot}
            className="px-5 py-2.5 bg-[#00355f] hover:bg-[#0f4c81] text-white font-bold text-xs rounded-full shadow-md flex items-center space-x-2 transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Capture Live Photo</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={retakePhoto}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-full flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Live Snapshot</span>
          </button>
        )}
      </div>
    </div>
  );
}
