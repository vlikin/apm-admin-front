import {LoginPageComponent} from './component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AppService} from '../../service/app';
import {FakeAppService} from '../../service/fake-app';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

fdescribe('Page Login', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let service: AppService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, ReactiveFormsModule ],
      declarations: [ LoginPageComponent ],
      providers: [
        {
          provide: AppService,
          useClass: FakeAppService
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    service = TestBed.get(AppService);
    service.clearAll();
    fixture.detectChanges();
  });

  afterEach(() => {
    service.clearAll();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Right credentials', () => {
    component.form.patchValue({
      login: 'admin',
      password: 'passwd'
    });
    component.save();
    expect(service.isAuthenticated()).toBeTruthy();
    console.log('isAuthenticated', service.isAuthenticated());
  });

});