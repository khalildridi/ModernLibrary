import { Component } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

@Component({
  selector: '[custom-toast-component]',
  templateUrl: './custom-toast.component.html',
  styleUrls: ['./custom-toast.component.scss'],
})
export class CustomToastComponent extends Toast {
  // used for demo purposes
  undoString = '';

  // constructor is only necessary when not using AoT
  constructor(
    protected override toastrService: ToastrService,
    public override toastPackage: ToastPackage
  ) {
    super(toastrService, toastPackage);
  }

  action(event: Event) {
    event.stopPropagation();
    this.undoString = '';
    this.toastPackage.triggerAction();
    return false;
  }
}
