import { Component }          from '@angular/core';
import { MatTabsModule }      from '@angular/material/tabs'

@Component({
  standalone: true,
  imports: [ MatTabsModule ],
  selector: 'reactive-vs-imperative-paradigm-examples-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
