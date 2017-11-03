import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {

  readonly text$ = this.params('text');
  readonly class$ = this.params('class');

  constructor(
    private readonly route: ActivatedRoute,
  ) {}

  private params(selector: string) {
    return this.route.params
      .map(params => params[selector]);
  }
}
