import { HEADERS, HeadersClientParam } from './types';

export function Headers<T>(
  headers: HeadersClientParam<T>
): (target: T, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function(target: T, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    (target as any).constructor[HEADERS] = {
      ...(target as any).constructor[HEADERS],
      [property]: headers
    };

    return descriptor;
  };
}
