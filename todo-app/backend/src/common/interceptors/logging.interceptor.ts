import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();
    const body = request.body;
    const headers = request.headers;

    console.log(`\n[${new Date().toISOString()}] Incoming Request:`);
    console.log(`Method: ${method}`);
    console.log(`URL: ${url}`);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Body:', JSON.stringify(body, null, 2));

    return next.handle().pipe(
      tap(data => {
        console.log(`\n[${new Date().toISOString()}] Response:`);
        console.log(`Method: ${method}`);
        console.log(`URL: ${url}`);
        console.log(`Duration: ${Date.now() - now}ms`);
        console.log('Response Data:', JSON.stringify(data, null, 2));
      }),
    );
  }
} 