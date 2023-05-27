import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsolicitudComponent } from './editsolicitud.component';

describe('EditsolicitudComponent', () => {
  let component: EditsolicitudComponent;
  let fixture: ComponentFixture<EditsolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditsolicitudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditsolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
