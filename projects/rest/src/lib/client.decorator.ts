import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, Type } from '@angular/core';

import { INJECTOR, HTTP_CLIENT, BASE_URL, ClientOptions, GUARDS, CLIENT_GUARDS,
          HANDLERS, CLIENT_HANDLERS, HEADERS, CLIENT_HEADERS, WITH_CREDENTIALS,
          CLIENT_WITH_CREDENTIALS, ON_CLIENT_READY, INJECTIONS } from './types';
import { BASE_URL as BASE_URL_TOKEN } from './tokens';

// export function Client<T>(
//   {
//     baseUrl,
//     guards,
//     providedIn,
//     handlers = [],
//     baseHeaders = [],
//     withCredentials
//   }: ClientOptions<T> = {}
// ) {
//   return function(Target: new (...args: any[]) => T): any {
//     Target[GUARDS] = {
//       ...Target[GUARDS],
//       [CLIENT_GUARDS]: guards ? guards instanceof Array ? guards : [guards] : []
//     };

//     Target[HANDLERS] = {
//       ...Target[HANDLERS],
//       [CLIENT_HANDLERS]: [...handlers]
//     };

//     Target[HEADERS] = {
//       ...Target[HEADERS],
//       [CLIENT_HEADERS]: baseHeaders
//     };

//     if (typeof withCredentials !== undefined) {
//       Target[WITH_CREDENTIALS] = {
//         ...Target[WITH_CREDENTIALS],
//         [CLIENT_WITH_CREDENTIALS]: withCredentials
//       };
//     }

//     @Injectable({
//       providedIn
//     })
//     class RestClient {
//       constructor(injector: Injector) {
//         const instance = new Target() as any;

//         instance[INJECTOR] = injector;
//         instance[HTTP_CLIENT] = injector.get(HttpClient);
//         instance[BASE_URL] = baseUrl || injector.get(BASE_URL_TOKEN);

//         for (const [key, token] of Object.entries(Target[INJECTIONS] || {})) {
//           instance[key] = injector.get(token);
//         }

//         if (Target[ON_CLIENT_READY]) {
//           instance[Target[ON_CLIENT_READY]]();
//         }

//         return instance;
//       }
//     }

//     return Injectable({ providedIn })(RestClient);
//   };
// }

export function Client<T>(
  {
    baseUrl,
    guards,
    providedIn,
    handlers = [],
    baseHeaders = [],
    withCredentials
  }: ClientOptions<T> = {}
) {
  return function ( Target: new (...args: any[]) => T ): any {
    let params: Type<any>[];
    let ctorParameters: () => {type: Type<any>}[];

    if ('ctorParameters' in Target) {
      ctorParameters = Target['ctorParameters'];
      params = (ctorParameters() || []).map(function(p) {return p.type});
    } else {
      params = Reflect.getMetadata('design:paramtypes', Target) || [];
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

    if (typeof withCredentials !== undefined) {
      Target[WITH_CREDENTIALS] = {
        ...Target[WITH_CREDENTIALS],
        [CLIENT_WITH_CREDENTIALS]: withCredentials
      };
    }

    class RestClient {
      constructor(injector: Injector) {
        const newTarget = new (<any>Target)(injector);

        newTarget[INJECTOR] = injector;
        newTarget[HTTP_CLIENT] = injector.get(HttpClient);
        newTarget[BASE_URL] = baseUrl || injector.get(BASE_URL_TOKEN);

        for (const [key, token] of Object.entries(Target[INJECTIONS] || {})) {
          newTarget[key] = injector.get(token);
        }

        if (Target[ON_CLIENT_READY]) {
          newTarget[Target[ON_CLIENT_READY]]();
        }

        return newTarget;
      }
    }

    for (const [key, value] of Object.entries(Target)) {
      RestClient[key] = value;
    }

    Reflect.defineMetadata('design:paramtypes', [Injector], RestClient);

    Injectable({ providedIn, deps: [...params, Injector]})(RestClient);

    return <any>RestClient;
  };
}
