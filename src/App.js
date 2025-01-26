// ... imports restent les mêmes

const ObjectDetectionApp = () => {
  // ... states et refs restent les mêmes

  const getCropGuideStyle = () => {
    if (!videoSize.width || !videoSize.height) return {};

    // Modification du ratio pour élargir le viseur
    const width = videoSize.height * 0.4; // Augmenté de 0.267 à 0.4
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

  // ... le reste du composant reste le même
};