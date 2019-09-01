import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';

import { AppComponent } from './app.component';
import { RestModule, HeadersInjector, BASE_HEADERS } from '@rest';
import { AppService } from './app.service';

@Injectable()
export class HeaderParser extends HeadersInjector {
  inject() {
    return {injected: ['a', 'b']};
  }
}

@Injectable()
export class HeaderParserAli extends HeadersInjector {
  inject() {
    return {ali: 'sahin'};
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RestModule.forRoot({baseUrl: '', baseHeaders: [{'in-root': 'yep it works'}]})
  ],
  providers: [
    AppService,
    {provide: BASE_HEADERS, useValue: [HeaderParser, {'ali': 'sahin'}], multi: true},
    HeaderParser,
    HeaderParserAli
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
