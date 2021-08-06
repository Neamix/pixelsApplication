import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LikeService } from 'src/app/Services/like.service';
import { ReadConfigService } from 'src/app/Services/read-config.service';
import { WriteService } from 'src/app/Services/write.service';


@Component({
  selector: 'app-musicplayer',
  templateUrl: './musicplayer.component.html',
  styleUrls: ['./musicplayer.component.css']
})
export class MusicplayerComponent implements OnInit {


  constructor(
    private read:ReadConfigService,
    private likeService: LikeService,
    private write:WriteService,
    private router:Router,
    private activeRouter:ActivatedRoute) {
    
   }

   path: any = 'https://drive.google.com/uc?export=download&id=';
   music = new Audio();
   interval: any;
   ps: any;
   perc: any;
   prop: boolean = false;
   playCounter: number = 0;
   playTarget: boolean = false;
   time: string = '00:00';
   curr: string = '00:00';
   loader: boolean = false;
   playImg: string = '';
   songTitle: string = '';
   band: string = '';
   trigger: boolean = false;
   vol: boolean = false;
   scope: any;
   isfav: boolean = false;
   private currentMusic: any = '';
   // 0 src.....
   // 1 Song name
   // 2 team name 
   // 3 song src
   payload: any[] = [];
   //progress bar control variable
   barwidth: any = 0;
   //volume bar control variable
   volwidth: any = 50;
   duration: string = '';
   playlist = 'none';
   playlistLocker = 0;
   shuffleLocker  = 0;
   playlistColor = true;
   shuffleColor  = true;
   isLikeProps :boolean=false;
   playingPlaylist = JSON.parse(localStorage.getItem('playingType') || '{}' ) ?? '' ;
   oldActive:any;

  
  load() {
    this.loader=true;
    this.music.src = this.path + this.payload[this.playCounter][0];
    this.currentMusic = this.path + this.payload[this.playCounter][0];
    this.playImg = this.payload[this.playCounter][3];
    this.songTitle = this.payload[this.playCounter][2];
    this.band = this.payload[this.playCounter][1];
    this.isLike();
    this.checkPlayCounter();
    this.playlistImgLooping(this.playImg);
    this.music.addEventListener('loadeddata', (): void => {
      this.loader = false;
      this.time = this.timeSet(this.music.duration);
    });
  }

  //toggle the interval
  int(intervalStart: boolean) {
    if (intervalStart) {
      this.interval = setInterval((): void => {
        this.curr = this.timeSet(this.music.currentTime);
        this.barwidth = (this.music.currentTime / this.music.duration) * 100 + '%';
      }, 1000);

    } else {
      clearInterval(this.interval);
    }
  }

  //return time formate (min:sec)
  timeSet(time: number) {
    let min: any = Math.floor(time / 60);
    let sec: any = Math.floor(time % 60);
    min = (min < 10) ? '0' + min : min;
    sec = (sec < 10) ? '0' + sec : sec;
    return min + ':' + sec;
  }

  //play and pause
  play() {
    if (this.music.src == "") {
      this.load();
    }
    if (this.music.paused) {
      this.playTarget = true;
      this.music.play();
      this.int(true);
    } else {
      this.playTarget = false;
      this.music.pause();
      this.int(false);
    }
  }

  //load a song and play it
  ready(counter: number) {
    this.music.pause;
    this.load();
    this.play();
  }

  //get the next song
  next() {
    this.playCounter++;
    if (this.playCounter > this.payload.length - 1) {
      this.playCounter = 0;
    }
    this.ready(this.playCounter);
  }

  //get the prev song
  prev() {
    this.playCounter--;
    if (this.playCounter < 0) {
      this.playCounter = this.payload.length - 1;
    }
    this.ready(this.playCounter);
  }

  //start draging progress bar
  drag(event: MouseEvent) {
    if (this.trigger) {
      let bar: any = document.querySelector('.progressBar');
      let spaceArea = bar.getBoundingClientRect().x;
      let mouseLocation = event.pageX;
      let initPoint = mouseLocation - spaceArea;
      let perc = initPoint / bar.clientWidth;
      let percAcc = (perc < 1 && perc > 0) ? perc : (perc < 0) ? 0 : 1;
      this.barwidth = percAcc * 100 + '%';
      this.music.currentTime = this.music.duration * percAcc;
    }

  }

