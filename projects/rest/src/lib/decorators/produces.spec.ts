import { Observable, of } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from '../rest-client';
import { Get } from './request-methods';
import { Produces, MediaType } from './produces';

describe( '@Produces', () => {

  it( 'verify Produces function is called', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      const json: any = { name: 'itemName', desc: 'Some awesome item' };
      return of( new HttpResponse<any>( { body: json } ) );
    } );
    const testClient  = new TestClient( requestMock );

    // Act
    const result = testClient.getItems();

    // Assert
    result.subscribe( item => {
      try {
        expect( item[ 'name' ]).toBe('itemName' );
        expect( item[ 'desc' ]).toBe('Some awesome item' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
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
  @Produces( MediaType.JSON )
  public getItems(): Observable<{}> {
    return null;
  }

}
