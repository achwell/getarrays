import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {NotificationService} from "../service/notification.service";
import {NotificationType} from "../enum/notification-type.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../model/user";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public showLoading: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }
  }

  public onRegister(user: User): void {
    this.showLoading = true;
    const {ERROR, SUCCESS} = NotificationType;
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe(
        (response: User) => {
          this.showLoading = false;
          this.sendNotification(SUCCESS, `A new account was created for ${response.firstName}.
          Please check your email for password to log in.`);
        },
        (errorResponse: HttpErrorResponse) => {
          let message = "";
          if(errorResponse.error.message) {
            message = errorResponse.error.message;
          } else if(errorResponse.message) {
            message = errorResponse.message;
          }
          this.sendNotification(ERROR, message);
          this.showLoading = false;
        }
      )
    );
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
