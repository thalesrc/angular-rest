import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { INJECTOR, HTTP_CLIENT, BASE_URL } from './client.interface';
import { BASE_URL as BASE_URL_TOKEN } from './base-url.token';


export function Client({ baseUrl }: {baseUrl?: string} = {}) {
  return function ( Target: any ): any {
    const params: any[] = Reflect.getMetadata('design:paramtypes', Target);

    class RestClient {
      constructor(injector: Injector) {
        const newTarget = new Target(...(params || []).map(param => injector.get(param)));

        newTarget[INJECTOR] = injector;
        newTarget[HTTP_CLIENT] = injector.get(HttpClient);
        newTarget[BASE_URL] = baseUrl || injector.get(BASE_URL_TOKEN);

        return newTarget;
      }
    }

    Reflect.defineMetadata('design:paramtypes', [Injector], RestClient);

    Injectable()(RestClient);

    return <any>RestClient;
  };
}
