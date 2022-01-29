import { BODIES, ClientConstructor } from './types';

export function Body(): ParameterDecorator {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    (target as ClientConstructor).constructor[BODIES] = {
      ...target.constructor[BODIES],
      [propertyKey]: parameterIndex
    };
  };
}
