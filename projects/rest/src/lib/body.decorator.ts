import { ClientConstructor, BODIES } from './types';

export function Body(): ParameterDecorator {
  return function(target: {constructor: ClientConstructor} & Object, propertyKey: string | symbol, parameterIndex: number): void {
    target.constructor[BODIES] = {
      ...target.constructor[BODIES],
      [propertyKey]: parameterIndex
    };
  };
}
