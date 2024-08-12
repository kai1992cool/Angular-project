import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];
  currentPage: number = 1;
  usersPerPage: number = 9;
  pages: number[] = [];
  userToDeleteId: string | null = null;
  deleteConfirmationModal: any;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.deleteConfirmationModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal')!);
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.updatePaginatedUsers();
      this.updatePages();
    });
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    const endIndex = startIndex + this.usersPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  updatePages(): void {
    const totalPages = Math.ceil(this.users.length / this.usersPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  addUser(): void {
    this.router.navigate(['/add']);
  }

  editUser(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  showDeleteConfirmation(userId: string): void {
    this.userToDeleteId = userId;
    this.deleteConfirmationModal.show();
  }

  confirmDelete(): void {
    if (this.userToDeleteId !== null) {
      this.userService.deleteUser(Number(this.userToDeleteId));
      this.loadUsers(); 
      this.deleteConfirmationModal.hide(); 
    }
  }

  cancelDelete(): void {
    this.deleteConfirmationModal.hide();
  }
}
