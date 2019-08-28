import { requestBuilder } from './request-builder';
import { RequestMethod } from './request-methods.interface';

export const Get = requestBuilder(RequestMethod.GET);
export const Post = requestBuilder(RequestMethod.POST);
export const Put = requestBuilder(RequestMethod.PUT);
export const Delete = requestBuilder(RequestMethod.DELETE);
export const Patch = requestBuilder(RequestMethod.PATCH);
export const Options = requestBuilder(RequestMethod.OPTIONS);
export const Head = requestBuilder(RequestMethod.HEAD);
export const Jsonp = requestBuilder(RequestMethod.JSONP);
