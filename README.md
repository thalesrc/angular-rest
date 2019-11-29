[![travis](https://travis-ci.org/thalesrc/angular-rest.svg)](https://travis-ci.org/thalesrc/angular-rest)
[![npm](https://img.shields.io/npm/v/@thalesrc/angular-rest.svg)](https://www.npmjs.com/package/@thalesrc/angular-rest)
[![npm](https://img.shields.io/npm/dw/@thalesrc/angular-rest.svg)](https://www.npmjs.com/package/@thalesrc/angular-rest)
[![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-next.svg?v=101)](https://www.typescriptlang.org/)

# @thalesrc/angular-rest
Angular Rest Http Module with Typescript Declarative Annotations, Guards, Handlers and more

___________________________________________________________________________

- [@thalesrc/angular-rest](#thalesrcangular-rest)
  - [1. Installation](#1-installation)
  - [2. Basic Example](#2-basic-example)
  - [3. API Docs](#3-api-docs)
    - [3.1. Client Decorator](#31-client-decorator)
      - [3.1.1. ClientOptions](#311-clientoptions)
    - [3.2. Request Method Decorators](#32-request-method-decorators)
    - [3.3. Body Parameter Decorator](#33-body-parameter-decorator)
    - [3.3. Path Parameter Decorator](#33-path-parameter-decorator)
    - [3.4. Query Parameter Decorator](#34-query-parameter-decorator)
    - [3.5. Headers](#35-headers)
      - [3.5.1. Header Declaration Methods](#351-header-declaration-methods)
        - [3.5.1.1 HeaderInjector](#3511-headerinjector)
        - [3.5.1.2 HeadersObject](#3512-headersobject)
        - [3.5.1.3 Headers as Client Method](#3513-headers-as-client-method)
      - [3.5.2. Base Headers](#352-base-headers)
      - [3.5.3. Client Headers](#353-client-headers)
      - [3.5.4. Parameter Headers](#354-parameter-headers)
    - [3.6. Guards](#36-guards)
      - [3.6.1. Guard Declaration Methods](#361-guard-declaration-methods)
        - [3.6.1.1 RestGuard](#3611-restguard)
        - [3.6.1.2. Guard Function](#3612-guard-function)
        - [3.6.1.3. Guard Method](#3613-guard-method)
      - [3.6.2. Base Guards](#362-base-guards)
      - [3.6.3. Client Guards](#363-client-guards)
      - [3.6.4. Method Guards](#364-method-guards)
    - [3.7. Handlers](#37-handlers)
      - [3.7.1 ErrorHandlers](#371-errorhandlers)
      - [3.7.2 Handler Declaration Methods](#372-handler-declaration-methods)
        - [3.7.2.1 Handler](#3721-handler)
        - [3.7.2.2 Handler Function](#3722-handler-function)
        - [3.7.2.3 Handler Method](#3723-handler-method)
      - [3.7.3 Base Handlers](#373-base-handlers)
      - [3.7.4 Client Handlers](#374-client-handlers)
      - [3.7.5 Method Handlers](#375-method-handlers)
    - [3.8. RestModule](#38-restmodule)
    - [3.9. OnClientReady Decorator](#39-onclientready-decorator)
    - [3.10. WithCredentials Option](#310-withcredentials-option)
      - [3.10.1. As Module Config](#3101-as-module-config)
      - [3.10.2. As Provider](#3102-as-provider)
      - [3.10.3. As Client Config](#3103-as-client-config)
      - [3.10.4. WithCredentials Decorator](#3104-withcredentials-decorator)
      - [3.10.5. WithCredentialsParam Decorator](#3105-withcredentialsparam-decorator)
  - [4. Aot Limitations](#4-aot-limitations)
  - [5. Contributors](#5-contributors)
  - [6. License](#6-license)

____________________________________________________________________________

## 1. Installation

```sh
yarn add @thalesrc/angular-rest
```
or
```sh
npm install @thalesrc/angular-rest --save
```

____________________________________________________________________________

## 2. Basic Example

```ts
// app.module.ts

import { NgModule } from '@angular/core';
import { RestModule } from '@thalesrc/angular-rest';

import { TodoClient } from './todo.client';
import { TodoComponent } from './todo.component';

@NgModule({
  imports: [
    RestModule.forRoot({baseUrl: 'http://localhost:3000'})
  ],
  providers: [
    TodoClient
  ],
  declarations: [
    TodoComponent
  ]
})
export class AppModule {}

```

```ts
// todo.client.ts

import { HttpRequest } from '@angular/common/http';
import { Client, Get, Post, Body } from '@thalesrc/angular-rest';

@Client()
export class TodoClient {

  @Get()
  public todos(): Promise<Todo> {
    return null;
  }

  @Post('todos')
  public insertTodo(@Body() todo: Todo): Promise<void> {
    return null;
  }
}

```

```ts
// todo.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-todo',
  template: 'Hello World'
})
export class TodoComponent {
  constructor(private client: TodoClient) {
    this.client.todos().then(todos => {
      // Make something with todos
    });
  }

  async postTodo(todo: Todo): Promise<void> {
    return await this.client.insertTodo(todo);
  }
}

```
____________________________________________________________________________

## 3. API Docs

____________________________________________________________________________
### 3.1. Client Decorator

`@Client()` decorator marks a class as RestClient and provides functionality to make Http calls with its marked methods.

This decorator also marks the class as `Injectable()` and makes it to function as an Angular Service.

It can be configured by defining a `ClientOptions` object as a parameter

#### 3.1.1. ClientOptions

A `ClientOptions` object configures base options for the rest methods declared inside a `@Client()` class

```ts
interface ClientOptions<T> {
  baseUrl?: string;
  guards?: Guard<T>;
  handlers?: HandlersOf<T>;
  baseHeaders?: HeadersClientParam<T>;
  providedIn?: Type<any> | 'root';
}
```

```ts
@Client({
  baseUrl: 'http://localhost:3000',
  baseHeaders: [{'Secret-Key': 'The best rest util is @thalesrc/angular-rest'}]
  ...
})
export class TodoClient {
  ...
}
```
____________________________________________________________________________
### 3.2. Request Method Decorators

All of these decorators marks a method in a `@Client()` as a request builder. `path` can be specified to define the endpoint path. Otherwise, the method name is going to be used as path.

The method return type should be defined as `Promise` and function should be empty but only returning `null`. Decorators will handle all the rest.

* `@Get(path?: string)`
* `@Post(path?: string)`
* `@Put(path?: string)`
* `@Delete(path?: string)`
* `@Patch(path?: string)`
* `@Options(path?: string)`
* `@Head(path?: string)`
* `@Jsonp(path?: string)`


*Example:*
```ts
@Client()
export class TodoClient {
  @Get()
  public todos(): Promise<Todo> {
    return null;
  }

  @Post('todos')
  public postTodo(@Body() todo: Todo): Promise<Todo> {
    return null;
  }
}
```
____________________________________________________________________________
### 3.3. Body Parameter Decorator

Mark a parameter with `@Body()` decorator to fill body object with it.

A `FormData` instance can be used for image uploads etc.

*`Body` decorator can be used in only POST, PUT, PATCH requests*

*Example:*
```ts
@Client()
export class TodoClient {
  @Post('todos')
  public postTodo(@Body() todo: Todo): Promise<Todo> {
    return null;
  }

  @Post('image')
  public uploadImage(@Body() data: FormData): Promise<string> {
    return null;
  }
}

@Component({
  ...
})
export class AComponent {
  constructor(private client: TodoClient) {}

  public async postTodo(todo: Todo): Promise<Todo> {
    return await this.client.postTodo(todo);
  }

  public async uploadImage(image: Blob): Promise<string> {
    const data = new FormData();
    data.append('image', image);

    return await this.client.uploadImage(data);
  }
}
```
____________________________________________________________________________
### 3.3. Path Parameter Decorator

Mark a parameter decorated with `Path` to replace the specified key in the url

*Example:*
```ts
@Client()
export class TodoClient {
  @Patch('todos/:id')
  public patchTodo(@Body() todo: Todo, @Path('id') id: string): Promise<Todo> {
    return null;
  }
}

@Component({
  ...
})
export class AComponent {
  constructor(private client: TodoClient) {}

  public async postTodo(todo: Todo, todoId: string): Promise<Todo> {
    return await this.client.patchTodo(todo, todoId);
  }
}
```
____________________________________________________________________________
### 3.4. Query Parameter Decorator
to be determined

____________________________________________________________________________
### 3.5. Headers
To be determined

#### 3.5.1. Header Declaration Methods
To be determined

##### 3.5.1.1 HeaderInjector
To be determined

##### 3.5.1.2 HeadersObject
To be determined

##### 3.5.1.3 Headers as Client Method
To be determined

#### 3.5.2. Base Headers
To be determined

#### 3.5.3. Client Headers
To be determined

#### 3.5.4. Parameter Headers
To be determined
____________________________________________________________________________
### 3.6. Guards

Guards run just before a request has been sent to check whether request should be sent or not

#### 3.6.1. Guard Declaration Methods

Guards can be a function, a method of a client or an injectable of `RestGuard`

##### 3.6.1.1 RestGuard

Define an injectable as a rest guard and declare them as a guard ([Base Guard](#362-base-guards), [Client Guard](#363-client-guards), [Method Guard](#364-method-guards)) to check a request can be sent or not.

__Don't forget to provide them in a module__

*Example:*
```ts
@Injectable()
export class PostTodoGuard implements RestGuard {
 constructor(private session: SessionService) {}

 async canSend(req: HttpRequest<any>): Promise<boolean> {
   return await this.session.loggedIn$.pipe(first()).toPromise()
 }
}

@Client()
export class TodoClient {
 @Post('todos')
 @Guards([PostTodoGuard])
 public async postTodos(todo: Todo): Promise<void> {
   return null;
 }
}

@NgModule({
 providers: [
   TodoClient,
   PostTodoGuard
 ]
})
export class TodoModule {}
```

##### 3.6.1.2. Guard Function

A single function can be a rest guard if it accepts first param as `HttpRequest<any>` and returns whether `boolean` or `Promise<boolean>`

*Example:*
```ts
function postTodoGuard(req: HttpRequest<Todo>): boolean {
  return req.body.canBeSent;
}

@Client()
export class TodoClient {
 @Post('todos')
 @Guards([postTodoGuard])
 public async postTodos(todo: Todo): Promise<void> {
   return null;
 }
}
```

##### 3.6.1.3. Guard Method
To be determined

#### 3.6.2. Base Guards
To be determined

#### 3.6.3. Client Guards
To be determined

#### 3.6.4. Method Guards
To be determined
____________________________________________________________________________
### 3.7. Handlers
To be determined

#### 3.7.1 ErrorHandlers
To be determined

#### 3.7.2 Handler Declaration Methods
To be determined

##### 3.7.2.1 Handler
To be determined

##### 3.7.2.2 Handler Function
To be determined

##### 3.7.2.3 Handler Method
To be determined

#### 3.7.3 Base Handlers
To be determined

#### 3.7.4 Client Handlers
To be determined

#### 3.7.5 Method Handlers
To be determined
____________________________________________________________________________
### 3.8. RestModule
To be determined
____________________________________________________________________________
### 3.9. OnClientReady Decorator

In client constructor functions, calling a rest call is forbidden. Because the client dependencies have not been set yet when the constructor function called.

To run some code when client instance created, `@OnClientReady()` decorator can be used. It will mark a method of a client to be called right after construction.

*Example:*
```ts
import { Client, OnClientReady } from '@thalesrc/angular-rest';
import { TodoCacheService } from './todo-cache.service';

@Client()
export class TodoClient {
  constructor(
    private todoCacheService: TodoCacheService
  ) {}

  @OnClientReady()
  private onReady() {
    const todos = await this.todos();

    this.todoCacheService.cacheTodos(todos);
  }

  @Get()
  public todos(): Promise<Todo[]> {
    return null;
  }
}
```
____________________________________________________________________________
### 3.10. WithCredentials Option
Defines whether a request should be sent with outgoing credentials (cookies). Default `true`

#### 3.10.1. As Module Config
It can be set in module config as base option. That would configure for all requests unless it is declared especially by other methods.

*Example:*
```ts
import { NgModule } from '@angular/core';
import { RestModule } from '@thalesrc/angular-rest';

@NgModule({
  imports: [
    RestModule.forRoot({withCredentials: false})
    ...
  ],
})
export class AppModule {}
```

#### 3.10.2. As Provider
It can be provided with the `BASE_WITH_CREDENTIALS` token as base option. That would also configure for all requests like [As Module Config](#481-as-module-config) unless it is declared especially by other methods.

*Example:*
```ts
import { NgModule } from '@angular/core';
import { RestModule, BASE_WITH_CREDENTIALS } from '@thalesrc/angular-rest';

@NgModule({
  imports: [
    RestModule
    ...
  ],
  providers: [
    {provide: BASE_WITH_CREDENTIALS, useValue: false},
    ...
  ]
})
export class AppModule {}
```

#### 3.10.3. As Client Config
It can be set in `@Client()` decorator as an option. That would configure withCredentials option for all the calls in that client.

*Example:*
```ts
import { Client } from '@thalesrc/angular-rest';

@Client({
  withCredentials: true
})
export class TodoClient {
  ...
}
```

#### 3.10.4. WithCredentials Decorator
It can be set by `@WithCredentials()` decorator on top a rest call. That would configure withCredentials option for only that call.

*Example:*
```ts
import { Client, WithCredentials } from '@thalesrc/angular-rest';

@Client()
export class TodoClient {
  @Get()
  @WithCredentials(true)
  public todos(): Promise<Todo[]> {
    return null;
  }
}
```

#### 3.10.5. WithCredentialsParam Decorator
to be developed

____________________________________________________________________________
## 4. Aot Limitations

This package supports aot builds, however there are some limitations.

* Every `@Client` constructor should be defined as:

```ts
import { Injector } from '@angular/core';
import { Client } from '@thalesrc/angular-rest';

@Client()
export class TodoClient {
  constructor(injector: Injector) {}
}
```

* Injectables should be injected via `InjectToken` decorator

```ts
import { Injector } from '@angular/core';
import { Client, InjectToken } from '@thalesrc/angular-rest';
import { AuthService } from './auth.service';

@Client()
export class TodoClient {
  @InjectToken(AuthService)
  private authService: AuthService;

  constructor(injector: Injector) {}
}
```

* Base handlers and base headers shouldn't be defined in `RestModule.forRoot` static method. All of these should be provided in module providers

```ts
import { NgModule } from '@angular/core';
import { RestModule, BASE_HEADERS, BASE_HANDLERS } from '@thalesrc/angular-rest';

import { BaseHeaders, BaseHandler } from './services';

@NgModule({
  imports: [RestModule],
  providers: [
    BaseHeaders,
    BaseHandler,
    {provide: BASE_HEADERS, useValue: [BaseHeaders, {'Secret-Key': 'topsecret'}], multi: true},
    {provide: BASE_HANDLERS, useValue: [BaseHandler], multi: true},
  ]
})
export class AppModule {}
```
____________________________________________________________________________
## 5. Contributors

Ali Şahin Özçelik

_This repository is started as a fork of [steven166/angular-rest-client](https://github.com/steven166/angular-rest-client) and completely refactored now_
____________________________________________________________________________
## 6. License

MIT
