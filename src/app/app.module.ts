import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MenuComponent } from './menu/menu.component';
import { FormsModule } from '@angular/forms';
import { FontGrabberComponent } from './home/font-grabber/font-grabber.component';
import { FontListComponent } from './home/font-grabber/font-list/font-list.component';
import { FontItemComponent } from './home/font-grabber/font-list/font-item/font-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    MenuComponent,
    FontGrabberComponent,
    FontListComponent,
    FontItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
