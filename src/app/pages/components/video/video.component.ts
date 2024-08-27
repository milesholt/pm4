import { Component, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';

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

  @Input() videoid: string | boolean = false;

  constructor(
    private el: ElementRef,
    public lib: Library,
    public service: CoreService
  ) {}

  ngOnInit(): void {
    // Wait for the API to be ready
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
        height: '100%',
        width: '100%',
        videoId: this.videoid, // Replace with dynamic video ID if needed
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
