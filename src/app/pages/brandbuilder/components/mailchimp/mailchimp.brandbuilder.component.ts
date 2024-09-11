import { Input, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-mailchimp-comp',
  templateUrl: './mailchimp.brandbuilder.component.html',
  styleUrls: ['./mailchimp.brandbuilder.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class MailchimpComponent implements OnInit {
  
  @Input() params: any = {
    type: 'default',
    heading: '',
    userid: '',
    listid: '',
    settings: {
      form: {
        action: 'returnform',
        classes: 'nocol',
        fields: [
          {
            key: 'heading',
            name: 'Heading',
            value: 'Subscribe to our mailing list',
            type: 'text',
            placeholder: 'Enter a heading or leave blank',
          },
          {
            key: 'userid',
            name: 'User ID',
            value: '',
            type: 'text',
            placeholder: 'Enter your account User ID',
          },
          {
            key: 'listid',
            name: 'List ID',
            value: '',
            type: 'text',
            placeholder: 'Enter your Mailing List ID',
          },
          {
            key: 'width',
            name: 'Width',
            value: '100%',
            type: 'text',
            placeholder: 'Enter width (eg. 100%)',
          },
          {
            key: 'height',
            name: 'Height',
            value: '100%',
            type: 'text',
            placeholder: 'Enter height (eg. auto)',
          },
          {
            key: 'submit',
            name: 'Apply',
            type: 'submit',
            
          },
        ],
      },
    },
  };
  
  public html: SafeHtml = '';
  
  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private sanitizer: DomSanitizer,
  ) {}
  
  

  async ngOnInit() {
    // Wait for the API to be ready
    if (this.params == null) return;

    console.log('ngoninit: mailchimp');
    
    await this.doForm();

    console.log(this.params);


    switch (this.params.type) {
      case 'default':
        break;
    }
    
    //this.doMailchimp();
  
  }
  
  
  doForm(){
    //Handle any input values from form
    this.params.settings.form.fields.forEach((field:any) => {
      if(this.params.hasOwnProperty(field.key)) this.params[field.key] = field.value;
    });
  }
  
  doMailchimp(){
   const listid= this.params.listid;
    const email = this.params.email;

    // Sanitize and generate the embed HTML
    this.html = this.sanitizer.bypassSecurityTrustHtml(`
      <div style="width: ${width}; height: ${height};">
        ${embedCode}
      </div>
    `);
  }
}
