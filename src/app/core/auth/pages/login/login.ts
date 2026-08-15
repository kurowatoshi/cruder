import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { AuthStore } from '../../auth-store';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmLabelImports,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly authStore = inject(AuthStore);
  protected submitted = false;

  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected submit(): void {
    this.submitted = true;
    this.authStore.clearError();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const authenticated = this.authStore.login(this.form.getRawValue());

    if (!authenticated) {
      return;
    }

    const requestedUrl =
      this.route.snapshot.queryParamMap.get('returnUrl');

    const safeReturnUrl =
      requestedUrl?.startsWith('/') && !requestedUrl.startsWith('//')
        ? requestedUrl
        : '/';

    void this.router.navigateByUrl(safeReturnUrl);
  }
}