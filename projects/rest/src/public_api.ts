/*
 * Public API Surface of rest
 */
export { RestClient } from './lib/rest-client';

export { Client } from './lib/decorators/client';
export { Headers } from './lib/decorators/headers';
export { Map } from './lib/decorators/map';
export { Timeout } from './lib/decorators/timeout';
export { OnEmit } from './lib/decorators/on-emit';
export { ProgressEvents } from './lib/decorators/progress-events';
export { Body, Header, Query, Path, PlainBody } from './lib/decorators/parameters';
export { MediaType, Produces } from './lib/decorators/produces';
export { Get, Post, Patch, Put, Delete, Head } from './lib/decorators/request-methods';
