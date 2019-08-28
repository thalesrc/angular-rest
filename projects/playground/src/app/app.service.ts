import { Client, Get, Guards } from '@rest';
import { HttpRequest } from '@angular/common/http';

@Client<AppService>({
  guards: 'checkNonAuthorized',
  baseUrl: 'https://httpbin.org'
})
export class AppService {

  public checkNonAuthorized(): boolean {
    return false;
  }

  @Get('get')
  // @Guards<AppService>(['checkNonAuthorized'])
  async login(): Promise<string> {
    return null;
  }
}
