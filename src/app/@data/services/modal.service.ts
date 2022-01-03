import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { ModalCommonComponent } from './../../@common-components/modal/modal-common/modal-common.component';
import { HttpClient } from '@angular/common/http';
import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  ApplicationRef,
  EmbeddedViewRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/@domain/models/user';
import { ModalRepository } from 'src/app/@domain/repository/modal.repository';
import { ApiService } from './api.service';
import { Const } from './const';

@Injectable({
  providedIn: 'root',
})
export class ModalService extends ModalRepository {
  private dialogSubject: Subject<any> = new Subject<any>();
  public dialogObservable$: Observable<any>;
  isLoading$: Observable<boolean>;
  my_modal_title: any = 'Titulo';
  my_modal_content: any = 'Content';
  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  modalOptions: NgbModalOptions;
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private compFactRes: ComponentFactoryResolver,
    private injector: Injector,
    private appref: ApplicationRef,
    private modalService: NgbModal
  ) {
    super();
    this.dialogObservable$ = this.dialogSubject.asObservable();
  }

  public create(): void {
    const compoRef = this.compFactRes
      .resolveComponentFactory(ModalCommonComponent)
      .create(this.injector);
    this.appref.attachView(compoRef.hostView);
    let ele = (compoRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(ele);
  }
  open(content: any) {
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
