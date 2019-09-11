import 'reflect-metadata';

/*
 * Public API Surface of rest
 */
export { RestModule } from './lib/rest.module';

export { Handler, HeadersInjector, RestGuard } from './lib/types';
export { BASE_URL, REST_HANDLERS, BASE_HEADERS, BASE_WITH_CREDENTIALS } from './lib/tokens';

export { Client } from './lib/client.decorator';
export { Get, Post, Patch, Put, Delete, Head } from './lib/request.decorator';
export { Guards } from './lib/guards.decorator';
export { Body } from './lib/body.decorator';
export { Path } from './lib/path.decorator';
export { Query } from './lib/query.decorator';
export { Handlers } from './lib/handlers.decorator';
export { Header } from './lib/header.decorator';
export { Headers } from './lib/headers.decorator';
export { ErrorHandler } from './lib/error-handler.decorator';
export { WithCredentials } from './lib/with-credentials.decorator';
export { OnClientReady } from './lib/on-client-ready.decorator';
