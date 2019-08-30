import { ClientInstance, HTTP_CLIENT, BASE_URL, GUARDS, ClientConstructor,
          CLIENT_GUARDS, BODIES, INJECTOR, HANDLERS, CLIENT_HANDLERS, HandlersOf,
          ERROR_HANDLER, RequestMethod, PARAM_HEADERS } from './types';
import { HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { REST_HANDLERS } from './tokens';

type RestPropertyDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

class GuardForbid {
  public message = 'A guard function forbad the request';

  constructor(
    public request: HttpRequest<unknown>
  ) {}
}

export function requestBuilder(type: RequestMethod): (path?: string) => RestPropertyDecorator {
  return function (path?: string): RestPropertyDecorator {
    return function (target: ClientConstructor, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
      descriptor.value = async function(this: ClientInstance, ...args: any[]) {
        // Configure full url
        const url = path !== undefined ? path : methodName;

        // Configure request body
        const bodyParamIndex = (target.constructor[BODIES] || {})[methodName];
        let body: any = null;

        if (typeof bodyParamIndex === 'number') {
          body = args[bodyParamIndex];
        }

        // Configure Headers
        let headers = new HttpHeaders();

        for (const [name, [replace, index]] of Object.entries((target.constructor[PARAM_HEADERS] || {})[methodName] || {})) {
          const method: 'set' | 'append' = replace ? 'set' : 'append';

          headers = headers[method](name, args[index]);
        }

        // Create request object
        const request = requestFactory(type as any, `${this[BASE_URL]}/${url}`, { body, headers });

        // Run guard process
        try {
          const guardsResult = await startGuardCheck(target, methodName, request, this);
          if (!guardsResult) { throw false; }

        } catch (error) {
          if (error === false) {
            throw new GuardForbid(request);
          }

          throw error;
        }

        // Handlers
        const globalHandlers: HandlersOf<any> = (<any[]>this[INJECTOR].get(REST_HANDLERS)).reduce((prev, next) => [...prev, ...next], []);
        const clientHandlers: HandlersOf<any> = target.constructor[HANDLERS][CLIENT_HANDLERS];
        const methodHandlers: HandlersOf<any> = target.constructor[HANDLERS][methodName] || [];

        // Result
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
  config: RequestConfig & { body?: T }
): HttpRequest<T> {
  switch (method) {
    case RequestMethod.POST:
    case RequestMethod.PUT:
    case RequestMethod.PATCH:
      const body = config.body;
      delete config.body;
      return new HttpRequest<T>(method, url, body, <RequestConfig>config);
    default:
      return new HttpRequest<T>(<'GET'>method, url, <RequestConfig>config);
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
      if (!passed) {
        throw false;
      }

      let result = typeof next === 'function' ? next(request) : (<any>context)[next](request);

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

  return handlers.reduce((prev: PromiseLike<any>, next, index: number) => {
    let handler: Function;
    let method: 'then' | 'catch';

    if (typeof next === 'string') {
      method = context[next][ERROR_HANDLER] ? 'catch' : 'then';
      handler = (<Function>context[next]).bind(context);
    } else if ('handle' in next.prototype) {
      const injectable = context[INJECTOR].get(next);
      method = injectable.handle[ERROR_HANDLER] ? 'catch' : 'then';
      handler = injectable.handle.bind(injectable);
    } else {
      method = 'then';
      handler = next;
    }

    return prev[method](res => {
      if (index === 0) {
        original = res;
      }

      return handler(original, res);
    });
  }, source);
}
