import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  providers: [CoreService, Library]
})
export class VerifyEmailComponent  implements OnInit {

  constructor(
    public service: CoreService,
    public library: Library
  ) { }

  ngOnInit() {}

}
