# Alarmas Siempre a Tiempo

**Alarmas Siempre a Tiempo** es una aplicación web construida con Angular que ayuda al usuario a salir a tiempo a sus reuniones, avisándole con anticipación según el tráfico de su ruta. Este proyecto fue desarrollado como trabajo académico para el curso de Desarrollo Web de la Universidad de los Andes.

Esta primera versión incluye 7 pantallas con interacción:

- **Home**.
- **Mis alarmas**, con el listado de alarmas configuradas por el usuario.
- **Detalle de una alarma**.
- El flujo de **agregar recurrencia a una alarma** (por ejemplo, que se repita todos los miércoles o de lunes a viernes), compuesto por 4 pantallas: 3 pasos y la confirmación de éxito.
  1. **Frecuencia**: cada cuántas semanas y qué días se repite.
  2. **Hasta cuándo**: sin fin o hasta una fecha, elegida en un calendario.
  3. **Confirmar**: resumen de la recurrencia y sus próximas ocurrencias.
  4. **Recurrencia agregada**: próximas reuniones y opción de compartir el enlace de la alarma.

  Al confirmar, la recurrencia queda guardada y se ve en el detalle de la alarma. Para probarlo: *Mis alarmas → Reunión semanal de ventas → Agregar recurrencia*.

La aplicación no tiene backend: los datos son de ejemplo, viven en memoria (`AlarmsService`) y se reinician al recargar la página. En el flujo de recurrencia solo está implementada la frecuencia semanal y el fin en una fecha; las demás opciones del diseño aparecen como "Próximamente".

## Diseño

Prototipo en Figma: [UX - Siempre a Tiempo](https://www.figma.com/proto/Z8oSiR3n6bGlEfoxApbGiV/UX---Siempre-a-Tiempo?node-id=2348-98&p=f&t=I5srq8XxqmBBRcyg-1&scaling=min-zoom&content-scaling=fixed&page-id=2330%3A1903)

### Decisiones respecto al prototipo

- Se usa la tipografía y los colores de Material Design 3 (Roboto, tema azure) en lugar de Inter y los hex exactos de Figma.
- **Accesibilidad (WCAG 2.1 AA):** el naranja de los botones principales se oscureció de `#e8543f` a `#d04531` para alcanzar un contraste de 4.59:1 con el texto blanco (el original da 3.64:1). Cada pantalla tiene su propio título, y en el flujo de recurrencia el foco pasa al título de cada paso para que los lectores de pantalla lo anuncien.
- Los datos de las pantallas de confirmación y éxito salen de la alarma y de lo elegido en el flujo (el mockup mezcla datos de dos alarmas distintas).

## Integrantes

| Nombre | Usuario GitHub | Correo Uniandes |
| --- | --- | --- |
| Pedro Camargo | [pcamargoj](https://github.com/pcamargoj) | p.camargoj@uniandes.edu.co |
| Santiago Aparicio| [s-aparicio11](https://github.com/s-aparicio11) | s.aparicio11@uniandes.edu.co |

## Tecnologías

- [Angular](https://angular.dev) 20 
- [Angular Material](https://material.angular.dev) 20 con tema Material Design 3 (M3)
- [Angular CDK](https://material.angular.dev/cdk)
- TypeScript 5.9

## Requisitos previos

- [Node.js](https://nodejs.org) 18 o superior
- npm (incluido con Node.js)

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/pcamargoj/aplicacionWebUX_Uniandes.git
   cd aplicacionWebUX_Uniandes
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

## Ejecutar el proyecto en local

```bash
npm start
```

Esto levanta el servidor de desarrollo de Angular. Una vez iniciado, abre el navegador en [http://localhost:4200](http://localhost:4200). La aplicación se recarga automáticamente al modificar el código fuente.

## Otros comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm start` | Levanta el servidor de desarrollo (`ng serve`) |
| `npm run build` | Compila la aplicación para producción en `dist/` |
| `npm run watch` | Compila en modo desarrollo y observa cambios |
| `npm test` | Ejecuta las pruebas unitarias con Karma |
