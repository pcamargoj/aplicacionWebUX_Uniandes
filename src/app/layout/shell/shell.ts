import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class Shell {
  protected readonly navItems: NavItem[] = [
    { label: 'Inicio', icon: 'home', route: '/' },
    { label: 'Mapa', icon: 'place', route: '/mapa' },
    { label: 'Alarmas', icon: 'notifications', route: '/alarmas' },
    { label: 'Calendario', icon: 'calendar_today', route: '/calendario' },
    { label: 'Reuniones', icon: 'groups', route: '/reuniones' },
    { label: 'Ajustes', icon: 'tune', route: '/ajustes' }
  ];
}
