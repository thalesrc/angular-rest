import { RestClient } from '../rest-client';
import { HttpResponse } from '@angular/common/http';

/**
 * Defines the media type(s) that the methods can produce
 * @param MediaType media type or custom mapper function
 */
export function Produces(mime: MediaType) {
  return function(target: RestClient, propertyKey: string, descriptor: any) {
    if (mime !== undefined) {
      if (mime === MediaType.JSON) {
        descriptor.mime = (res: HttpResponse<any>) => res.body;
      }
    }
    return descriptor;
  };
}


/**
 * Supported @Produces media types
 */
export enum MediaType {
  JSON
}
