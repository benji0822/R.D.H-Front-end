import { Component } from '@angular/core';
import { GeneralModule } from '../../modules/general/general.module';

@Component({
  selector: 'app-unauthorized',
  imports: [GeneralModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

}
