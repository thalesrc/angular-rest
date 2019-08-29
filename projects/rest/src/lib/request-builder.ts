import { RequestMethod } from './request-methods.interface';
import { ClientInstance, HTTP_CLIENT, BASE_URL, GUARDS, ClientConstructor, CLIENT_GUARDS, BODIES } from './client.interface';
import { HttpRequest } from '@angular/common/http';
import { RestPropertyDecorator } from './rest-property-decorator.interface';
import { Observable } from 'rxjs';

class GuardForbid {
  public message = 'A guard function forbad the request';

  constructor(
    public request: HttpRequest<unknown>
  ) {}
}

export function requestBuilder(type: RequestMethod): (path?: string) => RestPropertyDecorator {
  return function (path?: string): RestPropertyDecorator {
    return function (target: ClientConstructor, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
      descriptor.value = async function(this: ClientInstance) {
        const url = path !== undefined ? path : methodName;
        const bodyParamIndex = (target.constructor[BODIES] || {})[methodName];
        let body: any = null;

        if (typeof bodyParamIndex === 'number') {
          body = [...arguments][bodyParamIndex];
        }

        const request = requestFactory(type as any, `${this[BASE_URL]}/${url}`, { body });

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

        // Response
        return await this[HTTP_CLIENT].request(request).toPromise();
      };

      return descriptor;
    };
  };
}

interface RequestConfig {
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
  config: { body?: T }
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
