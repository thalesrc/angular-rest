import { ERROR_HANDLER } from './types';

export function ErrorHandler(): MethodDecorator {
  return function(target: any, parameter: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    descriptor.value[ERROR_HANDLER] = true;

    return descriptor;
  };
}
