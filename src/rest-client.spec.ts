import { assert } from 'chai';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from './rest-client';
import { Get, RequestMethod } from './decorators/request-methods';

describe( 'RestClient', () => {
  beforeEach( () => {
    // Nothing here yet.
  } );

  it( 'checkSetup', () => {
    // Arrange
    let requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return Observable.of( new HttpResponse() );
    } );
    let testClient  = new TestClient1( requestMock );

    // Act
    let result = testClient.getItems();

    // Assert
    assert.equal( requestMock.callCount, 1 );
    assert.equal( requestMock.lastRequest.method, RequestMethod.GET );

  } );

  it( 'call requestInterceptor', () => {
    // Arrange
    let requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return Observable.of( new HttpResponse<any>( ) );
    } );
    let testClient  = new TestClient2( requestMock );

    // Act
    let result = testClient.getItems();

    // Assert
    assert.equal( testClient.interceptorCallCount, 1 );
    assert.equal( testClient.interceptorRequest.method, RequestMethod.GET );

  } );

  it( 'call responseInterceptor', () => {
    // Arrange
    let requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return Observable.of( new HttpResponse<any>( { status: 200 } ) );
    } );
    let testClient  = new TestClient3( requestMock );

    // Act
    let result = testClient.getItems();

    // Assert
    assert.equal( testClient.interceptorCallCount, 1 );

  } );
} );

class HttpMock extends HttpClient {

  public callCount: number = 0;
  public lastRequest: HttpRequest<any>;

  constructor( private requestFunction: ( req: HttpRequest<any> ) => Observable<HttpResponse<any>> ) {
    super(null);
  }

  request<R>(req: HttpRequest<any>|any, p2?:any, p3?:any, p4?:any): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }

}

class TestClient1 extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClient2 extends RestClient {

  public interceptorCallCount: number = 0;
  public interceptorRequest: HttpRequest<any>;

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  protected requestInterceptor( req: HttpRequest<any> ): void {
    this.interceptorCallCount++;
    this.interceptorRequest = req;
  }

}

class TestClient3 extends RestClient {

  public interceptorCallCount: number = 0;
  public interceptorResponse: Observable<any>;

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
  public getItems(): Observable<Response> {
    return null;
  }

  protected responseInterceptor( res: Observable<HttpResponse<any>> ): Observable<any> {
    this.interceptorCallCount++;
    this.interceptorResponse = res;
    return res;
  }

}
