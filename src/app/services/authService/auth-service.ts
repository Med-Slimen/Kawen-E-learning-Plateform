import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fireAuth = inject(Auth);
  public constructor() {}
  login(email: string, password: string): void {
    console.log(`Logging in with email: ${email} and password: ${password}`);
    signInWithEmailAndPassword(this.fireAuth, email, password)
      .then((userCredential) => {
        console.log('Login successful:', userCredential);
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  }
}
