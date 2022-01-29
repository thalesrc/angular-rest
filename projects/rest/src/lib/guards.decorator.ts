import { GUARDS, Guard, ClientConstructor } from './types';

export function Guards<T extends new (...args: any[]) => any>(guardFunctions: Guard<T>): (target: T, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function(target: T, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const guards = guardFunctions instanceof Array ? [...guardFunctions] : [guardFunctions];

    (target as any).constructor[GUARDS] = {
      ...(target as any).constructor[GUARDS],
      [property]: guards
    };

    return descriptor;
  };
}
