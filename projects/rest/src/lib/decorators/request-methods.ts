import { methodBuilder } from '../builders/request-builder';

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  JSONP = 'JSONP'
}

/**
 * Get method
 * @param url - resource url of the method
 */
export let Get = methodBuilder( RequestMethod.GET );

/**
 * Post method
 * @param url - resource url of the method
 */
export let Post = methodBuilder( RequestMethod.POST );

/**
 * Put method
 * @param url - resource url of the method
 */
export let Put = methodBuilder( RequestMethod.PUT );

/**
 * Patch method
 * @param url - resource url of the method
 */
export let Patch = methodBuilder( RequestMethod.PATCH );

/**
 * Delete method
 * @param url - resource url of the method
 */
export let Delete = methodBuilder( RequestMethod.DELETE );

/**
 * Head method
 * @param url - resource url of the method
 */
export let Head = methodBuilder( RequestMethod.HEAD );

/**
 * Options method
 * @param url - resource url of the method
 */
export let Options = methodBuilder( RequestMethod.OPTIONS );

/**
 * JSONP method
 * @param url - resource url of the method
 */
export let JsonP = methodBuilder( RequestMethod.JSONP );

