import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, Type } from '@angular/core';

import { INJECTOR, HTTP_CLIENT, BASE_URL, ClientOptions, GUARDS, CLIENT_GUARDS,
          HANDLERS, CLIENT_HANDLERS, HEADERS, CLIENT_HEADERS } from './types';
import { BASE_URL as BASE_URL_TOKEN } from './tokens';

export function Client<T>({ baseUrl, guards, providedIn, handlers = [], baseHeaders = [], onReady }: ClientOptions<T> = {}) {
  return function ( Target: new (...args: any[]) => T ): any {
    let params: Type<any>[];

    if ('ctorParameters' in Target) {
      params = ((<() => {type: Type<any>}[]>Target['ctorParameters'])() || []).map(p => p.type);
    } else {
      params = Reflect.getMetadata('design:paramtypes', Target) || [];
    }

    class RestClient {
      constructor(injector: Injector) {
        const newTarget = new (<any>Target)(...params.map(param => injector.get(param)));

        newTarget[INJECTOR] = injector;
        newTarget[HTTP_CLIENT] = injector.get(HttpClient);
        newTarget[BASE_URL] = baseUrl || injector.get(BASE_URL_TOKEN);

        if (onReady) {
          newTarget[onReady]();
        }

        return newTarget;
      }
    }

    for (const [key, value] of Object.entries(Target)) {
      RestClient[key] = value;
    }

    Target[GUARDS] = {
      ...Target[GUARDS],
      [CLIENT_GUARDS]: guards ? guards instanceof Array ? guards : [guards] : []
    };

    Target[HANDLERS] = {
      ...Target[HANDLERS],
      [CLIENT_HANDLERS]: [...handlers]
    };

    Target[HEADERS] = {
      ...Target[HEADERS],
      [CLIENT_HEADERS]: baseHeaders
    };

    Reflect.defineMetadata('design:paramtypes', [Injector], RestClient);

    Injectable({ providedIn, deps: [...params]})(RestClient);

    return <any>RestClient;
  };
}
