import { assert } from 'chai';
import { Observable } from 'rxjs';
import { HttpClient, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from '../rest-client';
import { Get } from './request-methods';
import { Map } from './map';

describe( '@Map', () => {

  it( 'verify Map function is called', ( done: ( e?: any ) => void ) => {
    // Arrange
    let requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      let json: any = { name: 'itemName', desc: 'Some awesome item' };
      return Observable.of( new HttpResponse<any>( { body: JSON.stringify( json ) } ) );
    } );
    let testClient  = new TestClient( requestMock );

    // Act
    let result = testClient.getItems();

    // Assert
    result.subscribe( item => {
      try {
        assert.equal( item.name, 'itemName' );
        assert.equal( item.desc, 'Some awesome item' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
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
  @Map( resp => new Item( JSON.parse(resp.body) ) )
  public getItems(): Observable<Item> {
    return null;
  }

}

class Item {

  public name: string;
  public desc: string;

  constructor( props: { name: string, desc: string } ) {
    this.name = props.name;
    this.desc = props.desc;
  }
}
