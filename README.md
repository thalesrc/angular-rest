[![npm version](https://badge.fury.io/js/angular-async-http.svg)](https://badge.fury.io/js/angular-async-http)
[![GitHub version](https://badge.fury.io/gh/yavin5%2Fangular-async-http.svg)](https://badge.fury.io/gh/yavin5%2Fangular-async-http)
[![GitHub forks](https://img.shields.io/github/forks/yavin5/angular-async-http.svg?style=social&label=Fork&style=plastic)](https://github.com/yavin5/angular-async-http)
[![GitHub stars](https://img.shields.io/github/stars/yavin5/angular-async-http.svg?style=social&label=Star&style=plastic)](https://github.com/yavin5/angular-async-http)
[![GitHub issues](https://img.shields.io/github/issues/yavin5/angular-async-http.svg?style=plastic)](https://github.com/yavin5/angular-async-http)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/yavin5/angular-async-http.svg?style=plastic)](https://github.com/yavin5/angular-async-http)
[![license](https://img.shields.io/github/license/yavin5/angular-async-http.svg?style=plastic)](https://github.com/yavin5/angular-async-http)

# angular-async-http
Angular 4 Async HTTP client in typescript with promises, interceptors, and timeouts.
**Note:** Production Ready! (Well tested)

## Installation

```sh
npm install angular-async-http --save
```

## Example

```ts

import { Http, Request, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {
  HttpClient, RestClient, Client, GET, PUT, POST, DELETE, Headers, Path, Body, Query, Produces, MediaType
} from 'angular-async-http';

import { Todo } from './models/Todo';
import { SessionFactory } from './sessionFactory';

@Injectable()
@Client({
    serviceId: 'todo-service',
    baseUrl: 'http://localhost:3000/api/',
    headers: {
        'content-type': 'application/json'
    }
})
export class TodoClient extends RestClient {

    constructor(http:Http){
        super(<HttpClient>http);
    }

    protected requestInterceptor(req: Request):void {
        if (SessionFactory.getInstance().isAuthenticated) {
            req.headers.append('jwt', SessionFactory.getInstance().credentials.jwt);
        }
    }

    protected responseInterceptor(res: Observable<Response>): Observable<any> {
        // do anything with responses
        return res;
    }

    @Get("todo/")
    @Timeout(2000) //In milliseconds
    @Produces(MediaType.JSON)
    public getTodos( @Query("page") page:number, @Query("size", {default: 20}) size?:number, @Query("sort") sort?: string): Observable<Todo[]> { return null; };

    @Get("todo/{id}")
    @Timeout(2000) //In milliseconds
    @Map(resp => new Todo(resp.json()))
    public getTodoById( @Path("id") id: number): Observable<Todo>{ return null; };

    @Post("todo")
    @Timeout(2000) //In milliseconds
    @Headers({
        'content-type': 'application/json'
    })
    public postTodo( @Body todo: Todo): Observable<Response> { return null; };

    @Put("todo/{id}")
    @Timeout(2000) //In milliseconds
    public putTodoById( @Path("id") id: string, @Body todo: Todo): Observable<Response> { return null; };

    @Delete("todo/{id}")
    @Timeout(2000) //In milliseconds
    public deleteTodoById( @Path("id") id: string): Observable<Response> { return null; };

    // You can return a promise insteadof an Observable
    @Delete("todo/user/{user}")
    public deleteTodoByUser( @Path("user") id: string): Promise<Response> { return null; };
}
```

### Using it in your component

**```app.module.ts```**
``` ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule
  ],
  providers: [
    TodoClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
**```todo.component.ts```**
``` ts
// You need some or all of the following rxjs imports for Promise and Observable.
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'to-do',
})
export class ToDoCmp {

  constructor(private todoClient: TodoClient) {
  }

  //Use todoClient
  sampleUsage(){
    this.todoClient.getTodos( /* page */ 1).subscribe(data=>{
      console.log(data)
    })
  }  
}
```
## API Docs

### RestClient
#### Methods:
- `getServiceId(): string`: returns the serviceId of the RestClient
- `getBaseUrl(): string`: returns the base url of RestClient
- `getDefaultHeaders(): Object`: returns the default headers of RestClient in a key-value pair

### Class decorators:
- `@Client(args:{serviceId?: string, baseUrl?: string, headers?: any})`

### Method decorators:
- `@Get(url: String)`
- `@Post(url: String)`
- `@Put(url: String)`
- `@Patch(url: String)`
- `@Delete(url: String)`
- `@Head(url: String)`
- `@Headers(headers: Object)`
- `@Map(mapper:(resp : any)=>any)`
- `@OnEmit(emitter:(resp : Observable<any>)=>Observable<any>)`
- `@Timeout(timeout: number)`

### Parameter decorators:
- `@Path(name: string, value?:any|{value?:any})`
- `@Query(name: string, value?:any|{value?:any,format?:string})`
- `@Header(name: string, value?:any|{value?:any,format?:string})`
- `@Body`

#### Collection Format
Determines the format of the array if type array is used. (used for ``@Query`` and ``@Header``) Possible values are:
* ``Format.CSV`` - comma separated values ``foo,bar``.
* ``Format.SSV`` - space separated values ``foo bar``.
* ``Format.TSV`` - tab separated values ``foo\tbar``.
* ``Format.PIPES`` - pipe separated values ``foo|bar``.
* ``Format.MULTI`` - corresponds to multiple parameter instances instead of multiple values for a single instance ``foo=bar&foo=baz``. This is valid only for parameters in "query" or "formData".

Default value is ``Format.CSV``.

# Contributors

Brought to you by many contributors, including:  
  
TrustPortal Solutions Ltd  [http://trustportal.org](http://trustportal.org)  
Yavin Five  
deblockt  
Dmitry-Gorbenko  
Maxxton Group  [http://www.maxxton.com](http://www.maxxton.com)  
Domonkos Pal : Paldom  
Discountrobot  
TN-Kirontech  
LeFinc  
mmrath  [http://www.mmrath.com](http://www.mmrath.com)  
steven166  
Mayur Patel : mayur-novus

# License

MIT
