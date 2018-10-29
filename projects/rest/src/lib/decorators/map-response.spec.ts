import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RestClient } from '../rest-client';
import { Get } from './request-methods';
import { MapResponse } from './map-response';
import { Mapper } from './mapper';

describe('@MapResponse', () => {
  it('should run properly', done => {
    const testClient = new TestClient(new HttpMock(null));

    testClient.getItems().subscribe(res => {
      expect(res).toBe('yepp');
      done();
    });
  });
});

class HttpMock extends HttpClient {
  request<R>(req: HttpRequest<any>|any, p2?: any, p3?: any, p4?: any): Observable<any> {
    return of(new HttpResponse({body: {a: 1, b: 2}, status: 200}));
  }
}

class TestClient extends RestClient {
  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Mapper()
  private responseMapper(res: any) {
    return 'yepp';
  }

  @Get( '/test' )
  @MapResponse(
    resp => resp,
    TestClient.prototype.responseMapper
  )
  public getItems(): Observable<any> {
    return null;
  }
}
