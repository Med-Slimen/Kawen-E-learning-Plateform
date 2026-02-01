import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, setDoc,addDoc } from '@angular/fire/firestore';
import { Cloudinary } from '../cloudinaryService/cloudinary';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fireAuth = inject(Auth);
  private firestore = inject(Firestore);
  private cloudinaryService = inject(Cloudinary);
  errorMessage = signal<string | null>(null);
  public constructor() {}
  login(email: string, password: string): Promise<boolean> {
    return signInWithEmailAndPassword(this.fireAuth, email, password)
      .then((userCredential) => {
        const userRef= doc(this.firestore, 'users', userCredential.user.uid);
        return getDoc(userRef).then((docSnap)=>{
          if(!docSnap.exists())return false;
          return true;
        });
      })
      .catch((error) => {
        this.errorMessage.set(this.errorMessageSetter(error.message));
        return false;
        
      });
  }
   signUp(name: string, lastName: string, email: string, password:string, role: string, pfpUrl: string, cvFile: File, linkedinProfileUrl?: string, portfolioUrl?: string): Promise<boolean> {
    return createUserWithEmailAndPassword(this.fireAuth, email,password).then((cred)=>{
      let status='active';
      if(role==='Instructor'){
        status='pending';
      }
      const user: Omit<User, 'uid'> = {
        name: name,
        lastName: lastName,
        email: email,
        role: role,
        pfpUrl: pfpUrl,
        status: status
      };
      return setDoc(doc(this.firestore, 'users', cred.user.uid), user).then(async () => {
        if(role==='Instructor'){
          const cvFileUrl=await this.cloudinaryService.uploadImage(cvFile, 'verifications', 'raw');
          const verificiationData={
            userId: cred.user.uid,
            cvFileUrl: cvFileUrl,
            linkedinProfileUrl: linkedinProfileUrl,
            portfolioUrl: portfolioUrl,
          }
          return addDoc(collection(this.firestore, 'verifications'), verificiationData).then(() => {
            return true;
          }).catch((error) => {
            this.errorMessage.set(this.errorMessageSetter(error.message));
            return false;
          });
        }else{
          return true;
        }
      }).catch((error) => {
        this.errorMessage.set(this.errorMessageSetter(error.message));
        return false;
      });
    }).catch((error)=>{
      this.errorMessage.set(this.errorMessageSetter(error.message));
    return false;
  });
}
async logout(): Promise<boolean> {
    return this.fireAuth.signOut().then(() => {
      return true;
    }).catch((error) => {
      this.errorMessage.set(this.errorMessageSetter(error.message));
      return false;
    });
  }
  errorMessageSetter(message: string | null): string {
    switch (message) {
      case 'Firebase: Error (auth/invalid-credential).':
      case 'Firebase: Error (auth/wrong-password).':
      case 'Firebase: Error (auth/user-not-found).':
        return 'Incorrect email or password.'; // (security-friendly)
      case 'Firebase: Error (auth/user-disabled).':
        return 'This account has been disabled.';
      case 'Firebase: Error (auth/too-many-requests).':
        return 'Too many attempts. Please try again later.';
      case 'Firebase: Error (auth/invalid-email).':
        return 'Please enter a valid email address.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
  clearErrorMessage(): void {
    this.errorMessage.set(null);
  }
}
