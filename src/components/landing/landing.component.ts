import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {SeoOptimizationService} from "rushapp-angular-core";
import {
  AddingNewRoleDialogComponent
} from "../../shared-components/dialogs/adding-new-role-dialog/adding-new-role-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {
  ConsultationDialogComponent
} from "../../shared-components/dialogs/consultation-dialog/consultation-dialog.component";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  private subsTranslateService: Subscription;
  private script1: any;
  private script2: any;
  private script3: any;
  private css: any;

 public constructor(
    private translateService: TranslateService,
    private seoOptimizationService: SeoOptimizationService,
    private renderer2: Renderer2,
    private dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.addExternalFiles();
    this.subscribed();
    this.setAllMetaTag();
  }
  public ngOnDestroy(): void {
    this.removeExternalFiles();
    this.unsubscribed();
  }
  public openConsultationDialog(): void {
    this.dialog.open(ConsultationDialogComponent, {
      width: '350px'
    });
  }

  private subscribed(): void {
    this.subsTranslateService = this.translateService.onLangChange.subscribe(() => {
      this.setAllMetaTag();
    });
  }
  private unsubscribed(): void {
    if (this.subsTranslateService) {
      this.subsTranslateService.unsubscribe();
    }
  }
  private setAllMetaTag(): void {
    this.seoOptimizationService.setAllMetaTag('HOME_TITLE_META_TAG', 'HOME_DESCRIPTION_META_TAG');
  }
  private addExternalFiles(): void {
    this.css = this.renderer2.createElement('link');
    this.css.rel = 'stylesheet';
    this.css.href = 'assets/landing/css/landing.css';
    this.renderer2.appendChild(document.head, this.css);

    this.script1 = this.renderer2.createElement('script');
    this.script1.src = 'assets/landing/js/landing.min.js';
    this.renderer2.appendChild(document.body, this.script1);

    this.script2 = this.renderer2.createElement('script');
    this.script2.src = 'https://unpkg.com/animejs@3.0.1/lib/anime.min.js';
    this.renderer2.appendChild(document.body, this.script2);

    this.script3 = this.renderer2.createElement('script');
    this.script3.src = 'https://unpkg.com/scrollreveal@4.0.0/dist/scrollreveal.min.js';
    this.renderer2.appendChild(document.body, this.script3);
  }
  private removeExternalFiles(): void {
    this.renderer2.removeChild(document.body, this.css);
    this.renderer2.removeChild(document.body, this.script1);
    this.renderer2.removeChild(document.body, this.script2);
    this.renderer2.removeChild(document.body, this.script3);
  }
}
