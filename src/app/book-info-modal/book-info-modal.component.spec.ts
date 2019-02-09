import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookInfoModalComponent } from './book-info-modal.component';

describe('BookInfoModalComponent', () => {
  let component: BookInfoModalComponent;
  let fixture: ComponentFixture<BookInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
