import { methodBuilder } from '../builders/request-builder';
import { RestClient } from "../rest-client";

export enum RequestMethod {

  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  JSONP = "JSONP"

};

/**
 * Get method
 * @param {string} url - resource url of the method
 */
export var Get = methodBuilder( RequestMethod.GET );

/**
 * Post method
 * @param {string} url - resource url of the method
 */
export var Post = methodBuilder( RequestMethod.POST );

/**
 * Put method
 * @param {string} url - resource url of the method
 */
export var Put = methodBuilder( RequestMethod.PUT );

/**
 * Patch method
 * @param {string} url - resource url of the method
 */
export var Patch = methodBuilder( RequestMethod.PATCH );

/**
 * Delete method
 * @param {string} url - resource url of the method
 */
export var Delete = methodBuilder( RequestMethod.DELETE );

/**
 * Head method
 * @param {string} url - resource url of the method
 */
export var Head = methodBuilder( RequestMethod.HEAD );

/**
 * Options method
 * @param {string} url - resource url of the method
 */
export var Options = methodBuilder( RequestMethod.OPTIONS );

/**
 * JSONP method
 * @param {string} url - resource url of the method
 */
export var JsonP = methodBuilder( RequestMethod.JSONP );

