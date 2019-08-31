import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';

import { AppComponent } from './app.component';
import { RestModule, HeadersInjector, BASE_HEADERS } from '@rest';
import { AppService } from './app.service';

@Injectable()
class HeaderParser extends HeadersInjector {
  inject() {
    return {injected: ['a', 'b']};
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RestModule.forRoot({baseUrl: '', baseHeaders: [{'ali': 'sahin'}]})
  ],
  providers: [
    AppService,
    {provide: BASE_HEADERS, useValue: [HeaderParser], multi: true},
    HeaderParser
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
