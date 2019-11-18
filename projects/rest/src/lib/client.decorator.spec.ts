import { Client } from './client.decorator';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RestModule } from './rest.module';

describe('Client Decorator', () => {
  it('should be defined', () => {
    expect(Client).toBeTruthy();
  });

  // it('should mark the class as an injectable', () => {
  //   @Client()
  //   class RestClient {
  //     prop = 'a';
  //   }

  //   @Component({
  //     selector: 'rest-a',
  //     template: 'Hello World'
  //   })
  //   class Comp {
  //     constructor(public rs: RestClient) {
  //     }
  //   }

  //   TestBed.configureTestingModule({
  //     imports: [RestModule],
  //     providers: [RestClient],
  //     declarations: [Comp]
  //   });

  //   const fix = TestBed.createComponent(Comp);

  //   expect(fix.componentInstance.rs).toBeDefined();
  //   expect(fix.componentInstance.rs.prop).toBe('a');
  // });
});
