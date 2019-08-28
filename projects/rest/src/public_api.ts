import 'reflect-metadata';

/*
 * Public API Surface of rest
 */
export { RestModule } from './lib/rest.module';

export { Client } from './lib/client.decorator';

// export { Headers } from './lib/decorators/headers';
// export { MapResponse } from './lib/decorators/map-response';
// export { Mapper } from './lib/decorators/mapper';
// export { Timeout } from './lib/decorators/timeout';
// export { OnEmit } from './lib/decorators/on-emit';
// export { ProgressEvents } from './lib/decorators/progress-events';
// export { Body, Header, Query, Path, PlainBody } from './lib/decorators/parameters';
// export { MediaType, Produces } from './lib/decorators/produces';
export { Get, Post, Patch, Put, Delete, Head } from './lib/request.decorator';
export { Guards } from './lib/guards.decorator';
