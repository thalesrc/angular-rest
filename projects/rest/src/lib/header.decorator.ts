import { PARAM_HEADERS, ClientConstructor } from './types';

export function Header(name: string, replace = false): ParameterDecorator {
  return function(target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    if (!(target as any).constructor[PARAM_HEADERS]) {
      (target as any).constructor[PARAM_HEADERS] = {};
    }

    (target as any).constructor[PARAM_HEADERS][propertyKey] = {
      ...(target as any).constructor[PARAM_HEADERS][propertyKey],
      [name]: [replace, parameterIndex]
    };
  };
}
