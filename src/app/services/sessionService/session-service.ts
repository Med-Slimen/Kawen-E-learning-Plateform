import { inject, Injectable, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  user = signal<User | null>(null);
  isLoggedIn =signal(false);
  ready:Promise<void> | null= null;
  private auth = inject(Auth);
  private fs = inject(Firestore);
  constructor() {
    this.ready=new Promise<void>((resolve)=>{
    onAuthStateChanged(this.auth, async(currentUser) => {
      if (!currentUser) {
        this.isLoggedIn.set(false);
        this.user.set(null);
        resolve();
        return;
      }
      else{
        const snap=await getDoc(doc(this.fs, 'users', currentUser.uid));
        if(snap.exists()){
          this.user.set(snap.data() as User);
          this.isLoggedIn.set(true);
        }
        else{
          this.user.set(null);
          this.isLoggedIn.set(false);
        }
      }
      resolve();
    });});
  }
  hasRole(roles:string[]): boolean | null {
    return roles.includes(this.user()?.role || '');
  }
}
