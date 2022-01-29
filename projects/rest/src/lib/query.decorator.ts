import { ClientConstructor, QUERIES } from './types';

/**
 * Use this decorator to set a query parameter
 *
 * @param key Request query name
 */
export function Query(key: string): ParameterDecorator {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    (target as any).constructor[QUERIES] = {
      ...(target as any).constructor[QUERIES]
    };

    (target as any).constructor[QUERIES] = {
      ...(target as any).constructor[QUERIES],
      [propertyKey]: {
        ...(target as any).constructor[QUERIES][propertyKey],
        [key]: parameterIndex
      }
    };
  };
}
