import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnChanges {
  @Input() message: string = '';
  messages: { id: number; text: string; show: boolean; }[] = [];
  private nextId: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && changes['message'].currentValue) {
      this.addMessage(changes['message'].currentValue);
    }
  }

  addMessage(text: string): void {
    const id = this.nextId++;
    const newMessage = { id, text, show: true };
    this.messages.push(newMessage);

    setTimeout(() => this.hideMessage(id), 3000); // Automatically hide after 3 seconds
  }

  hideMessage(id: number): void {
    const message = this.messages.find(msg => msg.id === id);
    if (message) {
      message.show = false;
      setTimeout(() => {
        this.messages = this.messages.filter(msg => msg.id !== id);
      }, 500); // Remove from list after animation
    }
  }

  removeMessage(id: number): void {
    this.hideMessage(id);
  }
}
