import { Type, InjectionToken } from '@angular/core';
import { INJECTIONS } from './types';

export function InjectToken(token: Type<any> | InjectionToken<any>): PropertyDecorator {
  return function(target: Object, key: string | symbol) {
    (target as any).constructor[INJECTIONS] = {
      ...(target as any).constructor[INJECTIONS],
      [key]: token
    };
  };
}
