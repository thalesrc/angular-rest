import { ClientConstructor, PATHS } from './types';

/**
 * A parameter decorated with `Path` will replace the specified key in the url
 *
 * @param key Path placeholder key
 */
export function Path(key: string): ParameterDecorator {
  return function(target: {constructor: ClientConstructor} & Object, propertyKey: string | symbol, parameterIndex: number): void {
    target.constructor[PATHS] = {
      ...target.constructor[PATHS]
    };

    target.constructor[PATHS] = {
      ...target.constructor[PATHS],
      [propertyKey]: {
        ...target.constructor[PATHS][propertyKey],
        [name]: parameterIndex
      }
    };
  };
}
