import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-feed-comp',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class FeedComponent implements OnInit {
  @Input() feedData: any;
  @Output() callback = new EventEmitter();

  pagindex: number = 0;
  pagination: any = [];
  filteredpages: any = [];
  sortedpages: any = [];
  maxresults: number = 5;
  feedDisplay: boolean = false;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    private route: ActivatedRoute,
    public lib: Library,
  ) {}

  ngOnInit() {}

  ngAfterContentInit() {
    //this.createTags();
    //this.getFilteredPages();
  }

  /*setPagIndex(idx){
    this.pagindex = idx;
  }

  navPag(dir){
    let d = this.pagination; var sid = this.pagindex;
    dir ? sid < (d.length-1) ? this.pagindex++ : sid : sid > 0 ? this.pagindex-- : sid;
  }

  doPagination(l = this.filteredpages){
    //console.log(l);
    let i = 0;let section = []; let p = [];
    setTimeout(()=>{
      l.forEach(page=>{
       if(page.value.group == this.el.dataset.trim()){
         section.push(page);
          if(l.length <= this.maxresults){
             p[0]=section;
          }else{
            if(i == (l.length - 1)){
                  p.push(section);
            } else {
              if(i % this.maxresults == 0 && i !== 0){
                  p.push(section);
                  section = [];
              }
            }
          }
          i++;
        }
      });
      //console.log(p);
      this.pagination = this.lib.deepCopy(p);
      this.feedDisplay = true;
    },);
  }*/
}
