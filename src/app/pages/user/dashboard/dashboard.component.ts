import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent  implements OnInit {

  constructor(
    public service: CoreService
  ) { }

  ngOnInit() {}

}
