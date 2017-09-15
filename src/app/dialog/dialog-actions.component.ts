import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-actions',
  templateUrl: './dialog-actions.component.html',
  styleUrls: ['./dialog-actions.component.css'],
})
export class DialogActionsComponent {
  @Input() form: FormGroup;
  @Input() action: string;
  @Input() waiting: boolean;
}
