import { Injector } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const INJECTOR: unique symbol = Symbol('INJECTOR');
export const HTTP_CLIENT: unique symbol = Symbol('HTTP_CLIENT');
export const BASE_URL: unique symbol = Symbol('BASE_URL');
export const GUARDS: unique symbol = Symbol('GUARDS');
export const CLIENT_GUARDS: unique symbol = Symbol('CLIENT_GUARDS');

export type GuardFunction = <T = any>(request: HttpRequest<T>) => boolean | Promise<boolean> | Observable<boolean>;
export type GuardFunctionsOf<T> = {[p in keyof T]: T[p] extends GuardFunction ? p : never}[keyof T];
export type Guard<T> = Array<GuardFunctionsOf<T> | GuardFunction> | GuardFunctionsOf<T> | GuardFunction;

export interface ClientInstance {
  [INJECTOR]: Injector;
  [HTTP_CLIENT]: HttpClient;
  [BASE_URL]: string;
}

export interface ClientConstructor<T = unknown> {
  [GUARDS]: {
    [CLIENT_GUARDS]: Array<GuardFunctionsOf<T> | GuardFunction>;
    [key: string]: Array<GuardFunctionsOf<T> | GuardFunction>
  };
}

export interface ClientOptions<T> {
  baseUrl?: string;
  guards?: Guard<T>;
}

