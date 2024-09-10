import { Input, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-nav',
  templateUrl: './embed.brandbuilder.component.html',
  styleUrls: ['./embed.brandbuilder.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class EmbedComponent implements OnInit {
  
  public embedHtml: SafeHtml = '';
  
  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private sanitizer: DomSanitizer,
  ) {}
  
    @Input() params: any = {
    type: 'default',
    code: '',
    width: '100%',
    height: '100%',
    settings: {
      form: {
        action: 'returnform',
        classes: 'nocol',
        fields: [
          {
            key: 'code',
            name: 'Code',
            value: '',
            type: 'text',
            placeholder: 'Enter your embeded code here',
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
  

  async ngOnInit() {
    // Wait for the API to be ready
    if (this.params == null) return;

    console.log('ngoninit: embed');
    
    await this.doForm();

    console.log(this.params);


    switch (this.params.type) {
      case 'default':
        break;
    }
    
    this.doEmbed();
  }
  
  
  doForm(){
    //Handle any input values from form
    this.params.settings.form.fields.forEach((field:any) => {
      if(this.params.hasOwnProperty(field.key)) this.params[field.key] = field.value;
    });
  }
  
  doEmbed(){
   const embedCode = this.params.code;
    const width = this.params.width;
    const height = this.params.height;

    // Sanitize and generate the embed HTML
    this.embedHtml = this.sanitizer.bypassSecurityTrustHtml(`
      <div style="width: ${width}; height: ${height};">
        ${embedCode}
      </div>
    `);
  }
}
