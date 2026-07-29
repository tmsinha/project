import Tesseract from 'tesseract.js';

export interface FinancialData {
  revenue?: number;
  cogs?: number;
  operatingCosts?: number;
  rent?: number;
  taxes?: number;
  employeeWages?: number;
  ownerSalary?: number;
  personalContributions?: number;
  miscellaneousOverhead?: number;
  rawText?: string;
  confidence?: number;
}

export interface ImageAnalysisResult {
  success: boolean;
  data?: FinancialData;
  error?: string;
}

/**
 * Image Analyzer Service
 * Extracts financial data from images using OCR (Tesseract.js)
 * Supports PDF, JPG, PNG and other image formats
 */
export class ImageAnalyzer {
  private worker: Tesseract.Worker | null = null;

  /**
   * Initialize the Tesseract worker
   */
  async initialize(): Promise<void> {
    if (this.worker) return;

    try {
      this.worker = await Tesseract.createWorker('eng', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${(m.progress * 100).toFixed(0)}%`);
          }
        }
      });
      console.log('Tesseract worker initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Tesseract worker:', error);
      throw new Error('OCR initialization failed');
    }
  }

  /**
   * Process an image file and extract financial data
   * @param imageFile - File object (from file input)
   * @param imageBuffer - Buffer of the image (alternative to file)
   */
  async analyzeImage(imageFile?: File, imageBuffer?: Buffer): Promise<ImageAnalysisResult> {
    try {
      await this.initialize();

      let image: string | Buffer;
      
      if (imageFile) {
        // Convert File to Buffer for processing
        const arrayBuffer = await imageFile.arrayBuffer();
        image = Buffer.from(arrayBuffer);
      } else if (imageBuffer) {
        image = imageBuffer;
      } else {
        return {
          success: false,
          error: 'No image file or buffer provided'
        };
      }

      console.log('Starting OCR processing...');
      
      // Perform OCR
      const { data: { text, confidence } } = await this.worker!.recognize(image);
      
      console.log('OCR completed. Confidence:', confidence);
      console.log('Extracted text length:', text.length);

      // Extract financial data from the OCR text
      const financialData = this.extractFinancialData(text, confidence);

      return {
        success: true,
        data: {
          ...financialData,
          rawText: text,
          confidence
        }
      };

    } catch (error) {
      console.error('Image analysis failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during image analysis'
      };
    }
  }

  /**
   * Extract financial figures from OCR text using pattern matching
   */
  private extractFinancialData(text: string, confidence: number): FinancialData {
    const data: FinancialData = {};
    
    // Normalize text for better matching
    const normalizedText = text.toLowerCase();
    
    // Patterns for financial figures
    // These patterns look for numbers with optional decimal points and currency symbols
    const amountPattern = /[$€£¥]?\s*[\d,]+\.?\d*/g;
    const numberPattern = /[\d,]+\.?\d*/g;

    // Define keywords for each financial category
    const keywords = {
      revenue: ['revenue', 'sales', 'income', 'total revenue', 'gross sales', 'turnover'],
      cogs: ['cogs', 'cost of goods sold', 'cost of revenue', 'product cost', 'merchandise cost'],
      operatingCosts: ['operating cost', 'operating expense', 'opex', 'operation cost'],
      rent: ['rent', 'lease', 'rental', 'facility cost'],
      taxes: ['tax', 'taxes', 'income tax', 'property tax', 'sales tax'],
      employeeWages: ['wage', 'salary', 'payroll', 'employee', 'staff', 'worker compensation'],
      ownerSalary: ['owner salary', 'owner compensation', 'director salary', 'founder salary'],
      personalContributions: ['personal contribution', 'owner contribution', 'equity injection', 'capital contribution'],
      miscellaneousOverhead: ['overhead', 'miscellaneous', 'other expense', 'administrative', 'utility', 'insurance']
    };

    // Extract values for each category
    for (const [category, categoryKeywords] of Object.entries(keywords)) {
      const value = this.extractValueByCategory(normalizedText, categoryKeywords, amountPattern);
      if (value !== null) {
        (data as any)[category] = value;
      }
    }

    // Fallback: If no specific categories found, try to extract any significant amounts
    if (Object.keys(data).length === 0) {
      const allAmounts = this.extractAllAmounts(text);
      if (allAmounts.length > 0) {
        // Use the largest amount as revenue (heuristic)
        data.revenue = Math.max(...allAmounts);
        // Use second largest as total expenses (heuristic)
        if (allAmounts.length > 1) {
          const sortedAmounts = allAmounts.sort((a, b) => b - a);
          data.operatingCosts = sortedAmounts[1];
        }
      }
    }

    return data;
  }

  /**
   * Extract value for a specific category based on keywords
   */
  private extractValueByCategory(text: string, keywords: string[], pattern: RegExp): number | null {
    for (const keyword of keywords) {
      // Look for the keyword in the text
      const keywordIndex = text.indexOf(keyword);
      if (keywordIndex !== -1) {
        // Get a context window around the keyword (200 characters)
        const start = Math.max(0, keywordIndex - 50);
        const end = Math.min(text.length, keywordIndex + keyword.length + 150);
        const context = text.substring(start, end);
        
        // Find all amounts in this context
        const matches = context.match(pattern);
        if (matches && matches.length > 0) {
          // Parse the first found amount
          const amount = this.parseAmount(matches[0]);
          if (amount !== null && amount > 0) {
            return amount;
          }
        }
      }
    }
    return null;
  }

  /**
   * Extract all monetary amounts from text
   */
  private extractAllAmounts(text: string): number[] {
    const amounts: number[] = [];
    const pattern = /[$€£¥]?\s*[\d,]+\.?\d*/g;
    const matches = text.match(pattern);
    
    if (matches) {
      for (const match of matches) {
        const amount = this.parseAmount(match);
        if (amount !== null && amount > 0) {
          amounts.push(amount);
        }
      }
    }
    
    return amounts;
  }

  /**
   * Parse a string amount to a number
   * Handles currency symbols, commas, and decimal points
   */
  private parseAmount(amountString: string): number | null {
    try {
      // Remove currency symbols and whitespace
      const cleaned = amountString.replace(/[$€£¥\s]/g, '');
      
      // Remove commas (thousand separators)
      const noCommas = cleaned.replace(/,/g, '');
      
      // Parse as float
      const value = parseFloat(noCommas);
      
      // Validate
      if (isNaN(value) || value < 0) {
        return null;
      }
      
      return value;
    } catch {
      return null;
    }
  }

  /**
   * Clean up the worker
   */
  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      console.log('Tesseract worker terminated');
    }
  }
}

// Singleton instance
let analyzerInstance: ImageAnalyzer | null = null;

/**
 * Get the singleton ImageAnalyzer instance
 */
export function getImageAnalyzer(): ImageAnalyzer {
  if (!analyzerInstance) {
    analyzerInstance = new ImageAnalyzer();
  }
  return analyzerInstance;
}

/**
 * Convenience function to analyze an image
 */
export async function analyzeFinancialImage(imageFile?: File, imageBuffer?: Buffer): Promise<ImageAnalysisResult> {
  const analyzer = getImageAnalyzer();
  return await analyzer.analyzeImage(imageFile, imageBuffer);
}