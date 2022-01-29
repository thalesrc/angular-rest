import { HandlersOf, HANDLERS } from './types';

export function Handlers<T>(handlers: HandlersOf<T>): (target: T, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function(target: T, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    (target as any).constructor[HANDLERS] = {
      ...(target as any).constructor[HANDLERS],
      [property]: handlers
    };

    return descriptor;
  };
}
