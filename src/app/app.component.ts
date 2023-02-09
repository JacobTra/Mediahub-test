import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public token$: Observable<string | null> = this.appServices.token$;

  constructor(public appServices: AppService) {}
}
