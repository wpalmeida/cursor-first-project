class LoggingService {
  private static instance: LoggingService;
  private isEnabled: boolean = true;

  private constructor() {}

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  logRequest(method: string, url: string, headers: any, data?: any) {
    if (!this.isEnabled) return;

    console.log(`\n[${new Date().toISOString()}] Frontend Request:`);
    console.log(`Method: ${method}`);
    console.log(`URL: ${url}`);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    if (data) {
      console.log('Request Data:', JSON.stringify(data, null, 2));
    }
  }

  logResponse(method: string, url: string, status: number, data: any) {
    if (!this.isEnabled) return;

    console.log(`\n[${new Date().toISOString()}] Frontend Response:`);
    console.log(`Method: ${method}`);
    console.log(`URL: ${url}`);
    console.log(`Status: ${status}`);
    console.log('Response Data:', JSON.stringify(data, null, 2));
  }

  logError(method: string, url: string, error: any) {
    if (!this.isEnabled) return;

    console.error(`\n[${new Date().toISOString()}] Frontend Error:`);
    console.error(`Method: ${method}`);
    console.error(`URL: ${url}`);
    console.error('Error:', error);
  }
}

export const loggingService = LoggingService.getInstance(); 