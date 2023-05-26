import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRepComponent } from './register-rep.component';

describe('RegisterRepComponent', () => {
  let component: RegisterRepComponent;
  let fixture: ComponentFixture<RegisterRepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterRepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
