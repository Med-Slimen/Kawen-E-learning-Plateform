import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  user: User | null = null;
  isLoggedIn : boolean = false;
  ready:Promise<void> | null= null;
  private auth = inject(Auth);
  private fs = inject(Firestore);
  constructor() {
    this.ready=new Promise<void>((resolve)=>{
    onAuthStateChanged(this.auth, async(currentUser) => {
      if (!currentUser) {
        this.isLoggedIn = false;
        this.user = null;
        return
      }
      else{
        const snap=await getDoc(doc(this.fs, 'users', currentUser.uid));
        if(snap.exists()){
          this.user= snap.data() as User;
          this.isLoggedIn = true;
        }
      }
      resolve();
    });});
  }
  hasRole(roles:string[]): boolean | null {
    return roles.includes(this.user?.role || '');
  }
}
