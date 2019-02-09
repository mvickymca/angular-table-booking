import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TitleHeadingComponent } from './title-heading/title-heading.component';
import { TabBookMainComponent } from './tab-book-main/tab-book-main.component';
import { BookInfoModalComponent } from './book-info-modal/book-info-modal.component';
import { CancelModalComponent } from './cancel-modal/cancel-modal.component';
import { TableInfoServiceService } from './table-info-service.service';
import { MobileNumberPipeConverter } from './shared-files/mobile-number-pipe';
import { AppRoutingModule } from './/app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    TitleHeadingComponent,
    TabBookMainComponent,
    BookInfoModalComponent,
    CancelModalComponent,
    MobileNumberPipeConverter
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [TableInfoServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
