import { RequestMethod } from './request-methods.interface';
import { ClientInstance, HTTP_CLIENT, BASE_URL, GUARDS, ClientConstructor } from './client.interface';
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
        const request = new HttpRequest(type as any, `${this[BASE_URL]}/${url}`);

        try {
          const guardsResult = await startGuardCheck(target, methodName, request, this);
          if (!guardsResult) { throw false; }

        } catch (error) {
          if (error === false) {
            throw new GuardForbid(request);
          }

          throw error;
        }


        return await this[HTTP_CLIENT].request(request).toPromise();
      };

      return descriptor;
    };
  };
}

async function startGuardCheck(
  target: ClientConstructor,
  methodName: string,
  request: HttpRequest<unknown>,
  context: ClientInstance
): Promise<boolean> {
  return await target[GUARDS][methodName].reduce((prev, next) => {
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
