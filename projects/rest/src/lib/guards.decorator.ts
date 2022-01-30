import { GUARDS, Guard, ClientConstructor } from './types';

export function Guards<T>(guardFunctions: Guard<T>): (target: T, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function(Target: T, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const guards = guardFunctions instanceof Array ? [...guardFunctions] : [guardFunctions];

    const TTarget: ClientConstructor<T> = Target as any;

    TTarget.constructor[GUARDS] = {
      ...TTarget.constructor[GUARDS],
      [property]: guards
    };

    return descriptor;
  };
}
