import { HEADERS, HeadersClientParam } from './types';

export function Headers<T>(
  headers: HeadersClientParam<T>
): (target: T, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function(target: T, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    target.constructor[HEADERS] = {
      ...target.constructor[HEADERS],
      [property]: headers
    };

    return descriptor;
  };
}
