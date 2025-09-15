import { Injectable, EventEmitter } from '@angular/core';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public onUserChange: EventEmitter<User> = new EventEmitter<User>();

  constructor() { }

  getUserSetting(key: string): string | null {
    // Mock implementation
    if (key === 'name') {
      return 'Test User';
    }
    if (key === 'userId') {
        return '1';
    }
    return null;
  }

  setUserSetting(key: string, value: string) {
    // Mock implementation
  }

  unsetUserSetting() {
      // Mock
  }
}
