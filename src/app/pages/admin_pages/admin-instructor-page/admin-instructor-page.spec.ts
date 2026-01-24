import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstructorPage } from './admin-instructor-page';

describe('AdminInstructorPage', () => {
  let component: AdminInstructorPage;
  let fixture: ComponentFixture<AdminInstructorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInstructorPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInstructorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
