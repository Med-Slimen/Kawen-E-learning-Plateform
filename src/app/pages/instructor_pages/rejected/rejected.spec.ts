import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rejected } from './rejected';

describe('Rejected', () => {
  let component: Rejected;
  let fixture: ComponentFixture<Rejected>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rejected]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rejected);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
