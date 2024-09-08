import {
  EventEmitter,
  Component,
  Input,
  Output,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../components/modal/modal.component';

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
  selector: 'app-form-comp',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class FormComponent implements OnInit, AfterViewInit {
  newOption: any = { label: '' };

  isModal: boolean = false;

  fields: FormGroup;

  @Input() params: any = {
    to: '',
    replyto: '',
    settings: {
      form: {
        action: 'returnform',
        classes: 'nocol',
        fields: [
          {
            key: 'to',
            name: 'To',
            value: this.service.auth.getUser().email ?? '',
            type: 'text',
            placeholder: 'Enter your recipient address',
          },
          {
            key: 'replyto',
            name: 'Reply-To',
            value: '',
            type: 'text',
            placeholder: 'Enter your reply-to address (optional)',
          },
        ],
      },
    },
  };

  @Input() el: any = {
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
        options: [],
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
        options: [],
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
        options: [],
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
        options: [],
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
        options: [],
      },
    ],
  };
  @Output() callback = new EventEmitter();

  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;
  @ViewChild('formTemplate') formTemplate!: TemplateRef<any>;
  @ViewChild('formEditTemplate') formEditTemplate!: TemplateRef<any>;

  @ViewChild('selectOptionRef') selectOptionRef: any;

  form: any = {};
  sent: boolean | null = null;
  data: any;
  url: string = window.location.href;
  canSubmit: boolean = false;

  isEditField: boolean = false;
  isEditForm: boolean = false;
  editFieldIdx: number = 0;

  fieldTypes: any = [
    { key: 'text', label: 'Text Field' },
    { key: 'select', label: 'Dropdown Field' },
    { key: 'radio', label: 'Radio Buttons' },
    { key: 'date', label: 'Date' },
    { key: 'textarea', label: 'Text Area' },
    { key: 'checkbox', label: 'Checkbox' },
    { key: 'email', label: 'Email Address' },
    { key: 'tel', label: 'Telephone' },
    { key: 'time', label: 'Time' },
    { key: 'number', label: 'Number' },
    { key: 'submit', label: 'Submit' },
  ];

  filteredOptions: any[] = [];
  //constructor(public lib: Library,private http: HttpClient){}

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library, //private http: HttpClient,
    public cdr: ChangeDetectorRef,
    private modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.fields = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      key: ['', Validators.required],
      placeholder: [''],
      suffix: [''],
      prefix: [''],
      type: ['text'],
      value: [''],
      classes: [''],
      options: this.fb.array([
        this.fb.group({ label: ['One option required'] }),
      ]),
      required: [''],
      autocomplete: [''],
      autgrow: [''],
      counter: [''],
      maxlength: [''],
    });

    console.log('this fields');
    console.log(this.fields);
  }

  ngOnInit() {}

  ngAfterContentInit() {
    this.url = window.location.href;
  }

  ngAfterViewChecked() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.doCheck();
    });
  }
  
  
  
  test(){
    console.log('test');
  }

  doCheck() {
    console.log('doing form check');

    let hasSubmitButton = this.el.fields.some(
      (field: any) => field.type === 'submit'
    );

    console.log(hasSubmitButton);

    if (!hasSubmitButton) {
      const submitField = {
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
      };

      this.el.fields.push(submitField);

      this.cdr.detectChanges();

      //this.el.fields.push(test);

      console.log(this.el);
    }
  }

  /* Callback */

  doCallback() {
    //this.callback.emit({'a':a,'p':p});
  }

  /* Contact functions  */

  onSubmit(action: any = false, event: any = false) {
    console.log('submitting form');
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

        if (this.params.hasOwnProperty('to')) creds.to = this.params.to;
        if (this.params.hasOwnProperty('replyto'))
          creds.replyto = this.params.replyto;

        this.service.http.post(mailpath, creds).subscribe(
          (res: any) => {
            console.log('Response:', res);
            this.data = res;
            this.sent = true;
          },
          (error: any) => {
            console.error('Error:', error);
          }
        );

        params = { alias: 'contact', action: 'contactform', event: event };
        this.emit(params);

        return this.sent;
        break;
      case 'returnform':
        console.log('returnform');

        let f = this.el.fields;

        for (let i = 0, len = nofields; i < nofields; i++) {
          let el = target.elements[i];
          console.log(el.value);
          f[i].value = el.value;
        }

        console.log(this.el);

        params = { action: 'returnform', data: this.el, event: event };
        console.log(params);
        this.emit(params);
        return this.form;

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

  async editForm() {
    this.isEditForm = true;
    const result = await this.service.modal.openModal(
      this.formEditTemplate,
      this.el.fields
    );

    if (result) {
      console.log('Modal dismissed with data:', result);
      this.closeEditForm(result); // Call a function to handle the result
    }
  }

  closeEditForm(data: any) {
    this.isEditForm = false;
  }

  loadKeys(field: any) {
    let keys = this.lib
      .objKeys(field)
      .filter((key: any) => !['classes'].includes(key))
      .filter((key: any) =>
        field.type == 'checkbox' ? !['value'].includes(key) : key
      );
    return keys;
  }

  async onPropChange(
    event: any,
    key: string,
    value: string,
    field: any,
    idx: number
  ) {
    //change key property depending on Name property
    if (key == 'name') {
      let nameValue = this.fields.get('name')?.value || '';
      nameValue = nameValue.replace(/[^a-zA-Z0-9 ]/g, '');
      let keyValue = await this.generateKey(nameValue, field);

      this.fields.get('key')?.setValue(keyValue);
      this.fields.get('name')?.setValue(nameValue);
    }
    if (key == 'value') {
      const inputValue = event.target.value.toLowerCase();

      // Filter options based on user input
      this.filteredOptions = field.options.filter((option: any) =>
        option.label.toLowerCase().includes(inputValue)
      );

      // Set the custom input value to the form control
      this.fields.get('value')?.setValue(inputValue);
    }
    if (key == 'type') {
      console.log(event.target.value);
      if (
        this.el.fields.some((obj: any) => obj.type === 'submit') &&
        event.target.value == 'submit'
      ) {
        alert('You cannot add more than one submit field');
        this.fields.get('type')?.setValue('text');
      }
      field.type = event.target.value;
      console.log('type changed');
      console.log(field);
      if (field.options.length == 0) {
        console.log('no options');
        field.options = this.fields.get('options')?.value;
        console.log(this.fields);
      }
      if (!field.hasOwnProperty('options') || field.options.length == 0)
        field.options = this.fields.get('options')?.value;
    }
    return true;
  }

  async generateKey(name: string, field: any) {
    // If the Name is blank, use 'customfield' with an index
    if (!name.trim()) {
      return await this.generateUniqueKey('customfield', field);
    }

    // Generate the key based on the Name value, converting it to lowercaseS
    let baseKey = name.trim().toLowerCase().replace(/\s+/g, '');

    // Generate a unique key by checking for duplicates
    return await this.generateUniqueKey(baseKey, field);
  }

  async generateUniqueKey(baseKey: string, field: any) {
    let uniqueKey = baseKey;
    let index = 1;

    const existingKeys = Object.keys(field);

    // Ensure the key is unique by checking the list of existing keys
    while (existingKeys.includes(uniqueKey)) {
      uniqueKey = `${baseKey}${index}`;
      index++;
    }

    // Add the generated key to the existing keys
    //existingKeys.push(uniqueKey);

    return uniqueKey;
  }

  copyField(field: any, idx: number) {
    console.log('copy field');
    const copy = this.lib.deepCopy(field);
    this.el.fields.splice(idx, 0, copy);
  }

  deleteField(field: any, idx: number) {
    console.log(this.el);
    this.el.fields.splice(idx, 1);
  }

  async editField(field: any, idx: number) {
    this.isEditField = true;
    this.editFieldIdx = idx;

    this.generateFieldsForm(field);

    const result = await this.service.modal.openModal(
      this.modalTemplate,
      field
    );

    if (result) {
      //update field
      this.el.fields[idx] = this.lib.mergeObjects(field, this.fields.value);
    }
  }

  generateFieldsForm(formData: any) {
    const formGroup: any = {};

    // Loop through the default form controls
    Object.keys(this.fields.controls).forEach((key) => {
      const control = this.fields.get(key); // Get the current form control
      const defaultValue = control?.value;
      const validators = control?.validator ? [control.validator] : []; // Get existing validators
      const formDataValue = formData[key];

      // Check if the formDataValue is non-empty (using your helper function `isNotEmpty`)
      if (this.lib.isNotEmpty(formDataValue)) {
        formGroup[key] = new FormControl(formDataValue, validators);
      } else {
        formGroup[key] = new FormControl(defaultValue, validators);
      }

      // Special handling for arrays or nested objects if needed
      if (Array.isArray(formDataValue)) {
        if (formDataValue.length > 0) {
          formGroup[key] = this.fb.array(
            formDataValue.map((item) => this.fb.group(item))
          );
        }
      } else if (typeof formDataValue === 'object' && formDataValue !== null) {
        formGroup[key] = this.fb.group(formDataValue);
      }
    });

    // Assign the dynamically generated form group to the form
    this.fields = this.fb.group(formGroup);
    console.log('field form built');
    console.log(this.fields);
  }

  addField() {
    const newField = {
      key: 'customfield-' + this.el.fields.length,
      name: 'Enter field Name',
      placeholder: 'Enter placeholder text',
      value: '',
      type: 'text',
      classes: '',
      options: [],
      required: false,
      autocomplete: false,
      prefix: '',
      suffix: '',
    };

    this.el.fields.push(newField);
    this.isEditField = true;

    console.log(this.modalTemplate);

    this.service.modal.openModal(this.modalTemplate, newField);
    return true;
  }

  moveFieldUp(index: number) {
    //define rows
    const rows = this.el.fields;
    if (index > 0) {
      [rows[index - 1], rows[index]] = [rows[index], rows[index - 1]];
    }
  }

  moveFieldDown(index: number) {
    const rows = this.el.fields;
    if (index < rows.length - 1) {
      [rows[index + 1], rows[index]] = [rows[index], rows[index + 1]];
    }
  }
  
  
  reorderFields(event:any){
    const movedItem = this.el.fields.splice(event.detail.from, 1)[0]; // Remove the item
  this.el.fields.splice(event.detail.to, 0, movedItem); // Insert it at the new position
  event.detail.complete(); 
  }

  addOption(options: any) {
    if (this.newOption.label.trim()) {
      options.push(this.lib.deepCopy(this.newOption));
      this.newOption.label = ''; // clear the input after adding
    }
  }

  removeOption(index: number, options: any) {
    options.splice(index, 1);
  }

  editOption(index: number, options: any) {
    this.newOption.label = options[index].label;
    this.removeOption(index, options); // Remove the item so it can be edited in the input
  }

  // Select an option from the filtered list
  selectOption(event: any, field: any, idx: number) {
    const option = event.target.value;
    field.value = option;
    this.fields.get('value')?.setValue(option);
    this.filteredOptions = []; // Clear the filtered options list
  }

  openSelect() {
    this.selectOptionRef.open();
  }
}
