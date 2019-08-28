import { Client, Get, Guards } from '@rest';
import { HttpRequest } from '@angular/common/http';

@Client()
export class AppService {
  public checkNonAuthorized(): boolean {
    return true;
  }

  @Get()
  @Guards<AppService>(['checkNonAuthorized'])
  async login(): Promise<string> {
    return null;
  }
}
