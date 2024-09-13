import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: any): void {
        if (error instanceof Error) {
            // Log detailed error information
            console.error('Global error caught:', error.message);
            console.error('Error stack trace:', error.stack);
            console.error('Error name:', error.name);
            console.error('Error details:', error);
        } else if (typeof error === 'string') {
            console.error('Global error caught: (string)', error);
        } else if (typeof error === 'object') {
            console.error('Global error caught: (object)', JSON.stringify(error, null, 2));
        } else {
            console.error('Global error caught:', error);
        }
        // Optionally, send the error to a server, log it, etc.
    }
}
