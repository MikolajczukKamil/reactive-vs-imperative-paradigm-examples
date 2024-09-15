import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { MatButtonModule }                    from '@angular/material/button';
import { MatCardModule }                      from '@angular/material/card';
import { MatIconModule }                      from '@angular/material/icon';
import { MatInputModule }                     from '@angular/material/input';
import { MatPaginator }                       from '@angular/material/paginator';
import { MatProgressBarModule }               from '@angular/material/progress-bar';
import { MatSelectModule }                    from '@angular/material/select';
import { MatSortModule }                      from '@angular/material/sort';
import { MatTableModule }                     from '@angular/material/table';


@Component({
  standalone: true,
  selector: 'app-list-with-filters',
  templateUrl: './list-with-filters.component.html',
  styleUrls: [ './list-with-filters.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressBarModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatSortModule,
    MatButtonModule,
    MatPaginator
  ]
})
export class ListWithFiltersComponent {}
