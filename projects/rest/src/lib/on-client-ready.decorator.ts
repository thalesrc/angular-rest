import { ON_CLIENT_READY } from './types';

export function OnClientReady(): (target: any, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
  return function(target: any, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    target.constructor[ON_CLIENT_READY] = property;

    return descriptor;
  };
}
