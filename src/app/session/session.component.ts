import { Component } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'session-control',
  templateUrl: './session.component.html'
})
export class SessionComponent {
  constructor(private readonly auth: AuthService) {}

  onClickLogout() {
    this.auth.logout();
  }
}
