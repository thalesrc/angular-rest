import 'reflect-metadata';

/*
 * Public API Surface of rest
 */
export { RestModule } from './lib/rest.module';

export { Handler } from './lib/types';
export { BASE_URL, REST_HANDLERS } from './lib/tokens';

export { Client } from './lib/client.decorator';
export { Get, Post, Patch, Put, Delete, Head } from './lib/request.decorator';
export { Guards } from './lib/guards.decorator';
export { Body } from './lib/body.decorator';
export { Handlers } from './lib/handlers.decorator';

export { ErrorHandler } from './lib/error-handler.decorator';
