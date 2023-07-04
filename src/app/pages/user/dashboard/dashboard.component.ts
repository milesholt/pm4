import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../services/external/firebase/AuthService/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent  implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {}

}
