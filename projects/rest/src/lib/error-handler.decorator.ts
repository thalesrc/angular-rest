import { ERROR_HANDLER } from './types';

export function ErrorHandler() {
  return function(target: any, parameter: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    descriptor.value[ERROR_HANDLER] = true;

    return descriptor;
  };
}
