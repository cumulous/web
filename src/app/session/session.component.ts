import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-control',
  templateUrl: './session.component.html'
})
export class SessionComponent {
  constructor(
    private readonly router: Router,
  ) {}

  onClickLogout() {
    this.router.navigate(['/login', {
      logout: true,
    }]);
  }
}
