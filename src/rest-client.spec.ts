
import {assert} from 'chai';
import { Observable } from 'rxjs';
import { Http, Request, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { RestClient } from './rest-client';
import { Get } from './decorators/request-methods';
import { Client } from './decorators/client';

describe('RestClient', () => {
  beforeEach(() => {
    // Nothing here yet.
  });

  it('checkSetup', () => {
    // Arrange
    let requestMock = new HttpMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions()));
    });
    let testClient = new TestClient1(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    assert.equal(requestMock.callCount, 1);
    assert.equal(requestMock.lastRequest.method, RequestMethod.Get);

  });

  it('call requestInterceptor', () => {
    // Arrange
    let requestMock = new HttpMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions()));
    });
    let testClient = new TestClient2(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    assert.equal(testClient.interceptorCallCount, 1);
    assert.equal(testClient.interceptorRequest.method, RequestMethod.Get);

  });

  it('call responseInterceptor', () => {
    // Arrange
    let requestMock = new HttpMock((req:Request) => {
      return Observable.of(new Response(new ResponseOptions({status: 200})));
    });
    let testClient = new TestClient3(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    assert.equal(testClient.interceptorCallCount, 1);

  });
});

class HttpMock extends Http {

  public callCount:number = 0;
  public lastRequest:Request;

  constructor(private requestFunction: (req:Request) => Observable<Response>) {
    super(null, null);
  }

  public request(req:Request):Observable<Response> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }
}

class TestClient1 extends RestClient {

  constructor(http: Http) {
    super(http);
  }

  @Get('/test')
  public getItems(): Observable<Response> {
    return null;
  }

}

class TestClient2 extends RestClient {

  public interceptorCallCount: number = 0;
  public interceptorRequest: Request;

  @Get('/test')
  public getItems():Observable<Response> {
    return null;
  }

  protected requestInterceptor(req: Request): void {
    this.interceptorCallCount++;
    this.interceptorRequest = req;
  }

}

class TestClient3 extends RestClient {

  public interceptorCallCount: number = 0;
  public interceptorResponse: Observable<Response>;

  @Get('/test')
  public getItems(): Observable<Response> {
    return null;
  }

  protected responseInterceptor(res: Observable<Response>): Observable<any> {
    this.interceptorCallCount++;
    this.interceptorResponse = res;
    return res;
  }

}