  //start dragging volume bar
  volume(event: MouseEvent) {
    if (this.vol) {
      let bar: any = document.querySelector('#volpr');
      let spaceArea = bar.getBoundingClientRect().x;
      let mouseLocation = event.pageX;
      let initPoint = mouseLocation - spaceArea;
      let perc = initPoint / bar.clientWidth;
      let percAcc = (perc < 1 && perc > 0) ? perc : (perc < 0) ? 0 : 1;
      this.volwidth = percAcc * 100 + '%';
      this.music.volume = percAcc;
    }
  }

  //reset the player
  reset() {
    this.playCounter = 0;
    this.barwidth = 0;
    this.curr = '00:00';
    this.playTarget = false;
  }


  playlistInc() {
    this.playlistLocker = (this.playlistLocker == 1) ? 0 : 1;
    this.playlistColor  = (this.playlistColor == false) ? true : false;
  }

  shuffleInc() {
    this.shuffleLocker = (this.shuffleLocker == 1) ? 0 : 1;
    this.shuffleColor  = (this.shuffleColor == false) ? true : false;
  }

  playlistImgLooping(img:string) {
    this.write.playlistDisplayImg.next(img);
  }
  /*rania start*/

  ngOnInit(): void {
    this.write.payloadExport.next(this.payload);
    this.write.deleteFromList.subscribe((data) => {
      if(data !== null) {
         if(data.playlistID == this.playingPlaylist.id) {
            this.payload.splice(data.musicID,1);
         } 
      }
    })

    this.write.playlist.subscribe((data) => {
      if(data !== null) {
          this.payload = [];
          this.payload = data.playlist;
          this.playCounter = data.playCounter;
          (this.playCounter == this.oldActive) ? this.play() : this.ready(this.playCounter);
          this.oldActive = this.playCounter;
          console.log(this.oldActive,this.playCounter)
      }
   });
  
    this.read.musictrack.subscribe((data)=>{
      if(data){
        if(localStorage.getItem('playingType')) {
            localStorage.removeItem('playingType');
            this.payload = [];
        } 
        if(this.currentMusic==data[0]){
          this.play();
        } else {
          this.playCounter = this.payload.length;
          this.payload.push(data);
          this.ready(this.playCounter);
        }
        this.currentMusic = data[0];
      }
    });
    
    /*rania end*/
    this.music.volume = 0.5;
    let ball:any = document.getElementById('ball');
    console.log($());
    let ballVl: any = document.getElementById('ballVl');
    ball.addEventListener('mousedown', (): void => {
      this.trigger = true;
    });
    ballVl.addEventListener('mousedown', (): void => {
      this.vol = true;
    });
    document.addEventListener('mouseup', (): void => {
      if (this.trigger) {
        this.int(true);
        this.trigger = false;
      }
      if (this.vol) {
        this.vol = false;
      }
    });

    document.addEventListener('mousemove', (event: MouseEvent): void => {
      this.drag(event);
      this.volume(event);
    });

    this.music.addEventListener('ended', (): void => {
       if(this.shuffleLocker == 1) {
          this.playCounter = Math.floor(Math.random() * this.payload.length);
          console.log('counter:'+this.playCounter);
          this.ready(this.playCounter);
       } else {
        if(this.playlistLocker == 0) {
            this.next();
            console.log(this.playlistLocker);
        } else {
            this.reset();
            this.play();
        }
       }
    });
    

  }
  toggelfavicon(): void {    
    this.likeService.toggleLike(this.payload[this.playCounter][4])
    .subscribe((res: { isLike: boolean }) => {
      this.isLikeProps  = res.isLike;
      this.likeService.likes.next({action: true});
    });
  }
  
  isLike(): void {
    this.likeService.isLike(this.payload[this.playCounter][4])
      .subscribe((res: { isLike: boolean }) => {
        this.isLikeProps  = res.isLike;
        console.log(res);
      })
  }

  checkPlayCounter() {
    this.write.playCounterActive.next(this.playCounter);
  }

}
