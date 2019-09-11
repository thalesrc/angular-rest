import { ClientConstructor, QUERIES } from './types';

/**
 * Use this decorator to set a query parameter
 *
 * @param key Request query name
 */
export function Query(key: string): ParameterDecorator {
  return function(target: {constructor: ClientConstructor} & Object, propertyKey: string | symbol, parameterIndex: number): void {
    target.constructor[QUERIES] = {
      ...target.constructor[QUERIES]
    };

    target.constructor[QUERIES] = {
      ...target.constructor[QUERIES],
      [propertyKey]: {
        ...target.constructor[QUERIES][propertyKey],
        [key]: parameterIndex
      }
    };
  };
}
