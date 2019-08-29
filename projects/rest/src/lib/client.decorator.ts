import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { INJECTOR, HTTP_CLIENT, BASE_URL, ClientOptions, GUARDS, CLIENT_GUARDS } from './client.interface';
import { BASE_URL as BASE_URL_TOKEN } from './base-url.token';


export function Client<T>({ baseUrl, guards, providedIn = 'root' }: ClientOptions<T> = {}) {
  return function ( Target: new (...args: any[]) => T ): any {
    const params: any[] = Reflect.getMetadata('design:paramtypes', Target);

    class RestClient {
      constructor(injector: Injector) {
        const newTarget = new (<any>Target)(...(params || []).map(param => injector.get(param)));

        newTarget[INJECTOR] = injector;
        newTarget[HTTP_CLIENT] = injector.get(HttpClient);
        newTarget[BASE_URL] = baseUrl || injector.get(BASE_URL_TOKEN);

        return newTarget;
      }
    }

    Target[GUARDS] = {
      ...Target[GUARDS],
      [CLIENT_GUARDS]: guards ? guards instanceof Array ? guards : [guards] : []
    };

    Reflect.defineMetadata('design:paramtypes', [Injector], RestClient);

    Injectable({ providedIn, deps: [...(params || [])]})(RestClient);

    return <any>RestClient;
  };
}
