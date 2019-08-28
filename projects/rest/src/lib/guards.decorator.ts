import { GUARDS, Guard } from './client.interface';

export function Guards<T>(guardFunctions: Guard<T>): (target: T, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function(target: T, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const guards = guardFunctions instanceof Array ? [...guardFunctions] : [guardFunctions];

    target.constructor[GUARDS] = {
      ...target.constructor[GUARDS],
      [property]: guards
    };

    return descriptor;
  };
}
