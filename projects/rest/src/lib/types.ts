import { Injector, Type } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

export const INJECTOR: unique symbol = Symbol('INJECTOR');
export const HTTP_CLIENT: unique symbol = Symbol('HTTP_CLIENT');
export const BASE_URL: unique symbol = Symbol('BASE_URL');
export const GUARDS: unique symbol = Symbol('GUARDS');
export const CLIENT_GUARDS: unique symbol = Symbol('CLIENT_GUARDS');
export const BODIES: unique symbol = Symbol('BODIES');
export const PATHS: unique symbol = Symbol('PATHS');
export const QUERIES: unique symbol = Symbol('QUERIES');
export const HANDLERS: unique symbol = Symbol('HANDLERS');
export const CLIENT_HANDLERS: unique symbol = Symbol('CLIENT_HANDLERS');
export const ERROR_HANDLER: unique symbol = Symbol('ERROR_HANDLER');
export const PARAM_HEADERS: unique symbol = Symbol('PARAM_HEADERS');
export const HEADERS: unique symbol = Symbol('HEADERS');
export const CLIENT_HEADERS: unique symbol = Symbol('CLIENT_HEADERS');
export const WITH_CREDENTIALS: unique symbol = Symbol('WITH_CREDENTIALS');
export const CLIENT_WITH_CREDENTIALS: unique symbol = Symbol('CLIENT_WITH_CREDENTIALS');
export const ON_CLIENT_READY: unique symbol = Symbol('ON_CLIENT_READY');
export const INJECTIONS: unique symbol = Symbol('INJECTIONS');

/**
 * Http Request Methods
 */
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
 * Returns specified type of method names of an interface/class
 *
 * @template T Class/Interface type
 * @template U Method type
 */
type FunctionsOf<T, U> = {[P in keyof T]: T[P] extends U ? P : never}[keyof T];

/**
 * Returns a class-function type of an interface/class
 */
type ClassOf<T> = new (...args: any[]) => T;

/**
 * Use to define an injectable as a rest guard
 */
export interface RestGuard {
  canSend(request: HttpRequest<any>): boolean | Promise<boolean>;
}
export type GuardFunction1 = <T = any>(request: HttpRequest<T>) => boolean;
export type GuardFunction2 = <T = any>(request: HttpRequest<T>) => Promise<boolean>;
export type GuardFunction = GuardFunction1 | GuardFunction2;
export type GuardFunctionsOf<T> = FunctionsOf<T, GuardFunction>;
export type GuardType<T> = GuardFunctionsOf<T> | GuardFunction | ClassOf<RestGuard>;
export type Guard<T> = GuardType<T>[] | GuardType<T>;

export type HandlerFunction1 = (original: HttpResponse<any>, current: any) => any | Promise<any>;
export type HandlerFunction2 = (original: HttpErrorResponse, current: any) => any | Promise<any>;
export type HandlerFunction = HandlerFunction1 | HandlerFunction2;
export type HandlerFunctionsOf<T> = FunctionsOf<T, HandlerFunction>;
export type HandlersOf<T> = Array<HandlerFunctionsOf<T> | HandlerFunction | (new (...args: any[]) => Handler)>;
export interface Handler {
  handle: HandlerFunction;
}

export interface HeadersObject {
  [key: string]: string | string[];
}

type HeaderInjectorResponse = HeadersObject | Promise<HeadersObject>;

export abstract class HeadersInjector {
  abstract inject(): HeaderInjectorResponse;
}

export type HeaderInjectorType = ClassOf<HeadersInjector>;
export type HeadersParam = Array<HeadersObject | HeaderInjectorType>;
export type HeadersClientParam<T> = Array<HeadersObject | HeaderInjectorType | FunctionsOf<T, () => HeaderInjectorResponse>>;

export interface ClientInstance {
  [INJECTOR]: Injector;
  [HTTP_CLIENT]: HttpClient;
  [BASE_URL]: string;
}

export interface ClientConstructor<T = unknown> extends Object {
  constructor: {
    new (...args: any[]): any;
    [GUARDS]: {
      [CLIENT_GUARDS]: GuardType<T>[];
      [key: string]: GuardType<T>[];
    };
    [BODIES]: {
      [key: string]: number;
    };
    [PATHS]: {
      [key: string]: {
        [key: string]: number;
      };
    };
    [QUERIES]: {
      [key: string]: {
        [key: string]: number;
      };
    };
    [HANDLERS]: {
      [CLIENT_HANDLERS]: HandlersOf<T>;
      [key: string]: HandlersOf<T>;
    };
    [PARAM_HEADERS]: {
      [key: string]: {
        [key: string]: [boolean, number];
      }
    };
    [HEADERS]: {
      [CLIENT_HEADERS]: HeadersClientParam<T>;
      [key: string]: HeadersClientParam<T>;
    };
    [WITH_CREDENTIALS]: {
      [CLIENT_WITH_CREDENTIALS]: boolean;
      [key: string]: boolean;
    };
    [ON_CLIENT_READY]: string;
    [INJECTIONS]: {
      [key: string]: any;
    }
  };
}

export interface ClientOptions<T> {
  baseUrl?: string;
  guards?: Guard<T>;
  handlers?: HandlersOf<T>;
  baseHeaders?: HeadersClientParam<T>;
  providedIn?: Type<any> | 'root';
  withCredentials?: boolean;
}

