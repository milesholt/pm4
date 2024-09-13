import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [CoreService, Library]
})
export class ForgotPasswordComponent  implements OnInit {

  constructor(
    public service: CoreService,
    public library: Library
  ) { }

  ngOnInit() {}

}
