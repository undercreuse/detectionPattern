class PatternDetectionService {
  constructor() {
    this.isReady = true;
  }

  async detectPattern(imageData) {
    return {
      matchFound: true,
      confidence: 85,
      fileName: "Test Pattern",
      commonFeatures: 10,
      detectedPatterns: 1
    };
  }
}

export default PatternDetectionService;