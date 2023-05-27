import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmiembroComponent } from './editmiembro.component';

describe('EditmiembroComponent', () => {
  let component: EditmiembroComponent;
  let fixture: ComponentFixture<EditmiembroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditmiembroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditmiembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
