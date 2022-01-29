import { ClientConstructor, PATHS } from './types';

/**
 * A parameter decorated with `Path` will replace the specified key in the url
 *
 * @param key Path placeholder key
 */
export function Path(key: string): ParameterDecorator {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    (target as any).constructor[PATHS] = {
      ...(target as any).constructor[PATHS]
    };

    (target as any).constructor[PATHS] = {
      ...(target as any).constructor[PATHS],
      [propertyKey]: {
        ...(target as any).constructor[PATHS][propertyKey],
        [key]: parameterIndex
      }
    };
  };
}
