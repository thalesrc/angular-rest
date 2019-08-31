import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BASE_URL, REST_HANDLERS, BASE_HEADERS } from './tokens';
import { HandlersOf, HeadersParam } from './types';

interface RootConfiguration {
  baseUrl?: string;
  handlers?: HandlersOf<null>;
  baseHeaders?: HeadersParam;
}

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    {provide: BASE_URL, useValue: ''},
    {provide: REST_HANDLERS, useValue: [], multi: true},
    {provide: BASE_HEADERS, useValue: [], multi: true}
  ],
  exports: [
    HttpClientModule
  ]
})
export class RestModule {
  public static forRoot({ baseUrl, handlers = [], baseHeaders = [] }: RootConfiguration = {}): ModuleWithProviders {
    const providers: Provider[] = [];

    if (baseUrl) {
      providers.push({provide: BASE_URL, useValue: baseUrl});
    }

    providers.push({provide: REST_HANDLERS, useValue: [...handlers], multi: true});
    providers.push({provide: BASE_HEADERS, useValue: [...baseHeaders], multi: true});

    return {
      ngModule: RestModule,
      providers
    };
  }
}
