import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  userId!: string;
  notificationMessage: string = '';
  private confirmModalInstance: any;
  photoUrl?: string | ArrayBuffer | null = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required, this.noNumbers]],
      lastName: ['', [Validators.required, this.noNumbers]],
      occupation: ['', [Validators.required, this.noNumbers]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      photo: ['']
    });
  }

  noNumbers = (control: any): { [key: string]: boolean } | null => {
    if (control.value && /\d/.test(control.value)) {
      return { 'containsNumber': true };
    }
    return null;
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.userService.getUser(Number(this.userId)).subscribe(user => {
        if (user) {
            this.userForm.patchValue(user);
            this.photoUrl = user.photo;
            this.userForm.get('id')?.setValue(user.id);  // Ensure the ID is set correctly
        }
    });
  
    const modalElement = document.getElementById('confirmSaveUserModal');
    if (modalElement) {
        this.confirmModalInstance = new bootstrap.Modal(modalElement);
    }
}

  showNotification(message: string): void {
    this.notificationMessage = ''; 
    setTimeout(() => {
      this.notificationMessage = message;  
    }, 0);
  }

  handleSave(event: Event): void {
    event.preventDefault(); 
    if (this.userForm.invalid || this.hasErrors()) {
      this.showNotification('Please ensure all fields are correctly filled and do not contain numbers.');
    } else {
      this.showConfirmationModal(); 
    }
  }

  hasErrors(): boolean {
    const controls = this.userForm.controls;
    return Object.keys(controls).some(key => controls[key].hasError('containsNumber'));
  }

  showConfirmationModal(): void {
    if (this.confirmModalInstance) {
      this.confirmModalInstance.show();
    }
  }

  confirmSaveUser(): void {
    if (this.userForm.valid) {
        const updatedUser = { ...this.userForm.value };
        updatedUser.id = this.userId;  // Explicitly set the correct ID for update

        this.userService.updateUser(updatedUser).subscribe(() => {
            this.confirmModalInstance.hide();
            this.router.navigate(['/home']);
        }, (error) => {
            console.error('Error updating user:', error);
        });
    }
}

  cancel(): void {
    this.router.navigate(['/home']);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            this.photoUrl = reader.result as string;
            this.userForm.patchValue({ photo: this.photoUrl });
        };
        reader.readAsDataURL(file);
    }
}
}
