import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  implemented: boolean;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class Shell {
  protected readonly navItems: NavItem[] = [
    { label: 'Inicio', icon: 'home', route: '/', implemented: true },
    { label: 'Mapa', icon: 'place', route: '/mapa', implemented: false },
    { label: 'Alarmas', icon: 'notifications', route: '/alarmas', implemented: true },
    { label: 'Calendario', icon: 'calendar_today', route: '/calendario', implemented: false },
    { label: 'Reuniones', icon: 'groups', route: '/reuniones', implemented: false },
    { label: 'Ajustes', icon: 'tune', route: '/ajustes', implemented: false }
  ];
}
