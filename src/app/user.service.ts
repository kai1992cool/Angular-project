import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  constructor() { }

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUser(id: number): Observable<User | undefined> {
    const user = this.users.find(user => user.id === id.toString());
    return of(user);
  }

  addUser(user: User): Observable<void> {
    if (!user.id) {
      user.id = (this.users.length + 1).toString();  
    }
    user.createdDate = new Date(); 
    if (user.dateOfBirth) {
      user.age = this.calculateAge(user.dateOfBirth);
    }
    this.users.push({ ...user });  
    return of();
  }
  
  updateUser(updatedUser: User): Observable<void> {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
        this.users[index] = { ...this.users[index], ...updatedUser };  // Merge existing user data with updated data
    } else {
        console.error('User not found, cannot update');
    }
    return of();
}

  updateUserPhoto(id: string, photoUrl: string | ArrayBuffer | null): Observable<void> {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1 && photoUrl) {
      if (typeof photoUrl !== 'string') {
        // Convert ArrayBuffer to base64 string
        photoUrl = this.arrayBufferToBase64(photoUrl);
      }
      this.users[index].photo = photoUrl;
    }
    return of();
  }

  deleteUser(id: number): Observable<void> {
    this.users = this.users.filter(user => user.id !== id.toString());
    return of();
  }

  private calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
