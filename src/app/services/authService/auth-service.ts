import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fireAuth = inject(Auth);
  private firestore = inject(Firestore);
  public constructor() {}
  login(email: string, password: string): Promise<boolean> {
    return signInWithEmailAndPassword(this.fireAuth, email, password)
      .then((userCredential) => {
        const userRef= doc(this.firestore, 'users', userCredential.user.uid);
        return getDoc(userRef).then((docSnap)=>{
          if(!docSnap.exists())return false;
          const userData= docSnap.data() as User;
          localStorage.setItem('user', JSON.stringify(userData));
          return true;
        });
      })
      .catch((error) => {
        return false;
      });
  }
   signUp(name: string, lastName: string, email: string, password:string, role: string): Promise<boolean> {
    return createUserWithEmailAndPassword(this.fireAuth, email,password).then((cred)=>{
      const user: User = {
        uid: cred.user.uid,
        name: name,
        lastName: lastName,
        email: email,
        role: role
      };
      return setDoc(doc(this.firestore, 'users', user.uid), user).then(() => {
        console.log('User data saved successfully!');
        return true;
      }).catch((error) => {
        console.error('Error saving user data:', error);
        return false;
      });
    }).catch((error)=>{
    console.error('Error during sign up:',error);
    return false;
  });
}
logout(): Promise<boolean> {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      return true;
    }).catch((error) => {
      console.error('Error during logout:', error);
      return false;
    });
  }
}
