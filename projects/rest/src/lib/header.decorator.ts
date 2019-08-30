import { PARAM_HEADERS, ClientConstructor } from './types';

export function Header(name: string, replace = false): ParameterDecorator {
  return function(target: {constructor: ClientConstructor} & Object, propertyKey: string, parameterIndex: number): void {
    if (!target.constructor[PARAM_HEADERS]) {
      target.constructor[PARAM_HEADERS] = {};
    }

    target.constructor[PARAM_HEADERS][propertyKey] = {
      ...target.constructor[PARAM_HEADERS][propertyKey],
      [name]: [replace, parameterIndex]
    };
  };
}
