import { Component }   from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  imports: [ FormsModule ]
})
export class AppComponent {
  value = '';
}
