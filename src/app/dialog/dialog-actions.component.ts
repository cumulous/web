import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-actions',
  templateUrl: './dialog-actions.component.html',
})
export class DialogActionsComponent {
  @Input() form: FormGroup;
  @Input() action: string;
}
