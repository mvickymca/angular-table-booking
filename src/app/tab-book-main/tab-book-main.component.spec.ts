import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabBookMainComponent } from './tab-book-main.component';

describe('TabBookMainComponent', () => {
  let component: TabBookMainComponent;
  let fixture: ComponentFixture<TabBookMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabBookMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabBookMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
