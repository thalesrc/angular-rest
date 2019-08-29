import { Client, Get, Guards, Body, Post } from '@rest';
import { HttpRequest } from '@angular/common/http';

@Client<AppService>({
  guards: 'checkNonAuthorized',
  baseUrl: 'https://httpbin.org'
})
export class AppService {
  constructor() {
    console.log(this);
  }

  public checkNonAuthorized(): boolean {
    return true;
  }

  @Post('post')
  // @Guards<AppService>(['checkNonAuthorized'])
  async login(test, @Body() body: any): Promise<string> {
    return null;
  }
}
