
import { AuthModule } from './modules/auth/auth.module';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { DomainModule } from './@domain/domain.module';
import { MyHttpInterceptor } from './@data/interceptors/request.interceptor';
import { Const } from './@data/services/const';
import { BasicAuthInterceptor, ErrorInterceptor } from './@data/interceptors';
import { JwtModule } from '@auth0/angular-jwt';
import { ApiService } from './@data/services/api.service';
import { CommonComponentModule } from './@common-components/common-component.module';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    DomainModule.forRoot(),
    JwtModule.forRoot({
      config: { tokenGetter },
    }),HttpClientModule, AuthModule,CommonComponentModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initCommonConfig,
      deps: [Const],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initElectraConfig,
      deps: [Const],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'es-ES' },

    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

export function tokenGetter() {
  return sessionStorage.getItem('token');
}

export function initCommonConfig(c: Const) {
  return () => c.loadCommonConfig();
}

export function initElectraConfig(c: Const) {
  return () => c.loadElectraConfig();
}
