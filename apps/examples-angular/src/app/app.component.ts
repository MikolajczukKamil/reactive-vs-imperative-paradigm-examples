import { Component }          from '@angular/core';
import { MatTabsModule }      from '@angular/material/tabs'

import { ListWithFiltersComponent } from './list-with-filters'

@Component({
  standalone: true,
  imports: [ MatTabsModule, ListWithFiltersComponent ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
