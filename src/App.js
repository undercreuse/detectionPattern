import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, QrCode } from 'lucide-react';
import logo from './logo.png';
import { QRCodeCanvas } from 'qrcode.react';
import PatternDetectionService from './services/PatternDetectionService';
import ImageComparisonService from './services/ImageComparisonService';

const ObjectDetectionApp = () => {
  // ... [Previous state declarations] ...
  const [imageComparisonService, setImageComparisonService] = useState(null);
  const [comparingImages, setComparingImages] = useState(false);

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

  const handleComparison = async () => {
    if (!capturedImage || !imageComparisonService) return;

    setComparingImages(true);
    try {
      const results = [];
      const sourceImages = ['/images-source/unum1.png', '/images-source/unum2.png'];

      for (const sourceImage of sourceImages) {
        const comparisonResult = await imageComparisonService.compareImages(
          sourceImage,
          capturedImage
        );

        results.push({
          sourceImage,
          capturedImage,
          similarity: comparisonResult.similarity,
          match: comparisonResult.match
        });
      }

      setComparisonData(results);
      setShowComparison(true);
    } catch (error) {
      console.error('Error comparing images:', error);
      setError('Failed to compare images');
    } finally {
      setComparingImages(false);
    }
  };

  // ... [Previous functions] ...

  return (
    <div className="min-h-screen bg-primary-darker flex items-center justify-center p-4">
      {/* ... [Previous JSX] ... */}
      
      {/* Updated comparison button */}
      {capturedImage && (
        <button
          onClick={handleComparison}
          disabled={comparingImages || !imageComparisonService}
          className="ml-2 p-2 rounded-full bg-primary-lighter hover:bg-white disabled:opacity-50"
        >
          {comparingImages ? (
            <Scan className="w-6 h-6 text-white animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M11 12 L13 14 L16 11"/>
            </svg>
          )}
        </button>
      )}

      {/* ... [Rest of the JSX] ... */}
      
      {/* Updated comparison modal */}
      {showComparison && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
             onClick={() => setShowComparison(false)}>
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowComparison(false)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Comparaison d'Images</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Image Source</th>
                    <th className="border p-2">Image Capturée</th>
                    <th className="border p-2">Similarité</th>
                    <th className="border p-2">Résultat</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        <img 
                          src={item.sourceImage} 
                          alt="Source" 
                          className="max-h-32 mx-auto"
                        />
                      </td>
                      <td className="border p-2">
                        <img 
                          src={item.capturedImage} 
                          alt="Capturée" 
                          className="max-h-32 mx-auto"
                        />
                      </td>
                      <td className="border p-2 text-center">
                        {(item.similarity * 100).toFixed(2)}%
                      </td>
                      <td className="border p-2 text-center">
                        <span className={item.match ? "text-green-500" : "text-red-500"}>
                          {item.match ? "Correspondance" : "Pas de correspondance"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectDetectionApp;