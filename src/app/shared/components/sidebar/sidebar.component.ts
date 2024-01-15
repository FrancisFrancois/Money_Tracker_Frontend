import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { ReadUser } from 'src/app/features/user/models/user';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  private _connectedUser : ReadUser | undefined;

  private _userSub : Subscription = new Subscription();

  constructor(
    private _authService : AuthService
  ) { }

  ngOnInit(): void {
    this._userSub = this._authService.$connectedUser.subscribe({
      next : (value) => {
        this._connectedUser = value;
      }
    })
    this._authService.getUserById();
  }

  isConnected() : boolean {
    return this._connectedUser != undefined;
  }

  userDisplay() : string {
    return ` ${this._connectedUser?.firstname}`; 
  }


  logout(): void {
    this._authService.logout();
  }

  ngOnDestroy(): void {
    this._userSub.unsubscribe();
    this.logout();
  }
}
