import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AnimateOnScrollDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  
  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    institution: [''],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;

      const contactData = {
        sender_name: this.contactForm.value.name,
        sender_email: this.contactForm.value.email,
        subject: this.contactForm.value.subject,
        institution: this.contactForm.value.institution,
        message: this.contactForm.value.message
      };

      this.http.post('http://localhost:3000/api/contact', contactData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.contactForm.reset();
          
          setTimeout(() => {
            this.submitSuccess = false;
          }, 5000);
        },
        error: (err) => {
          console.error('Error submitting contact form', err);
          this.isSubmitting = false;
          this.submitError = true;
          
          setTimeout(() => {
            this.submitError = false;
          }, 5000);
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
