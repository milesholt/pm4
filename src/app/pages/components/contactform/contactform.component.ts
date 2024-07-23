import { EventEmitter, Component, Input, Output, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';

@Component({
  //standalone: true,
  selector: 'app-contactform-comp',
  templateUrl: './contactform.component.html',
  styleUrls: ['./contactform.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class ContactFormComponent implements OnInit {
  defaultForm: any = {
    action: 'submitcontact',
    classes: 'nocol',
    fields: [
      {
        key: 'name',
        name: 'Name',
        placeholder: 'Enter your name',
        value: '',
        type: 'text',
        classes: 'nocol',
        required: true,
        autocomplete: true,
        prefix: '',
        suffix: '',
      },
      {
        key: 'email',
        name: 'Email',
        placeholder: 'Enter your email',
        value: '',
        type: 'email',
        classes: 'nocol',
        required: true,
        autocomplete: true,
        prefix: '',
        suffix: '',
      },
      {
        key: 'phone',
        name: 'Phone',
        placeholder: 'Enter your contact no. (optional)',
        value: '',
        type: 'text',
        classes: 'nocol',
        required: false,
        autocomplete: true,
        prefix: '',
        suffix: '',
      },
      {
        key: 'subject',
        name: 'Subject',
        placeholder: 'Select an option',
        value: 'general',
        type: 'select',
        classes: 'nocol',
        required: false,
        autocomplete: true,
        prefix: '',
        suffix: '',
        options: [
          {
            value: 'general',
            label: 'I have a general enquiry',
            sublist: false,
          },
          {
            value: 'help',
            label: 'I need a help with a product',
            sublist: false,
          },
          {
            value: 'business',
            label: 'I have a business enquiry',
            sublist: false,
          },
        ],
      },
      {
        key: 'message',
        name: 'Message',
        placeholder: 'Enter your message',
        value: '',
        type: 'textarea',
        classes: 'nocol',
        required: true,
        autocomplete: true,
        prefix: '',
        suffix: '',
        counter: true,
        maxlength: 500,
        autogrow: true,
      },
      {
        key: 'submit',
        name: 'Send',
        placeholder: '',
        value: '',
        type: 'submit',
        classes: 'nocol',
        required: false,
        autocomplete: false,
        prefix: '',
        suffix: '',
      },
    ],
  };

  @Input() el: any = false;
  @Output() callback = new EventEmitter();

  form: any = {};
  sent: boolean | null = null;
  data: any;
  url: string = window.location.href;
  canSubmit: boolean = false;

  //constructor(public lib: Library,private http: HttpClient){}

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    //private http: HttpClient,
  ) {}

  ngOnInit() {
    if (this.el === false) this.el = this.defaultForm;
  }

  ngAfterContentInit() {
    this.url = window.location.href;
  }

  /* Callback */

  doCallback() {
    //this.callback.emit({'a':a,'p':p});
  }

  /* Contact functions  */

  onSubmit(action: any = false, event: any = false) {
    console.log('submitting contact form');
    let target = this.lib.getTarget(event);
    let nofields = target.elements.length - 1;

    // console.log('no of fields');
    // console.log(nofields);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    let creds = this.form;
    creds.action = action;
    let pass = true;
    let msg = 'Please complete the required fields';
    //let required = ['name', 'firstname','surname','email','email2','address','postcode','phone', 'propertyno'];
    let params = {};
    var em: string = '';

    //console.log(target.elements);

    switch (action) {
      case 'submitcontact':
        for (let i = 0, len = nofields; i < nofields; i++) {
          let el = target.elements[i];
          let field = el.name;
          creds[field] = el.value;

          if (el.required) {
            if (creds[field] == '' || creds[field] == 'undefined') {
              //typed but then cleared, so appended to form but value is blank
              console.log(el.name);
              pass = false;
            }

            //Make sure message is not empty
            if (el.name.toLowerCase() == 'message' && el.value.length == 0) {
              alert('Message cannot be empty');
              pass = false;
              return false;
            }

            if (el.value == '') {
              alert('Required fields cannot be blank');
              pass = false;
              return false;
            }
          }

          if (el.value !== '') {
            let verified = this.verify(el.value, el.name);
            if (!verified) {
              alert('Incorrect format. Please verify your ' + el.name);
              return false;
            }
          }
        }
        let url = window.location.pathname.split('/');
        let last = url.length - 1;
        let hash = window.location.hash;
        creds['campaign'] = url[last];
        let mailpath = 'assets/mail/mailer.php';

        if (!pass) {
          console.log('pass is false');
          alert(msg);
          return false;
        }

        /*new Promise((resolve) => {
          this.service.http.
            .post('assets/mail/' + mailpath, creds, httpOptions)
            .subscribe(
              (res) => {
                console.log(res);
                this.data = res;
                resolve(this.data);
                this.sent = 'true';
                console.log(this.data);
              },
              (err) => this.responseFail(err),
              () => console.log('Post request complete'),
            );
        });*/

        this.service.http.post(mailpath, creds).subscribe(
          (res: any) => {
            console.log('Response:', res);
            this.data = res;
            this.sent = true;
          },
          (error: any) => {
            console.error('Error:', error);
          },
        );

        params = { alias: 'contact', action: 'contactform', event: event };
        this.emit(params);

        return this.sent;
        break;
      default:
        return true;
        break;
    }
  }

  doForm(e: any = '', k: any = false) {
    e = typeof e === 'string' ? e : e.target.value;
    if (k !== 'message') e = e.trim();
    if (k == 'email' || k == 'email2') e = e.toLowerCase();
    if (k == 'postcode') e = e.trim().toUpperCase();
    if (!!k) this.form[k] = e;
    // console.log(this.form);
  }

  emit(params: any) {
    this.callback.emit(params);
  }

  verify(input: any, validation: any) {
    let v: any;
    let validations = ['name', 'phone', 'email', 'postcode'];
    let check: string = '';
    //check input needs to be validated by matching the key with any of the validations
    validations.forEach((v) => {
      if (validation.toLowerCase().indexOf(v) !== -1) check = v;
    });
    if (check !== '') {
      switch (check) {
        case 'name':
          v = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/;
          break;
        case 'phone':
          v =
            /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
          break;
        case 'email':
          v =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          break;
        case 'postcode':
          v =
            /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/;
          break;
      }
      return v.test(input);
    } else {
      return true;
    }
  }

  responseFail(err: any) {
    this.sent = false;
    console.log(err);
  }

  handleCorrectCaptcha(e: any) {
    this.canSubmit = true;
    //console.log(e);
  }
}
