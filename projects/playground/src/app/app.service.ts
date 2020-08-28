import { Client, Get, Guards, Body, Post, Handlers, ErrorHandler, Header, Headers, WithCredentials, OnClientReady, RestGuard, Path, Query, InjectToken, Delete } from '@rest';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injector, Injectable } from '@angular/core';

@Injectable()
export class AGuard implements RestGuard {
  canSend(req: HttpRequest<any>): boolean {
    console.log(req);
    return true;
  }
}

@Client<AppService>({
  baseUrl: 'http://localhost:3000',
  baseHeaders: [{client: 'x'}],
  withCredentials: false,
  guards: [AGuard],
  providedIn: 'root'
})
export class AppService {
  @InjectToken(HttpClient)
  private test: HttpClient;

  constructor(injector: Injector) {}

  @ErrorHandler()
  public handle400(original: HttpErrorResponse, current: any): boolean {
    console.warn(original, current);

    return original.error;
  }

  public setLoginHeaders() {
    return {'method': 'headers'};
  }

  @Post('login/:id/:key?text=dsadsa')
  @Handlers<AppService>(['handle400'])
  @Headers<AppService>(['setLoginHeaders'])
  @WithCredentials(false)
  async login(
    @Body() body: any,
    @Header('Authorization') token: string,
    @Header('Test-Header') testHeader: string,
    @Path('id') id: string,
    @Path('key') key: string,
    @Query('search') search: string,
    @Query('limit') limit: number
  ): Promise<string> {
    return null;
  }

  @Delete()
  async del(@Body() payload: any) {
    return null;
  }

  @OnClientReady()
  private onReady() {
    console.log('ready', this);
  }
}
