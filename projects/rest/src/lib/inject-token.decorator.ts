import { Type, InjectionToken } from '@angular/core';
import { INJECTIONS } from './types';

export function InjectToken(token: Type<any> | InjectionToken<any>): PropertyDecorator {
  return function(target: Object, key: string | symbol) {
    target.constructor[INJECTIONS] = {
      ...target.constructor[INJECTIONS],
      [key]: token
    };
  };
}
