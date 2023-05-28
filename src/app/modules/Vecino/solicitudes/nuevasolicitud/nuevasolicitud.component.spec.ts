import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevasolicitudComponent } from './nuevasolicitud.component';

describe('NuevasolicitudComponent', () => {
  let component: NuevasolicitudComponent;
  let fixture: ComponentFixture<NuevasolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevasolicitudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevasolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
