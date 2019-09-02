import { WITH_CREDENTIALS } from './types';

export function WithCredentials(
  withCredentials = true
): (target: any, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function(target: any, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    target.constructor[WITH_CREDENTIALS] = {
      ...target.constructor[WITH_CREDENTIALS],
      [property]: withCredentials
    };

    return descriptor;
  };
}
