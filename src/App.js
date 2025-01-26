import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, QrCode } from 'lucide-react';
import logo from './logo.png';
import { QRCodeCanvas } from 'qrcode.react';
import PatternDetectionService from './services/PatternDetectionService';
import ImageComparisonService from './services/ImageComparisonService';

const ObjectDetectionApp = () => {
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleVideoMetadata = () => {
    if (videoRef.current) {
      setVideoSize({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });
    }
  };

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
    <div>
      <video
        ref={videoRef}
        onLoadedMetadata={handleVideoMetadata}
      />
    </div>
  );
};

export default ObjectDetectionApp;