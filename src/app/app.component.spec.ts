import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            select: jasmine.createSpy().and.callFake((selector) => {
              if (selector === 'getCartItems') {
                return of([
                  { productId: 1, name: 'Laptop', price: 1000, quantity: 1 },
                ]);
              } else if (selector === 'getTotalPrice') {
                return of(1000);
              }
              return of([]);
            }),
            dispatch: jasmine.createSpy(),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the `migros-cart` title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('migros-cart');
  });
});
