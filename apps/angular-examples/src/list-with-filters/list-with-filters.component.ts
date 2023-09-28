import { AsyncPipe, NgIf }      from '@angular/common'
import { Component, inject }    from '@angular/core'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTableModule }       from '@angular/material/table'

import { Etf, EtfService } from './etfs'


@Component({
  standalone: true,
  imports: [
    MatTableModule,
    AsyncPipe,
    NgIf,
    MatProgressBarModule,
  ],
  selector: 'list-with-filters',
  templateUrl: './list-with-filters.component.html',
  styleUrls: [ './list-with-filters.component.scss' ],
})
export class ListWithFiltersComponent {
  private readonly etfs = inject(EtfService)
  
  protected readonly dataSource$ = this.etfs.getEtfList(1, 25, {})
  protected readonly displayedColumns = [ 'name', 'price', 'currency' ]
  
  element(el: unknown): Etf {
    return el as Etf;
  }
}
