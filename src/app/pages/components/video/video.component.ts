import { Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

declare var YT: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  providers: [CoreService, Library],
})
export class VideoComponent implements OnInit, OnDestroy {
  private player: any;

  //@Input() videoid: string | boolean = false;

  @Input() params: any = {
    type: 'youtube',
    videoid: '',
    width: '100%',
    height: '100%',
    settings: {
      form: {
        action: 'returnform',
        classes: 'nocol',
        fields: [
          {
            key: 'videoid',
            name: 'Video ID',
            value: '',
            type: 'text',
            placeholder: 'Enter your Video ID',
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
        ],
      },
    },
  };

  constructor(
    private el: ElementRef,
    public lib: Library,
    public service: CoreService
  ) {}

  async ngOnInit() {
    // Wait for the API to be ready
    if (this.params == null) return;

    console.log('ngoninit: video');
    
    await this.doForm();

    console.log(this.params);


    switch (this.params.type) {
      case 'youtube':
        this.doYoutube();
        break;
    }
  }

  doForm(){
    //Handle any input values from form
    this.params.settings.form.fields.forEach((field:any) => {
      if(this.params.hasOwnProperty(field.key)) this.params[field.key] = field.value;
    });
  }

  doYoutube() {
    if ((window as any)['YT']) {
      this.loadPlayer();
    } else {
      (window as any)['onYouTubeIframeAPIReady'] = () => this.loadPlayer();
    }
  }

  loadPlayer(): void {
    this.player = new YT.Player(
      this.el.nativeElement.querySelector('#youtube-player'),
      {
        height: this.params.height,
        width: this.params.width,
        videoId: this.params.videoid, // Replace with dynamic video ID if needed
        events: {
          onReady: this.onPlayerReady,
        },
      }
    );
  }

  onPlayerReady(event: any): void {
    // You can add additional functionality here
    event.target.playVideo();
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.destroy();
    }
  }
}
