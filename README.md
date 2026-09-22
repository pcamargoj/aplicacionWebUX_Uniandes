# Alarmas Siempre a Tiempo

**Alarmas Siempre a Tiempo** es una aplicación web construida con Angular que ayuda al usuario a salir a tiempo a sus reuniones, avisándole con anticipación según el tráfico de su ruta. Este proyecto fue desarrollado como trabajo académico para el curso de Desarrollo Web de la Universidad de los Andes.

Esta primera versión incluye 6 pantallas con interacción:

- **Home**.
- **Mis alarmas**, con el listado de alarmas configuradas por el usuario.
- **Detalle de una alarma**.
- El flujo de **agregar recurrencia a una alarma** (por ejemplo, que se repita todos los días o solo entre semana), compuesto por 3 pantallas.

## Diseño

Prototipo en Figma: [UX - Siempre a Tiempo](https://www.figma.com/proto/Z8oSiR3n6bGlEfoxApbGiV/UX---Siempre-a-Tiempo?node-id=2348-98&p=f&t=I5srq8XxqmBBRcyg-1&scaling=min-zoom&content-scaling=fixed&page-id=2330%3A1903)

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
