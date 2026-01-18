import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { User } from '../../models/user';
import { doc, setDoc } from 'firebase/firestore';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fireAuth = inject(Auth);
  private firestore = inject(Firestore);
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
   signUp(user: User): void {
    console.log("user :"+user);
    createUserWithEmailAndPassword(this.fireAuth, user.email, user.password).then((cred)=>{
      user.id=cred.user.uid;
      setDoc(doc(this.firestore, 'users', user.id), user).then(() => {
        console.log('User data saved successfully!');
      }).catch((error) => {
        console.error('Error saving user data:', error);
      });
    }).catch((error)=>{
    console.error('Error during sign up:',error);
  });
}





}
