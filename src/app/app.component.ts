import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslationService } from './modules/i18n/translation.service';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { TableExtendedService } from './_metronic/shared/crud-table';
import { SpaSettings } from './models/spa-settings.model';
import { CustomSpaSettingsService } from './profile/content-management/services/custom-spa-settings.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  spaSettings: SpaSettings;
  headerColor: string;
  footerColor: string;
  
  constructor(
    private translationService: TranslationService,
    private splashScreenService: SplashScreenService,
    private router: Router,
    private tableService: TableExtendedService,
    private customSpaSettingsService: CustomSpaSettingsService,
    private cdr: ChangeDetectorRef,
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  ngOnInit() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // clear filtration paginations and others
        this.tableService.setDefaults();
        // hide splash screen
        this.splashScreenService.hide();

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);

        this.getSpaSettings(this.router.url.includes('/profile'));
      }
    });
    this.unsubscribe.push(routerSubscription);

    this.customSpaSettingsService.triggerHeaderSettings.subscribe((trigger) => {
      if (trigger)
        this.getSpaSettings(true);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  onActivate(event) {
    // window.scroll(0,0);
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    document.body.scrollTop = 0;
    document.querySelector('body').scrollTo(0, 0)
  }

  public scrollToTop() {
    this.scroll.nativeElement.scrollTop = 0;
  }

  getSpaSettings(isAdmin: boolean = false) {
    this.customSpaSettingsService.getCustomSPASettingAsync().subscribe(result => {
      let data = result as any;
      this.spaSettings = data.data;

      if(isAdmin){
        this.headerColor = data.data.adminPageHeaderColor;
        this.footerColor = data.data.adminPageFooterColor;
      } else {
        this.headerColor = data.data.landingPageHeaderColor;
        this.footerColor = data.data.landingPageFooterColor;
      }
      this.cdr.detectChanges();
    })
  }
}
