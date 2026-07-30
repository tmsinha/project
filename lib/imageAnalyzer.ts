import Tesseract from 'tesseract.js';

export interface FinancialData {
  revenue?: number;
  cogs?: number;
  operatingCosts?: number;
  rent?: number;
  utilities?: number;
  otherFacilityCosts?: number;
  taxes?: number;
  employeeWages?: number;
  ownerSalary?: number;
  personalSalary?: number;
  otherPayrollExpenses?: number;
  numberOfEmployees?: number;
  personalContributions?: number;
  miscellaneousOverhead?: number;
  customExpenses?: number;
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

    // Define keywords for each financial category with extensive synonyms
    const keywords = {
      revenue: [
        'revenue', 'sales', 'income', 'total revenue', 'gross sales', 'turnover',
        'total sales', 'net sales', 'gross revenue', 'total income', 'operating revenue',
        'service revenue', 'product revenue', 'revenue total', 'sales revenue',
        'business income', 'company revenue', 'earnings', 'proceeds', 'receipts',
        'top line', 'gross income', 'total receipts', 'money in', 'cash inflow'
      ],
      cogs: [
        'cogs', 'cost of goods sold', 'cost of revenue', 'product cost', 'merchandise cost',
        'cost of sales', 'cogs (cost of goods sold)', 'direct costs', 'material costs',
        'inventory costs', 'product costs', 'goods sold', 'cost of products',
        'direct material', 'direct labor', 'manufacturing cost', 'production cost',
        'wholesale cost', 'cost of merchandise', 'inventory cost', 'material expense'
      ],
      operatingCosts: [
        'operating cost', 'operating expense', 'opex', 'operation cost',
        'operating expenses', 'operating expenditure', 'operations cost',
        'running costs', 'day-to-day expenses', 'operational costs',
        'business expenses', 'ongoing expenses', 'recurring costs',
        'operating overhead', 'total operating costs', 'operational expense'
      ],
      rent: [
        'rent', 'lease', 'rental', 'facility cost', 'rent expense',
        'lease payment', 'rental expense', 'office rent', 'store rent',
        'warehouse rent', 'facility rent', 'premises rent', 'property rent',
        'monthly rent', 'annual rent', 'rental cost', 'lease cost',
        'tenancy cost', 'occupancy cost', 'space rental', 'building rent'
      ],
      utilities: [
        'utility', 'utilities', 'electric', 'electricity', 'water', 'gas', 'power',
        'internet', 'phone', 'telephone', 'utility bill', 'utility expense',
        'electric bill', 'water bill', 'gas bill', 'power bill', 'internet bill',
        'phone bill', 'utility cost', 'electricity cost', 'water cost',
        'gas cost', 'power cost', 'internet cost', 'phone cost',
        'utilities expense', 'utility payment', 'utility charges',
        'electric charges', 'water charges', 'gas charges', 'power charges'
      ],
      otherFacilityCosts: [
        'insurance', 'maintenance', 'repair', 'facility maintenance', 'building maintenance',
        'property insurance', 'building insurance', 'facility insurance', 'premises insurance',
        'maintenance cost', 'repair cost', 'upkeep', 'building upkeep',
        'facility repair', 'property maintenance', 'general maintenance',
        'preventive maintenance', 'routine maintenance', 'building repair',
        'facility expense', 'property expense', 'premises expense',
        'insurance cost', 'insurance expense', 'insurance premium',
        'building costs', 'facility costs', 'property costs'
      ],
      taxes: [
        'tax', 'taxes', 'income tax', 'property tax', 'sales tax',
        'federal tax', 'state tax', 'local tax', 'tax expense',
        'tax liability', 'tax payment', 'income tax expense',
        'corporate tax', 'business tax', 'company tax', 'tax obligation',
        'tax charge', 'tax provision', 'estimated tax', 'tax withholding',
        'payroll tax', 'employment tax', 'self-employment tax',
        'vat', 'value added tax', 'gst', 'goods and services tax'
      ],
      employeeWages: [
        'wage', 'salary', 'payroll', 'employee', 'staff', 'worker compensation',
        'wages', 'salaries', 'employee wages', 'staff wages', 'worker wages',
        'payroll expense', 'payroll cost', 'labor cost', 'labor expense',
        'employee compensation', 'staff compensation', 'worker compensation',
        'wage expense', 'salary expense', 'total wages', 'total salaries',
        'personnel cost', 'labor cost', 'manpower cost', 'workforce cost',
        'employee pay', 'staff pay', 'worker pay', 'total payroll'
      ],
      ownerSalary: [
        'owner salary', 'owner compensation', 'director salary', 'founder salary', 'personal salary',
        'owner draw', 'owner distribution', 'owner pay', 'founder compensation',
        'director compensation', 'executive salary', 'management salary',
        'owner income', 'founder income', 'director income',
        'personal compensation', 'owner remuneration', 'director remuneration',
        'self-employment income', 'proprietor salary', 'partner salary',
        'owner wages', 'founder wages', 'director wages'
      ],
      personalSalary: [
        'owner salary', 'owner compensation', 'director salary', 'founder salary', 'personal salary',
        'owner draw', 'owner distribution', 'owner pay', 'founder compensation',
        'director compensation', 'executive salary', 'management salary',
        'owner income', 'founder income', 'director income',
        'personal compensation', 'owner remuneration', 'director remuneration',
        'self-employment income', 'proprietor salary', 'partner salary',
        'owner wages', 'founder wages', 'director wages'
      ],
      otherPayrollExpenses: [
        'benefit', 'benefits', 'payroll tax', 'contractor', 'consultant', 'freelance',
        'employee benefits', 'staff benefits', 'worker benefits',
        'benefit expense', 'benefit cost', 'benefits cost',
        'contractor cost', 'consultant cost', 'freelance cost',
        'contractor expense', 'consultant expense', 'freelance expense',
        'contractor fee', 'consultant fee', 'freelance fee',
        'independent contractor', 'external labor', 'contract labor',
        'temporary staff', 'temp workers', 'contract workers',
        'benefits administration', 'hr costs', 'human resources cost',
        'training cost', 'development cost', 'employee development'
      ],
      numberOfEmployees: [
        'employee count', 'number of employees', 'staff count', 'headcount', 'employees', 'workers',
        'total employees', 'total staff', 'total workers', 'workforce size',
        'employee number', 'staff number', 'worker number',
        'no. of employees', 'no of employees', 'num employees',
        'employees total', 'staff total', 'workers total',
        'head count', 'head-count', 'personnel count',
        'team size', 'workforce', 'staffing level',
        'employee total', 'staff total', 'worker total',
        'number of staff', 'number of workers', 'count of employees'
      ],
      personalContributions: [
        'personal contribution', 'owner contribution', 'equity injection', 'capital contribution',
        'owner investment', 'founder investment', 'director investment',
        'personal investment', 'capital injection', 'equity investment',
        'owner capital', 'founder capital', 'director capital',
        'personal capital', 'additional capital', 'capital contribution',
        'owner equity', 'founder equity', 'director equity',
        'personal equity', 'investment in business', 'business investment',
        'capital infusion', 'equity infusion', 'owner funding'
      ],
      miscellaneousOverhead: [
        'overhead', 'miscellaneous', 'other expense', 'administrative',
        'administrative expense', 'admin cost', 'admin expense',
        'general expense', 'general and administrative', 'g&a expense',
        'overhead cost', 'overhead expense', 'indirect cost',
        'miscellaneous expense', 'misc expense', 'other operating expense',
        's administrative', 'general administrative', 'office expense',
        'back office cost', 'support cost', 'infrastructure cost',
        'general overhead', 'administrative overhead', 'misc overhead'
      ],
      customExpenses: [
        'other expense', 'miscellaneous expense', 'additional expense', 'custom expense',
        'extra expense', 'additional cost', 'extra cost', 'misc cost',
        'other operating expense', 'other expense', 'miscellaneous cost',
        'special expense', 'one-time expense', 'unusual expense',
        'non-recurring expense', 'extraordinary expense', 'exceptional expense',
        'other charges', 'additional charges', 'misc charges',
        'other deductions', 'additional deductions', 'misc deductions',
        'custom cost', 'special cost', 'other cost'
      ]
    };

