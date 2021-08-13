import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import routes from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PagesComponent } from './Public/pages/pages.component';
import { LoginComponent } from './Public/users/login/login.component';
import { SignupComponent } from './Public/users/signup/signup.component';
import { NavbarComponent } from './Public/Layers/navbar/navbar.component';
import { SidenavComponent } from './Public/Layers/sidenav/sidenav.component';
import { MusicplayerComponent } from './Public/Layers/musicplayer/musicplayer.component';
import { HomeComponent } from './Public/pages/home/home.component';
import { BrowseComponent } from './Public/pages/browse/browse.component';
import { ChartsComponent } from './Public/pages/charts/charts.component';
import { NewreleaseComponent } from './Public/pages/newrelease/newrelease.component';
import {HttpClientModule} from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import * as $ from 'jquery';
import { PlaylistComponent } from './Public/pages/playlist/playlist.component';
import { NotFoundComponent } from './Public/pages/not-found/not-found.component';
import { ProfileComponent } from './Public/pages/profile/profile.component';
import { OverlayComponent } from './Public/Layers/overlay/overlay.component';
import { PlayingComponent } from './Public/pages/playing/playing.component';
import { AllComponent } from './all/all.component';
import { SinglemusicComponent } from './Public/pages/singlemusic/singlemusic.component';

@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    SidenavComponent,
    MusicplayerComponent,
    HomeComponent,
    BrowseComponent,
    ChartsComponent,
    NewreleaseComponent,
    PlaylistComponent,
    NotFoundComponent,
    ProfileComponent,
    OverlayComponent,
    PlayingComponent,
    AllComponent,
    SinglemusicComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    BrowserAnimationsModule,
    RouterModule,
    CarouselModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 
 }
