import { Component, OnInit ,Input,Output, EventEmitter,OnChanges, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from '../../shared/services/auth.service';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signinForm !: FormGroup;
  submitted = false;
  @Input() display : any;
  @Output() close : EventEmitter<string> = new EventEmitter();
  @ViewChild('login') public login !: ModalDirective;
  constructor(private authService : AuthService, private toaster : NotificationService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(): void {
    if(this.display == 'login'){
      this.login.show();
    }
  }

  buildForm() {
    this.signinForm = new FormGroup({
    email : new FormControl('', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password : new FormControl('', [Validators.required,  Validators.minLength(8),  ]),
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signinForm.controls;
  }

  submit(){
    this.submitted = true;

    if(this.signinForm.invalid){
      return;
    }
    

    this.authService.login(this.signinForm.value).subscribe(res => {
      if(res.success){
        this.toaster.showSuccess(res.message,'');
        const userData = {
          ART : res.data.user.token,
          ART_user : res.data.user.username.userName
        }
        localStorage.setItem('ART', JSON.stringify(res.data.user.token))
        this.login.hide();
        this.signinForm.reset();
        this.close.emit('login');
      }else{
      this.toaster.showError(res.message,'')
      }
    },err => {
      this.toaster.showError(err.error.message, "");
    })
    
  }

  closeModel(){
   this.login.hide();
   this.close.emit('close');
  }
}
