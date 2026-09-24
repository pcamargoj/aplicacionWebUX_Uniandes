import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const APP_NAME = 'Siempre a Tiempo';

// Título de pestaña por pantalla (WCAG 2.4.2): "{título de la ruta} · Siempre a Tiempo"
@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    this.title.setTitle(title ? `${title} · ${APP_NAME}` : APP_NAME);
  }
}
