import { Component } from '@angular/core';
import { AppService } from './app.service';
import { BASE_URL } from 'projects/rest/src/lib/base-url.token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'playground';

  constructor(a: AppService) {
    a.login().then(console.log).catch(console.warn);
  }
}
