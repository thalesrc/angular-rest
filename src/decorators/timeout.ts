import { RestClient } from "../rest-client";

/**
 * Defines a custom timeout function
 * @param timeout function to set timeout
 */
export function Timeout(timeout:number){
  return function(target: RestClient, propertyKey: string, descriptor: any) {
    if(!descriptor.timeout){
      descriptor.timeout = [];
    }
    descriptor.timeout.push(timeout);
    return descriptor;
  }
}
