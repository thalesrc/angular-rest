import { Client, Get, Guards, Body, Post, Handlers, ErrorHandler } from '@rest';
import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Client<AppService>({
  baseUrl: 'http://localhost:3000'
})
export class AppService {
  constructor() {
    console.log(this);
  }

  @ErrorHandler()
  public handle400(original: HttpErrorResponse, current: any): boolean {
    console.warn(original, current);

    return original.error;
  }

  @Post('login')
  @Handlers<AppService>(['handle400'])
  async login(@Body() body: any): Promise<string> {
    return null;
  }
}
