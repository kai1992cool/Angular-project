import { Component, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements AfterViewInit {
  userForm: FormGroup;
  notificationMessage: string = '';
  photoUrl: string | ArrayBuffer | null = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, this.noNumbers]],
      lastName: ['', [Validators.required, this.noNumbers]],
      occupation: ['', [Validators.required, this.noNumbers]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      photo: ['', Validators.required]  // Make photo required
    });
  }

  noNumbers(control: any): { [key: string]: boolean } | null {
    if (control.value && /\d/.test(control.value)) {
      return { 'containsNumber': true };
    }
    return null;
  }

  showNotification(message: string): void {
    this.notificationMessage = '';  // Reset message to trigger OnChanges in NotificationComponent
    setTimeout(() => {
      this.notificationMessage = message;  // Set the new message to show the notification
    }, 0);
  }

  handleSubmit(): void {
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
    const modal = document.getElementById('confirmModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  ngAfterViewInit(): void {
    const confirmModalElement = document.getElementById('confirmModal');
    if (confirmModalElement) {
      const saveButton = confirmModalElement.querySelector('.btn-primary');
      if (saveButton) {
        saveButton.addEventListener('click', () => {
          this.confirmAddUserAndNavigate();
        });
      }
    }
  }

  confirmAddUserAndNavigate(): void {
    this.confirmAddUser();
    const modal = document.getElementById('confirmModal');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance?.hide();
    this.router.navigate(['/home']);
  }

  confirmAddUser(): void {
    if (this.userForm.valid) {
      const newUser = this.userForm.value;
      this.userService.addUser(newUser).subscribe(() => {
        const confirmModalElement = document.getElementById('confirmModal');
        const confirmModal = bootstrap.Modal.getInstance(confirmModalElement!);

        if (confirmModal) {
          confirmModal.hide();
          this.router.navigate(['/home']); 
        } else {
          this.router.navigate(['/home']);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoUrl = reader.result;
        this.userForm.patchValue({ photo: this.photoUrl });
      };
      reader.readAsDataURL(file);
    }
  }
}