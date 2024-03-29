import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../model/auth.service';
@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent
{
  public thisUserDisplayName;
  public thisUserAlphabet;

  constructor(private auth: AuthService,
              private router: Router) {
                const userInfo = JSON.parse(localStorage.getItem('user'));
                this.thisUserDisplayName = userInfo.displayName;
                this.thisUserAlphabet = this.thisUserDisplayName.substring(0, 1);
  }

  ngOnInit(): void {}

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
