import { Client, Get, Guards, Body, Post, Handlers, ErrorHandler, Header, Headers } from '@rest';
import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injector } from '@angular/core';

@Client<AppService>({
  baseUrl: 'http://localhost:3000',
  baseHeaders: [{client: 'x'}]
})
export class AppService {
  constructor(injector: Injector) {
    console.log(this);
  }

  @ErrorHandler()
  public handle400(original: HttpErrorResponse, current: any): boolean {
    console.warn(original, current);

    return original.error;
  }

  public setLoginHeaders() {
    return {'method': 'headers'};
  }

  @Post('login')
  @Handlers<AppService>(['handle400'])
  @Headers<AppService>(['setLoginHeaders'])
  async login(
    @Body() body: any,
    @Header('Authorization') token: string,
    @Header('Test-Header') testHeader: string
  ): Promise<string> {
    return null;
  }
}
