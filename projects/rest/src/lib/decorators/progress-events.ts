import { RestClient } from '../rest-client';
import { HttpEventType } from '@angular/common/http';

/**
 * Progress Event Metadata Key
 */
export const PROGRESS_EVENTS_TOKEN = Symbol('[Angular Rest] Progress Events');

/**
 * Defines which progress events will be listened
 *
 * @param events Http Progress Events to Listen
 */
export function ProgressEvents<T = any>(...events: HttpEventType[]) {
  return function(target: RestClient, propertyKey: string, descriptor: any) {
    if (!descriptor[PROGRESS_EVENTS_TOKEN]) {
      descriptor[PROGRESS_EVENTS_TOKEN] = new Set<HttpEventType>();
    }

    events.forEach(event => (<Set<HttpEventType>>descriptor[PROGRESS_EVENTS_TOKEN]).add(event));

    return descriptor;
  };
}
