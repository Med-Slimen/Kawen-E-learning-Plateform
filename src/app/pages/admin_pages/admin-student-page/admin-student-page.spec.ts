import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStudentPage } from './admin-student-page';

describe('AdminStudentPage', () => {
  let component: AdminStudentPage;
  let fixture: ComponentFixture<AdminStudentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStudentPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
