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
    a.login({email: 'dsa@dsa.com', password: '1234'}, 'Bearer Ali Sahin', 'dsadsadsa', '1234', 'anahtar')
      .then(console.log).catch(console.warn);
  }
}
