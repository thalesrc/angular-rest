import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'playground';

  constructor(a: AppService) {
    a.login('heyoo', 'hello').then(console.log).catch(console.warn);
  }
}
