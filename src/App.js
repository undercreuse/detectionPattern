const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

const handleVideoMetadata = () => {
  if (videoRef.current) {
    setVideoSize({
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight
    });
  }
};