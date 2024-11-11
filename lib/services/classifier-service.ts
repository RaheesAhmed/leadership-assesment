import { loadData } from "@/utils/data_loader";

class ClassifierService {
  private static instance: ClassifierService;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): ClassifierService {
    if (!ClassifierService.instance) {
      ClassifierService.instance = new ClassifierService();
    }
    return ClassifierService.instance;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    // If already initializing, return the existing promise
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = loadData()
      .then(() => {
        this.isInitialized = true;
        console.log("Classifier data loaded successfully");
      })
      .catch((error) => {
        console.error("Failed to load classifier data:", error);
        throw error;
      });

    return this.initializationPromise;
  }

  isReady() {
    return this.isInitialized;
  }
}

export const classifierService = ClassifierService.getInstance();
