import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import {BrowserLocalStorageService, ServerLocalStorageService} from "rushapp-angular-core";

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: BrowserLocalStorageService,
      useClass: ServerLocalStorageService
    }
  ]
})
export class AppServerModule {}
