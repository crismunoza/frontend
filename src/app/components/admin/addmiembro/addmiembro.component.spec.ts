import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmiembroComponent } from './addmiembro.component';

describe('AddmiembroComponent', () => {
  let component: AddmiembroComponent;
  let fixture: ComponentFixture<AddmiembroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmiembroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmiembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
