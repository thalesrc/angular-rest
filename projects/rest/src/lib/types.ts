import { Injector, Type } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

export const INJECTOR: unique symbol = Symbol('INJECTOR');
export const HTTP_CLIENT: unique symbol = Symbol('HTTP_CLIENT');
export const BASE_URL: unique symbol = Symbol('BASE_URL');
export const GUARDS: unique symbol = Symbol('GUARDS');
export const CLIENT_GUARDS: unique symbol = Symbol('CLIENT_GUARDS');
export const BODIES: unique symbol = Symbol('BODIES');
export const HANDLERS: unique symbol = Symbol('HANDLERS');
export const CLIENT_HANDLERS: unique symbol = Symbol('CLIENT_HANDLERS');
export const ERROR_HANDLER: unique symbol = Symbol('ERROR_HANDLER');
export const PARAM_HEADERS: unique symbol = Symbol('PARAM_HEADERS');

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

type FunctionsOf<T, U> = {[P in keyof T]: T[P] extends U ? P : never}[keyof T];

export type GuardFunction = <T = any>(request: HttpRequest<T>) => boolean | Promise<boolean>;
export type GuardFunctionsOf<T> = FunctionsOf<T, GuardFunction>;
export type Guard<T> = Array<GuardFunctionsOf<T> | GuardFunction> | GuardFunctionsOf<T> | GuardFunction;

export type HandlerFunction = (original: HttpResponse<any> | HttpErrorResponse, current: any) => any | Promise<any>;
export type HandlerFunctionsOf<T> = FunctionsOf<T, HandlerFunction>;
export type HandlersOf<T> = Array<HandlerFunctionsOf<T> | HandlerFunction | (new (...args: any[]) => Handler)>;

export interface Handler {
  handle: HandlerFunction;
}

export interface ClientInstance {
  [INJECTOR]: Injector;
  [HTTP_CLIENT]: HttpClient;
  [BASE_URL]: string;
}

export interface ClientConstructor<T = unknown> extends Object {
  constructor: {
    new (...args: any[]): any;
    [GUARDS]: {
      [CLIENT_GUARDS]: Array<GuardFunctionsOf<T> | GuardFunction>;
      [key: string]: Array<GuardFunctionsOf<T> | GuardFunction>
    };
    [BODIES]: {
      [key: string]: number;
    };
    [HANDLERS]: {
      [CLIENT_HANDLERS]: HandlersOf<T>;
      [key: string]: HandlersOf<T>;
    };
    [PARAM_HEADERS]: {
      [key: string]: {
        [key: string]: [boolean, number];
      }
    }
  };
}

export interface ClientOptions<T> {
  baseUrl?: string;
  guards?: Guard<T>;
  handlers?: HandlersOf<T>;
  providedIn?: Type<any> | 'root';
}

