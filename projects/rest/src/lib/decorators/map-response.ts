import { RestClient } from '../rest-client';

/**
 * Map Response Metadata Key
 */
export const MAP_RESPONSE_TOKEN = Symbol('[Angular Rest] Map Response');

/**
 * Response Mappers
 *
 * @param mappers Mapper Functions _Marked methods can be passed like `ExampleClient.prototype.mapperMethod`_
 */
export function MapResponse(...mappers: ((incoming: any) => any)[]) {
  return function(target: RestClient, propertyKey: string, descriptor: any) {
    if (!descriptor[MAP_RESPONSE_TOKEN]) {
      descriptor[MAP_RESPONSE_TOKEN] = [];
    }

    descriptor[MAP_RESPONSE_TOKEN].push(...mappers);

    return descriptor;
  };
}
