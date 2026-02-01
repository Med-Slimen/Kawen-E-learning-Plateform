import { inject, Injectable } from '@angular/core';
import { Firestore, getDoc, getDocs, query } from '@angular/fire/firestore';
import { collection, doc, updateDoc, where } from 'firebase/firestore';
import { User } from '../../models/user';
import { user } from '@angular/fire/auth';
import { Verification } from '../../models/verification';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  firestore=inject(Firestore);
  loading: boolean = false;
  constructor() {}
  async getAllUsers(): Promise<User[]> {
    try{
      const usersSnap=await getDocs(collection(this.firestore, 'users'));
      return Promise.all(
        usersSnap.docs.map(async (doc) => {
          const data = doc.data() as User;
          return {
            uid: doc.id,
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            pfpUrl: data.pfpUrl,
            status: data.status,
          };
        })
      );
    }catch(error){
      alert('Error fetching users: ' + error);
      throw new Error('Error fetching users');
    }
  }
  async getStudentsCount(): Promise<number> {
    try{
      const usersSnap=await getDocs(query(collection(this.firestore, 'users'),where('role','==','Student')));
      return usersSnap.size;
    }catch(error){
      alert('Error fetching students count: ' + error);
      throw new Error('Error fetching students count');
    }
  }
   async getInstructorsCount(): Promise<number> {
    try{
      const usersSnap=await getDocs(query(collection(this.firestore, 'users'),where('role','==','Instructor')));
      return usersSnap.size;
    }catch(error){
      alert('Error fetching instructors count: ' + error);
      throw new Error('Error fetching instructors count');
    }
  }
  async getAllInstructors(): Promise<User[]> {
    try{
      const usersSnap=await getDocs(query(collection(this.firestore, 'users'),where('role','==','Instructor')));
      return Promise.all(
        usersSnap.docs.map(async (doc) => {
          const data = doc.data() as User;
          return {
            uid: doc.id,
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            pfpUrl: data.pfpUrl,
            status: data.status,
            verificationId: data.verificationId || '',
          };
        })
      );
    }catch(error){
      alert('Error fetching instructors: ' + error);
      throw new Error('Error fetching instructors');
    }
  }
  async getAllStudents(): Promise<User[]> {
    try{
      const usersSnap=await getDocs(query(collection(this.firestore, 'users'),where('role','==','Student')));
      return Promise.all(
        usersSnap.docs.map(async (doc) => {
          const data = doc.data() as User;
          return {
            uid: doc.id,
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            pfpUrl: data.pfpUrl,
            status: data.status,
          };
        })
      );
    }catch(error){
      alert('Error fetching students: ' + error);
      throw new Error('Error fetching students');
    }
  }
   async getInstructorById(instructorId: string) : Promise<User> {
    try{
      const userSnap=await getDoc(doc(this.firestore, 'users', instructorId));
      if(!userSnap.exists()){
        throw new Error('Instructor not found');
      }
      return{
        uid: userSnap.id,
        ...userSnap.data()
      }as User;
    }catch(error){
      alert('Error fetching instructor: ' + error);
      throw new Error('Error fetching instructor');
    }
    
  }
  async getVerificationById(verificationId: string) : Promise<Verification> {
    try{
      const verifSnap=await getDoc(doc(this.firestore, 'verifications', verificationId));
      if(!verifSnap.exists()){
        throw new Error('Verification not found');
      }
      const instructorId=verifSnap.data()['instructorId'];
      const instructor=await this.getInstructorById(instructorId);
      return {
        uid: verifSnap.id,
        cvFileUrl: verifSnap.data()['cvFileUrl'],
        linkedinProfileUrl: verifSnap.data()['linkedinProfileUrl'],
        portfolioUrl: verifSnap.data()['portfolioUrl'],
        instructor: instructor,
      };
    }catch(error){
      alert('Error fetching verification: ' + error);
      throw new Error('Error fetching verification');
    }
  }

}