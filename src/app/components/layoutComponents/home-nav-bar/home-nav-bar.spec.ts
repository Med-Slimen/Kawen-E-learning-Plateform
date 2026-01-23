import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNavBar } from './home-nav-bar';

describe('HomeNavBar', () => {
  let component: HomeNavBar;
  let fixture: ComponentFixture<HomeNavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeNavBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeNavBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
