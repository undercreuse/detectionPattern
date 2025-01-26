import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, QrCode } from 'lucide-react';
import logo from './logo.png';
import { QRCodeCanvas } from 'qrcode.react';
import PatternDetectionService from './services/PatternDetectionService';
import ImageComparisonService from './services/ImageComparisonService';

const ObjectDetectionApp = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [patternService, setPatternService] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const [imageComparisonService, setImageComparisonService] = useState(null);
  const [comparingImages, setComparingImages] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const initServices = async () => {
      const patternService = new PatternDetectionService();
      const comparisonService = new ImageComparisonService();
      
      try {
        await comparisonService.initialize();
        setImageComparisonService(comparisonService);
        setPatternService(patternService);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing services:', error);
        setError('Failed to initialize services');
        setIsLoading(false);
      }
    };

    initServices();
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleVideoMetadata = () => {
    if (videoRef.current) {
      setVideoSize({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
      setError("Erreur d'accès à la caméra");
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
  };

  const appUrl = window.location.href;

  const getCropGuideStyle = () => {
    if (!videoSize.width || !videoSize.height) return {};

    const width = videoSize.height * 0.4;
    const height = width * 3;
    const left = (videoSize.width - width) / 2;
    const top = (videoSize.height - height) / 2;

    return {
      left: `${(left / videoSize.width) * 100}%`,
      top: `${(top / videoSize.height) * 100}%`,
      width: `${(width / videoSize.width) * 100}%`,
      height: `${(height / videoSize.height) * 100}%`
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
          <img src={logo} alt="Logo" className="h-8" />
          <div className="flex space-x-2">
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-2 hover:bg-blue-600 rounded-full"
            >
              <QrCode className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative h-96 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onLoadedMetadata={handleVideoMetadata}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          <div
            className="absolute border-2 border-white rounded-lg"
            style={getCropGuideStyle()}
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white rounded-br" />
          </div>
          <button
            onClick={handleCapture}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <Scan className="w-6 h-6 animate-spin" />
            ) : (
              <Camera className="w-6 h-6" />
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700">
            {error}
          </div>
        )}

        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg">
              <QRCodeCanvas value={appUrl} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectDetectionApp;