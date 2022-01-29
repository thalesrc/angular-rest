import { ClientInstance, HTTP_CLIENT, BASE_URL, GUARDS, ClientConstructor,
          CLIENT_GUARDS, BODIES, INJECTOR, HANDLERS, CLIENT_HANDLERS, HandlersOf,
          ERROR_HANDLER, RequestMethod, PARAM_HEADERS, HeadersParam, HeadersInjector,
          HeadersObject, HEADERS, CLIENT_HEADERS, HeadersClientParam, WITH_CREDENTIALS,
          CLIENT_WITH_CREDENTIALS, PATHS, QUERIES } from './types';
import { HttpRequest, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { REST_HANDLERS, BASE_HEADERS, BASE_WITH_CREDENTIALS } from './tokens';

type RestPropertyDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

class MHttpRequest<T> extends HttpRequest<T> {
  constructor(method: RequestMethod, url: string, body: any, init: any) {
    super(method, url, init);

    if (method === RequestMethod.DELETE && !!body) {
      (this as any).body = body;
      (this as any).headers = this.headers.set('Content-Type', 'application/json');
    }
  }
}

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
        // > Configure endpoint
        // _____________________________________________________________________________
        let endpoint = path !== undefined ? path : methodName;

        for (const [param, index] of Object.entries((target.constructor[PATHS] || {})[methodName] || {})) {
          endpoint = endpoint.replace(':' + param, args[index]);
        }

        // > Configure request body
        // _____________________________________________________________________________
        const bodyParamIndex = (target.constructor[BODIES] || {})[methodName];
        let body: any = null;

        if (typeof bodyParamIndex === 'number') {
          body = args[bodyParamIndex];
        }

        // > Configure Queries
        // _____________________________________________________________________________
        let query = new HttpParams();

        for (const [param, index] of Object.entries((target.constructor[QUERIES] || {})[methodName] || {})) {
          query = query.append(param, args[index]);
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

            for (const key of Object.keys(_headers || {})) {
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
            header = await (this as any)[header]();
          }

          for (const key of Object.keys(header || {})) {
            headers = headers.append(key, (header as any)[key]);
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
        const request = requestFactory(type as any, `${this[BASE_URL]}/${endpoint}`, { body, headers, withCredentials, params: query });

        // > Run guard process
        // _____________________________________________________________________________
        const guardsPromise = startGuardCheck(target, methodName, request, this)
          .then(result => {
            if (!result) { throw false; }
          })
          .catch(error => {
            if (error === false) {
              throw new GuardForbid(request);
            }

            throw error;
          });

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
          guardsPromise.then(() => <Promise<HttpResponse<any>>>this[HTTP_CLIENT].request(request).toPromise())
        );
      };

      return descriptor;
    };
  };
}

interface RequestConfig {
  headers: HttpHeaders;
  withCredentials: boolean;
  params: HttpParams;
}

function requestFactory<T = unknown>(
  method: RequestMethod.POST | RequestMethod.PUT | RequestMethod.PATCH | RequestMethod.DELETE,
  url: string,
  config: RequestConfig
): HttpRequest<T>;
function requestFactory<T = unknown>(
  method: RequestMethod.GET | RequestMethod.HEAD | RequestMethod.JSONP | RequestMethod.OPTIONS,
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
      return new HttpRequest<T>(method, url, body!, rest);
    case RequestMethod.DELETE:
      return new MHttpRequest<T>(method, url, body, rest);
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
          result = (next as any)(request);
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

  return handlers.reduce((prev: Promise<any>, next) => {
    let handler: Function;
    let method: 'then' | 'catch';

    if (typeof next === 'string') {
      method = (context as any)[next][ERROR_HANDLER] ? 'catch' : 'then';
      handler = (<Function>(context as any)[next]).bind(context);
    } else if (next.prototype && 'handle' in next.prototype) {
      const injectable = context[INJECTOR].get(next);
      method = injectable.handle[ERROR_HANDLER] ? 'catch' : 'then';
      handler = injectable.handle.bind(injectable);
    } else {
      method = (next as any)[ERROR_HANDLER] ? 'catch' : 'then';
      handler = next;
    }

    return prev[method as 'then'](res => handler(original, res));
  }, source);
}
