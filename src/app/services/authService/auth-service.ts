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
            console.error('Error adding verification request:', error);
            return false;
          });
        }else{
          return true;
        }
      }).catch((error) => {
        console.error('Error adding user to Firestore:', error);
        return false;
      });
    }).catch((error)=>{
      console.error('Error during sign up:', error);
    return false;
  });
}
async logout(): Promise<boolean> {
    return this.fireAuth.signOut().then(() => {
      return true;
    }).catch((error) => {
      console.error('Error during logout:', error);
      return false;
    });
  }
}
