import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BASE_URL } from './base-url.token';

interface RootConfiguration {
  baseUrl?: string;
}

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    {provide: BASE_URL, useValue: ''}
  ],
  exports: [
    HttpClientModule
  ]
})
export class RestModule {
  public static forRoot({ baseUrl }: RootConfiguration = {}): ModuleWithProviders {
    const providers: Provider[] = [];

    if (baseUrl) {
      providers.push({provide: BASE_URL, useValue: baseUrl});
    }

    return {
      ngModule: RestModule,
      providers
    };
  }
}
