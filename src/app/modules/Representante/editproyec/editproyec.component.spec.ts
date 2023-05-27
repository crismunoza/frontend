import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditproyecComponent } from './editproyec.component';

describe('EditproyecComponent', () => {
  let component: EditproyecComponent;
  let fixture: ComponentFixture<EditproyecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditproyecComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditproyecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
