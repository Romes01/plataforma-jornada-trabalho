import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, TimeEntry } from './services/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  name = '';
  isRegisterMode = false;
  email = '';
  password = '';
  token = '';
  entries: TimeEntry[] = [];
  today = new Date();

  errorMessage = '';
  successMessage = '';
  loading = false;
  actionLoading = false;

  get activeEntry(): TimeEntry | undefined {
    return this.entries.find(entry => entry.endedAt === null);
  }

  toggleAuthMode(): void {
  this.isRegisterMode = !this.isRegisterMode;
  this.name = '';
  this.password = '';
  this.errorMessage = '';
  this.successMessage = '';
}

register(): void {
  this.errorMessage = '';
  this.successMessage = '';

  if (!this.name.trim() || !this.email.trim() || !this.password) {
    this.errorMessage = 'Preencha todos os campos.';
    return;
  }

  if (this.password.length < 8) {
    this.errorMessage = 'A senha deve ter pelo menos 8 caracteres.';
    return;
  }

  this.loading = true;

  this.api.register(
    this.name.trim(),
    this.email.trim(),
    this.password
  ).subscribe({
    next: () => {
      this.isRegisterMode = false;
      this.name = '';
      this.password = '';
      this.loading = false;
      this.successMessage = 'Conta criada com sucesso! Entre com seu e-mail e senha.';
      this.cdr.detectChanges();
    },
    error: error => {
      this.loading = false;

      this.errorMessage =
        error.status === 409
          ? 'Este e-mail já está cadastrado.'
          : error.status === 400
            ? 'Não foi possível cadastrar. Verifique os dados e se o e-mail já está em uso.'
            : 'Não foi possível criar a conta. Verifique sua conexão e tente novamente.';

      this.cdr.detectChanges();
    }
  });
}

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Preencha o e-mail e a senha.';
      return;
    }

    this.loading = true;

    this.api.login(this.email.trim(), this.password).subscribe({
next: response => {
  this.token = response.token;
  this.password = '';
  this.loading = false;
  this.cdr.detectChanges();
  this.loadEntries();
},
      error: error => {
        this.errorMessage =
          error.status === 401
            ? 'E-mail ou senha incorretos.'
            : 'Não foi possível conectar ao servidor.';
        this.loading = false;
      }
    });
  }


loadEntries(): void {
  if (!this.token) {
    return;
  }

  this.api.getTimeEntries(this.token).subscribe({
    next: entries => {
      this.entries = entries;
      this.cdr.detectChanges();
    },
    error: () => {
      this.errorMessage = 'Não foi possível carregar o histórico.';
      this.cdr.detectChanges();
    }
  });
}

startWorkday(): void {
  if (!this.token || this.actionLoading || this.activeEntry) {
    return;
  }

  this.errorMessage = '';
  this.successMessage = '';
  this.actionLoading = true;
  this.cdr.detectChanges();

  this.api.startWorkday(this.token).subscribe({
    next: () => {
      this.successMessage = 'Jornada iniciada com sucesso!';
      this.actionLoading = false;
      this.loadEntries();
      this.cdr.detectChanges();
    },
    error: error => {
      this.errorMessage =
        error.status === 409
          ? 'Você já possui uma jornada em andamento. Atualize o histórico.'
          : 'Não foi possível iniciar a jornada. Tente novamente.';
      this.actionLoading = false;
      this.cdr.detectChanges();
      this.loadEntries();
    }
  });
}

endWorkday(): void {
  if (!this.token || this.actionLoading || !this.activeEntry) {
    return;
  }

  this.errorMessage = '';
  this.successMessage = '';
  this.actionLoading = true;
  this.cdr.detectChanges();

  this.api.endWorkday(this.token).subscribe({
    next: () => {
      this.successMessage = 'Jornada encerrada com sucesso!';
      this.actionLoading = false;
      this.loadEntries();
      this.cdr.detectChanges();
    },
    error: error => {
      this.errorMessage =
        error.status === 404
          ? 'Não existe uma jornada em andamento.'
          : 'Não foi possível encerrar a jornada. Tente novamente.';
      this.actionLoading = false;
      this.cdr.detectChanges();
      this.loadEntries();
    }
  });
}

  formatDuration(minutes: number | null): string {
    if (minutes === null) {
      return 'Em andamento';
    }

    const totalMinutes = Math.floor(minutes);
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${hours}h ${remainingMinutes}min`;
  }

  logout(): void {
    this.token = '';
    this.entries = [];
    this.email = '';
    this.password = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
}
