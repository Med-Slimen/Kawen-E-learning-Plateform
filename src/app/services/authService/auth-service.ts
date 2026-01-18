import { inject, Injectable } from '@angular/core';
import { User } from '../../models/user';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
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
   signUp(name: string, lastName: string, email: string, password:string, role: string): void {
    createUserWithEmailAndPassword(this.fireAuth, email,password).then((cred)=>{
      const user: User = {
        uid: cred.user.uid,
        name: name,
        lastName: lastName,
        email: email,
        role: role
      };
      setDoc(doc(this.firestore, 'users', user.uid), user).then(() => {
        console.log('User data saved successfully!');
      }).catch((error) => {
        console.error('Error saving user data:', error);
      });
    }).catch((error)=>{
    console.error('Error during sign up:',error);
  });
}





}
