import { ClientInstance, HTTP_CLIENT, BASE_URL, GUARDS, ClientConstructor,
          CLIENT_GUARDS, BODIES, INJECTOR, HANDLERS, CLIENT_HANDLERS, HandlersOf,
          ERROR_HANDLER, RequestMethod, PARAM_HEADERS, HeadersParam, HeadersInjector,
          HeadersObject, HEADERS, CLIENT_HEADERS, HeadersClientParam, WITH_CREDENTIALS, CLIENT_WITH_CREDENTIALS } from './types';
import { HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { REST_HANDLERS, BASE_HEADERS, BASE_WITH_CREDENTIALS } from './tokens';

type RestPropertyDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

class GuardForbid extends Error {
  constructor(
    public request: HttpRequest<unknown>
  ) {
    super('A guard function forbad the request');
  }
}

export function requestBuilder(type: RequestMethod): (path?: string) => RestPropertyDecorator {
  return function (path?: string): RestPropertyDecorator {
    return function (target: ClientConstructor, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
      descriptor.value = async function(this: ClientInstance, ...args: any[]) {
        // > Configure full url
        // _____________________________________________________________________________
        const url = path !== undefined ? path : methodName;

        // > Configure request body
        // _____________________________________________________________________________
        const bodyParamIndex = (target.constructor[BODIES] || {})[methodName];
        let body: any = null;

        if (typeof bodyParamIndex === 'number') {
          body = args[bodyParamIndex];
        }

        // > Configure Headers
        // _____________________________________________________________________________
        let headers = new HttpHeaders();

        // >> Base Headers
        const baseHeaders: HeadersParam[] = <HeadersParam[]> this[INJECTOR].get(BASE_HEADERS);

        for (const set of baseHeaders) {
          for (const header of set) {
            let _headers: HeadersObject = <HeadersObject> header;

            if (typeof header === 'function') {
              const instance: HeadersInjector = this[INJECTOR].get(header);
              _headers = await instance.inject();
            }

            for (const key of Object.keys(_headers)) {
              headers = headers.append(key, _headers[key]);
            }
          }
        }

        // >> Client Headers & Method Headers
        const clientHeaders: HeadersClientParam<any> = (target.constructor[HEADERS] || {})[CLIENT_HEADERS] || [];
        const methodHeaders: HeadersClientParam<any> = (target.constructor[HEADERS] || {})[methodName] || [];

        for (let header of [...clientHeaders, ...methodHeaders]) {
          if (typeof header === 'function') {
            const instance: HeadersInjector = this[INJECTOR].get(header);
            header = await instance.inject();
          }

          if (typeof header === 'string') {
            header = await this[header]();
          }

          for (const key of Object.keys(header)) {
            headers = headers.append(key, header[key]);
          }
        }

        // >> Parameter Headers
        for (const [name, [replace, index]] of Object.entries((target.constructor[PARAM_HEADERS] || {})[methodName] || {})) {
          const method: 'set' | 'append' = replace ? 'set' : 'append';

          headers = headers[method](name, args[index]);
        }

        // > With Credentials
        // _____________________________________________________________________________
        let withCredentials: boolean = <boolean> this[INJECTOR].get(BASE_WITH_CREDENTIALS);

        if (target.constructor[WITH_CREDENTIALS]) {
          if (typeof target.constructor[WITH_CREDENTIALS][CLIENT_WITH_CREDENTIALS] !== 'undefined') {
            withCredentials = target.constructor[WITH_CREDENTIALS][CLIENT_WITH_CREDENTIALS];
          }

          if (typeof target.constructor[WITH_CREDENTIALS][methodName] !== 'undefined') {
            withCredentials = target.constructor[WITH_CREDENTIALS][methodName];
          }
        }

        // > Create request object
        // _____________________________________________________________________________
        const request = requestFactory(type as any, `${this[BASE_URL]}/${url}`, { body, headers, withCredentials });

        // > Run guard process
        // _____________________________________________________________________________
        try {
          const guardsResult = await startGuardCheck(target, methodName, request, this);
          if (!guardsResult) { throw false; }

        } catch (error) {
          if (error === false) {
            throw new GuardForbid(request);
          }

          throw error;
        }

        // > Handlers
        // _____________________________________________________________________________
        const globalHandlers: HandlersOf<any> = (<any[]>this[INJECTOR].get(REST_HANDLERS)).reduce((prev, next) => [...prev, ...next], []);
        const clientHandlers: HandlersOf<any> = target.constructor[HANDLERS][CLIENT_HANDLERS];
        const methodHandlers: HandlersOf<any> = target.constructor[HANDLERS][methodName] || [];

        // > Result
        // _____________________________________________________________________________
        return await chainHandlers(
          [...globalHandlers, ...clientHandlers, ...methodHandlers],
          this,
          <Promise<HttpResponse<any>>>this[HTTP_CLIENT].request(request).toPromise()
        );
      };

      return descriptor;
    };
  };
}

interface RequestConfig {
  headers: HttpHeaders;
  withCredentials: boolean;
}

function requestFactory<T = unknown>(
  method: RequestMethod.POST | RequestMethod.PUT | RequestMethod.PATCH,
  url: string,
  config: RequestConfig
): HttpRequest<T>;
function requestFactory<T = unknown>(
  method: RequestMethod.GET | RequestMethod.DELETE | RequestMethod.HEAD | RequestMethod.JSONP | RequestMethod.OPTIONS,
  url: string,
  config: RequestConfig & { body?: T }
): HttpRequest<T>;
function requestFactory<T = unknown>(
  method: RequestMethod,
  url: string,
  {body, ...rest}: RequestConfig & { body?: T }
): HttpRequest<T> {
  switch (method) {
    case RequestMethod.POST:
    case RequestMethod.PUT:
    case RequestMethod.PATCH:
      return new HttpRequest<T>(method, url, body, rest);
    default:
      return new HttpRequest<T>(<'GET'>method, url, rest);
  }
}

async function startGuardCheck(
  target: ClientConstructor,
  methodName: string,
  request: HttpRequest<unknown>,
  context: ClientInstance
): Promise<boolean> {
  const allGuards = [...target.constructor[GUARDS][CLIENT_GUARDS], ...(target.constructor[GUARDS][methodName] || [])];

  return await allGuards.reduce((prev, next) => {
    return prev.then(passed => {
      let result;

      if (!passed) {
        throw false;
      }

      if (typeof next === 'function') {
        if (next.prototype && 'canSend' in next.prototype) {
          result = context[INJECTOR].get(next).canSend(request);
        } else {
          result = next(request);
        }
      } else {
        result = (<any>context)[next](request);
      }

      if (result instanceof Observable) {
        result = result.toPromise();
      }

      return result;
    });
  }, Promise.resolve(true));
}

function chainHandlers<T>(
  handlers: HandlersOf<any>,
  context: ClientInstance,
  source: Promise<HttpResponse<any>>
): Promise<T> {
  let original: HttpResponse<any>;

  source.then(res => {
    original = res;
  }, error => {
    original = error;
  });

  return handlers.reduce((prev: PromiseLike<any>, next) => {
    let handler: Function;
    let method: 'then' | 'catch';

    if (typeof next === 'string') {
      method = context[next][ERROR_HANDLER] ? 'catch' : 'then';
      handler = (<Function>context[next]).bind(context);
    } else if (next.prototype && 'handle' in next.prototype) {
      const injectable = context[INJECTOR].get(next);
      method = injectable.handle[ERROR_HANDLER] ? 'catch' : 'then';
      handler = injectable.handle.bind(injectable);
    } else {
      method = next[ERROR_HANDLER] ? 'catch' : 'then';
      handler = next;
    }

    return prev[method](res => handler(original, res));
  }, source);
}
