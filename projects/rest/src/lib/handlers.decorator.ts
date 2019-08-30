import { HandlersOf, HANDLERS } from './types';

export function Handlers<T>(handlers: HandlersOf<T>): (target: T, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function(target: T, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    target.constructor[HANDLERS] = {
      ...target.constructor[HANDLERS],
      [property]: handlers
    };

    return descriptor;
  };
}
