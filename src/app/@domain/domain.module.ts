import { UserService } from './../@data/services/user.service';
import { UserRepository } from 'src/app/@domain/repository/user.repository';

import {
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { AuthenticationRepository } from './repository/authentication.repository';
import { AuthenticationService } from '../@data/services/authentication.service';
import { ModalRepository } from './repository/modal.repository';
import { ModalService } from '../@data/services/modal.service';

const DATA_SERVICES = [
  {
    provide: AuthenticationRepository,
    useClass: AuthenticationService,
  },

  {
    provide: UserRepository,
    useClass: UserService,
  },

  {
    provide: ModalRepository,
    useClass: ModalService,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class DomainModule {
  constructor(@Optional() @SkipSelf() parentModule: DomainModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: DomainModule,
      providers: [...DATA_SERVICES],
    } as ModuleWithProviders<any>;
  }
}
