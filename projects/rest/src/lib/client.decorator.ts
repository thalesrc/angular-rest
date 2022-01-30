import { HttpClient } from '@angular/common/http';
import { Injector, Type } from '@angular/core';

import { INJECTOR, HTTP_CLIENT, BASE_URL, ClientOptions, GUARDS, CLIENT_GUARDS,
          HANDLERS, CLIENT_HANDLERS, HEADERS, CLIENT_HEADERS, WITH_CREDENTIALS,
          CLIENT_WITH_CREDENTIALS, ON_CLIENT_READY, INJECTIONS, ClientConstructor } from './types';
import { BASE_URL as BASE_URL_TOKEN } from './tokens';

export function Client<T>(
  {
    baseUrl,
    guards,
    handlers = [],
    baseHeaders = [],
    withCredentials
  }: ClientOptions<T> = {}
) {
  return function (Target: new (...args: any[]) => T): any {
    let params: Type<any>[];
    let ctorParameters: () => {type: Type<any>}[];

    const TTarget: ClientConstructor<T>['constructor'] = Target as any;

    if ('ctorParameters' in Target) {
      ctorParameters = (Target as any).ctorParameters;
      params = (ctorParameters() || []).map(function(p) {return p.type; });
    } else {
      params = Reflect.getMetadata('design:paramtypes', Target) || [];
    }

    TTarget[GUARDS] = {
      ...TTarget[GUARDS],
      [CLIENT_GUARDS]: guards ? guards instanceof Array ? guards : [guards] : []
    };

    TTarget[HANDLERS] = {
      ...TTarget[HANDLERS],
      [CLIENT_HANDLERS]: [...handlers]
    };

    TTarget[HEADERS] = {
      ...TTarget[HEADERS],
      [CLIENT_HEADERS]: baseHeaders
    };

    if (typeof withCredentials !== undefined) {
      TTarget[WITH_CREDENTIALS] = {
        ...TTarget[WITH_CREDENTIALS],
        [CLIENT_WITH_CREDENTIALS]: withCredentials!
      };
    }

    class RestClient {
      constructor(injector: Injector) {
        const newTarget = new (<any>Target)(injector);

        newTarget[INJECTOR] = injector;
        newTarget[HTTP_CLIENT] = injector.get(HttpClient);
        newTarget[BASE_URL] = baseUrl || injector.get(BASE_URL_TOKEN);

        for (const [key, token] of Object.entries(TTarget[INJECTIONS] || {})) {
          newTarget[key] = injector.get(token);
        }

        if (TTarget[ON_CLIENT_READY]) {
          newTarget[TTarget[ON_CLIENT_READY]]();
        }

        return newTarget;
      }
    }

    for (const [key, value] of Object.entries(Target)) {
      (RestClient as any)[key] = value;
    }

    Reflect.defineMetadata('design:paramtypes', [Injector], RestClient);

    return <any>RestClient;
  };
}
