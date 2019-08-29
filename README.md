[![travis](https://travis-ci.org/thalesrc/angular-rest.svg)](https://travis-ci.org/thalesrc/angular-rest)
[![npm](https://img.shields.io/npm/v/@thalesrc/angular-rest.svg)](https://www.npmjs.com/package/@thalesrc/angular-rest)
[![npm](https://img.shields.io/npm/dw/@thalesrc/angular-rest.svg)](https://www.npmjs.com/package/@thalesrc/angular-rest)
[![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-next.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

# ATTENTION: DO NOT USE!!! THIS PACKAGE IS UNDER DEVELOPMENT

# @thalesrc/angular-rest
Angular HTTP client with Typescript Declarative Annotations, Guards, Interceptors and Timeouts.

## Installation

```sh
yarn add @thalesrc/angular-rest
```
or
```sh
npm install @thalesrc/angular-rest --save
```

## Example

```ts
// app.module.ts

import { NgModule } from '@angular/core';
import { RestModule } from '@thalesrc/angular-rest';

@NgModule({
  imports: [
    RestModule.forRoot({baseUrl: 'http://localhost:3000'})
  ]
})
export class AppModule {}

```

```ts
// todo.client.ts

import { HttpRequest } from '@angular/common/http';
import { Client, Get, Post, Guards, Body } from '@thalesrc/angular-rest';
import { map, first } from 'rxjs/operators';

@Client<TodoClient>({
  guards: ['authGuard']
})
export class TodoClient {
  constructor(
    private authService: AuthService
  ) {}

  public authGuard(request: HttpRequest<any>): boolean {
    return this.authService.isAuthorized;
  }

  public adminGuard(request: HttpRequest<any>): Observable<boolean> {
    return this.authService.user$.pipe(map(user => user.type === 'admin'), first());
  }

  @Get()
  public todos(): Promise<Todo> {
    return null;
  }

  @Post('todos')
  @Guards<TodoClient>(['adminGuard', postGuard])
  public insertTodo(@Body() todo: Todo): Promise<void> {
    return null;
  }
}

function postGuard(request: HttpRequest<any>): boolean {
  return true;
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

## API Docs

# Contributors

Ali Şahin Özçelik

_This repository is started as a fork of [steven166/angular-rest-client](https://github.com/steven166/angular-rest-client) and completely refactored now_

# License

MIT
