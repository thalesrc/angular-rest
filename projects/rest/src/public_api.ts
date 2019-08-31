import 'reflect-metadata';

/*
 * Public API Surface of rest
 */
export { RestModule } from './lib/rest.module';

export { Handler, HeadersInjector } from './lib/types';
export { BASE_URL, REST_HANDLERS, BASE_HEADERS } from './lib/tokens';

export { Client } from './lib/client.decorator';
export { Get, Post, Patch, Put, Delete, Head } from './lib/request.decorator';
export { Guards } from './lib/guards.decorator';
export { Body } from './lib/body.decorator';
export { Handlers } from './lib/handlers.decorator';
export { Header } from './lib/header.decorator';
export { Headers } from './lib/headers.decorator';

export { ErrorHandler } from './lib/error-handler.decorator';
