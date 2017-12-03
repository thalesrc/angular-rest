import { assert } from 'chai';
import { Observable } from 'rxjs';
import { HttpRequest, HttpResponse, HttpClient, HttpHandler } from '@angular/common/http';
import { Client } from './client';
import { RestClient } from '../rest-client';
import { Get } from './request-methods';
import { Headers } from './headers';

describe( '@Headers', () => {

  it( 'verify decorator attributes are set', () => {
    // Arrange
    let headers: {
      [name: string]: any;
    };
    let requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      headers = req.headers;
      return Observable.of( new HttpResponse<any>( { status: 200 } ) );
    } );
    let testClient  = new TestClient( requestMock );

    // Act
    testClient.getItems();

    // Assert
    assert.deepEqual(headers.get("accept"), "application/json");
    assert.deepEqual(headers.get("lang"), 'en,nl');

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

class TestClient extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }
  @Get( '/test' )
  @Headers( {
    'accept': 'application/json',
    'lang': [ 'en', 'nl' ]
  } )
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

}
