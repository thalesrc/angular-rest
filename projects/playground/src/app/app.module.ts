import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';

import { AppComponent } from './app.component';
import { RestModule, HeadersInjector, BASE_HEADERS, BASE_WITH_CREDENTIALS } from '@rest';
import { AppService, AGuard } from './app.service';
import { TestComponent } from './test/test.component';

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
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    RestModule
  ],
  providers: [
    AppService,
    {provide: BASE_HEADERS, useValue: [HeaderParser, {'ali': 'sahin'}], multi: true},
    { provide: BASE_WITH_CREDENTIALS, useValue: true },
    HeaderParser,
    HeaderParserAli,
    AGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
