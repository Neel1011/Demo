import { Component, OnInit, Input,Output, EventEmitter,OnChanges, ViewChild  } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from '../../shared/services/auth.service';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/shared/services/notification.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit , OnChanges{

  signupForm !: FormGroup;
  otpForm !: FormGroup;
  submitted = false;
  passmessage: string ='';
  @Input() display : any;
  @ViewChild('login') public login !: ModalDirective;
  @ViewChild('otp') public otp !: ModalDirective;
  verify : boolean = false;
  invalid : boolean = false;
  @Output() close : EventEmitter<string> = new EventEmitter();
  msg : any;
  disabled : boolean = true;

  constructor(private authService : AuthService, private toaster : NotificationService) { }

  ngOnInit(): void {
    this.buildForm();
    this.verifyFrom();
  }

  ngOnChanges(): void {
    if(this.display == 'signup'){
      this.login.show();
    }
  }

  buildForm() {
    this.signupForm = new FormGroup({
    email : new FormControl('', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    userName : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required,  Validators.minLength(8),  ]),
    confirmPassword : new FormControl('', [Validators.required, Validators.minLength(8),  ]),
    dob : new FormControl('', [Validators.required]),
    termsAccepted : new FormControl('', [Validators.required])
    })
  }

  verifyFrom(){
   this.otpForm  = new FormGroup({ 
    o1 : new FormControl(''),
    o2 : new FormControl(''),
    o3 : new FormControl(''),
    o4 : new FormControl(''),
    o5 : new FormControl(''),
    o6 : new FormControl(''),
   })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  checkPassword() {
    let password = this.signupForm.controls['password'].value;
    let cpassword = this.signupForm.controls['confirmPassword'].value;
    if (password != cpassword && this.signupForm.valid == true) {
      this.passmessage = "Password and repeat password must be same."
      this.f['confirmPassword'].setErrors({'incorrect': true})
      return true;
    }
    else {
      this.passmessage = " "
      return false;
    }
  }
  
  emailVerify(){

    if(this.signupForm.value.email == '' || null || undefined){
      this.toaster.showError('Please enter email address.','');
      return;
    }
    const email = {
      email : this.signupForm.value.email
    }

    this.otp.show();
    this.authService.signup(email).subscribe(res => {
      if(res.success){
        this.otp.show();
        this.verify = true;
        this.msg = res.message;
        this.disabled = false;
      }
      else{
        this.otp.hide();
        this.invalid = true;
        this.msg = res.message;
      }
    },
    err => {
      this.toaster.showError(err.error.message, "");
      this.otp.hide();
    });
  }

  otpVerification(){
    if(this.otpForm.invalid){
      this.toaster.showError('Please enter OTP.','')
      return;
    }
    let otp = this.otpForm.value.o1+this.otpForm.value.o2+this.otpForm.value.o3+this.otpForm.value.o4+this.otpForm.value.o5+this.otpForm.value.o6;
    const verification = {
      email : this.signupForm.value.email,
      otp : otp
    }
    this.authService.otpVerification(verification).subscribe(res => {
     if(res.success){
      this.verify = true;
      this.msg = res.message;
      this.otpForm.reset();
      this.otp.hide();

     }
     else{
      this.invalid = true;
      this.toaster.showError(res.message, '')
      this.msg = res.message;
      this.verify = false;
     }
    },err => {
      this.toaster.showError(err.error.message, "");
    })
  }

  closeModel(){
    this.login.hide();
    this.close.emit('close');
    this.signupForm.reset();
    this.otpForm.reset();
   }

  submit(){
  this.submitted = true;

  if(this.signupForm.invalid){
    return;
  }


  this.authService.register(this.signupForm.value).subscribe(res => {
    if(res.success){
     this.toaster.showSuccess(res.message, '')
     this.login.hide();
     this.signupForm.reset();
     this.disabled = true;
    }
    else{
     this.toaster.showError(res.message,'');
     this.login.hide();
    }
  },err => {
    this.toaster.showError(err.error.message, "");
  })
  }
}
