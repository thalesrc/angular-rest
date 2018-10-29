import { RestClient } from '../rest-client';

/**
 * Mapper Metadata Key
 */
export const MAPPER_TOKEN = Symbol('[Angular Rest] Mapper');

/**
 * Marks the method as Mapper and binds the instance to `this` object
 */
export function Mapper() {
  return function(target: RestClient, propertyKey: string, descriptor: any) {
    descriptor.value[MAPPER_TOKEN] = target;
    return descriptor;
  };
}
