import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/userService/user-service';
import { Verification } from '../../../models/verification';
import { ActivatedRoute } from '@angular/router';
import { doc, Firestore, writeBatch } from '@angular/fire/firestore';
import { Location } from '@angular/common';

@Component({
  selector: 'app-review-instructor',
  imports: [],
  templateUrl: './review-instructor.html',
  styleUrl: './review-instructor.css',
})
export class ReviewInstructor {
  userService=inject(UserService);
  verification:Verification|null=null;
  firestore=inject(Firestore);
  loading:boolean=false;
  constructor(private route:ActivatedRoute,private location:Location) {}
  async ngOnInit() {
    const verificationId=this.route.snapshot.paramMap.get('verificationId');
    if(!verificationId){
      alert('No verification ID provided');
      return;
    }
    this.verification=await this.userService.getVerificationById(verificationId);
  }
  async approveVerification(){
    const confirm=window.confirm('Are you sure you want to approve this verification?');
    if(!confirm){
      return;
    }
    try{
      this.loading=true;
      const batch=writeBatch(this.firestore);
    if(!this.verification){
      alert('No verification loaded');
      this.location.back();
      return;
    }
    batch.update(doc(this.firestore, 'users', this.verification.instructor.uid), {
        status: 'active',
        verificationId: null,
      });
    batch.delete(doc(this.firestore, 'verifications', this.verification.uid));
    await batch.commit();
    alert('Verification approved');
    this.location.back();
  }catch(error){
    alert('Error approving verification: '+(error as Error).message);
    this.location.back();
  }finally{
    this.loading=false;
  }
}
  async rejectVerification(){
    const confirm=window.confirm('Are you sure you want to reject this verification?');
    if(!confirm){
      return;
    }
    try{
      this.loading=true;
      const batch=writeBatch(this.firestore);
    if(!this.verification){
      alert('No verification loaded');
      this.location.back();
      return;
    }
    batch.update(doc(this.firestore, 'users', this.verification.instructor.uid), {
        status: 'rejected',
        verificationId: null,
      });
    batch.delete(doc(this.firestore, 'verifications', this.verification.uid));
    await batch.commit();
    alert('Verification rejected');
    this.location.back();
  }catch(error){
    alert('Error rejecting verification: '+(error as Error).message);
    this.location.back();
  }finally{
    this.loading=false;
  }
}

}