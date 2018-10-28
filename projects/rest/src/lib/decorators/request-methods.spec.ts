import { assert } from 'chai';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from '../rest-client';
import { Get, Post, RequestMethod } from './request-methods';

describe( '@Get', () => {

  it( 'verify request method is set', () => {
    // Arrange
    let method;
    let url;
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      method = req.method;
      url    = req.url;
      return of( new HttpResponse<any>() );
    } );
    const testClient  = new TestClient( requestMock );

    // Act
    testClient.getItems();

    assert.equal( method, RequestMethod.GET );
    assert.equal( url, '/test' );
  } );
} );

describe( '@Post', () => {

  it( 'verify request method is set', () => {
    // Arrange
    let method;
    let url;
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      method = req.method;
      url    = req.url;
      return of( new HttpResponse<any>() );
    } );
    const testClient  = new TestClient( requestMock );

    // Act
    testClient.createItems();

    assert.equal( method, RequestMethod.POST );
    assert.equal( url, '/test' );
  } );
} );

class HttpMock extends HttpClient {

  public callCount = 0;
  public lastRequest: HttpRequest<any>;

  constructor( private requestFunction: ( req: HttpRequest<any> ) => Observable<HttpResponse<any>> ) {
    super(null);
  }

  request<R>(req: HttpRequest<any>|any, p2?: any, p3?: any, p4?: any): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }

}

class TestClient extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  @Post( '/test' )
  public createItems(): Observable<HttpResponse<any>> {
    return null;
  }

}