    // Extract values for each category
    for (const [category, categoryKeywords] of Object.entries(keywords)) {
      // Use number pattern for employee count, amount pattern for monetary values
      const pattern = category === 'numberOfEmployees' ? numberPattern : amountPattern;
      const value = this.extractValueByCategory(normalizedText, categoryKeywords, pattern);
      if (value !== null) {
        (data as any)[category] = value;
      }
    }

    // Specialized extraction for employee count if not found
    if (!data.numberOfEmployees) {
      const employeeCount = this.extractEmployeeCount(text);
      if (employeeCount !== null) {
        data.numberOfEmployees = employeeCount;
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
        // Get a larger context window around the keyword (300 characters)
        const start = Math.max(0, keywordIndex - 100);
        const end = Math.min(text.length, keywordIndex + keyword.length + 200);
        const context = text.substring(start, end);
        
        // Find all amounts in this context
        const matches = context.match(pattern);
        if (matches && matches.length > 0) {
          // Try to find the amount closest to the keyword
          const bestMatch = this.findBestMatch(context, keyword, matches);
          if (bestMatch !== null) {
            const amount = this.parseAmount(bestMatch);
            if (amount !== null && amount > 0) {
              return amount;
            }
          }
        }
      }
    }
    return null;
  }

  /**
   * Find the best matching amount near a keyword
   */
  private findBestMatch(context: string, keyword: string, matches: string[]): string | null {
    const keywordIndex = context.toLowerCase().indexOf(keyword.toLowerCase());
    let bestMatch = null;
    let minDistance = Infinity;

    for (const match of matches) {
      const matchIndex = context.indexOf(match);
      if (matchIndex !== -1) {
        const distance = Math.abs(matchIndex - keywordIndex);
        // Prefer matches that appear after the keyword (typical in financial documents)
        const adjustedDistance = matchIndex > keywordIndex ? distance : distance + 100;
        
        if (adjustedDistance < minDistance) {
          minDistance = adjustedDistance;
          bestMatch = match;
        }
      }
    }

    return bestMatch;
  }

  /**
   * Extract employee count specifically (returns integer)
   */
  private extractEmployeeCount(text: string): number | null {
    const keywords = [
      'employee count', 'number of employees', 'staff count', 'headcount', 'employees:', 'workers:', 'staff:',
      'total employees', 'total staff', 'total workers', 'workforce size',
      'employee number', 'staff number', 'worker number',
      'no. of employees', 'no of employees', 'num employees',
      'employees total', 'staff total', 'workers total',
      'head count', 'head-count', 'personnel count',
      'team size', 'workforce', 'staffing level',
      'employee total', 'staff total', 'worker total',
      'number of staff', 'number of workers', 'count of employees'
    ];
    const normalizedText = text.toLowerCase();
    
    for (const keyword of keywords) {
      const keywordIndex = normalizedText.indexOf(keyword);
      if (keywordIndex !== -1) {
        // Get larger context around the keyword
        const start = Math.max(0, keywordIndex - 50);
        const end = Math.min(text.length, keywordIndex + keyword.length + 150);
        const context = text.substring(start, end);
        
        // Look for number patterns (integers for employee count)
        const numberPattern = /\b\d+\b/g;
        const matches = context.match(numberPattern);
        
        if (matches && matches.length > 0) {
          // Find the best match near the keyword
          const bestMatch = this.findBestMatch(context, keyword, matches);
          if (bestMatch !== null) {
            const num = this.parseInteger(bestMatch);
            if (num !== null && num > 0 && num < 10000) { // Reasonable employee count range
              return num;
            }
          }
          
          // Fallback: use the first reasonable number
          for (const match of matches) {
            const num = this.parseInteger(match);
            if (num !== null && num > 0 && num < 10000) {
              return num;
            }
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
   * Parse a string to an integer (for employee counts)
   */
  private parseInteger(intString: string): number | null {
    try {
      // Remove any non-digit characters except negative sign
      const cleaned = intString.replace(/[^\d-]/g, '');
      
      // Parse as integer
      const value = parseInt(cleaned, 10);
      
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