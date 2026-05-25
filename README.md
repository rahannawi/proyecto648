# Proyecto 648 - Sistema de Inventario de Redes (Net-Inventory)

¡Bienvenidos al repositorio oficial del **Proyecto 648**! Este sistema ha sido diseñado para gestionar de forma eficiente y segura el inventario de equipos de red, proveedores y préstamos, con un diseño moderno y un backend robusto.

## 🚀 Resumen del Primer Sprint

En esta primera fase hemos dejado listo un esqueleto 100% funcional. ¿Qué se logró?

1. **Diseño Moderno y Responsivo (Frontend)**:
   - Interfaz construida en **React + Vite** con TypeScript.
   - Tema oscuro nativo, efectos "*glassmorphism*" (cristal esmerilado) e interacciones fluidas.
   - 4 Módulos principales: Dashboard (Inventario), Préstamos, Proveedores y Usuarios.

2. **Backend Robusto y API REST (Backend)**:
   - Construido en **C# (.NET Core)**.
   - 4 controladores conectados (CRUD completo de Usuarios, Equipos, Proveedores y Préstamos).
   - Manejo de ciclos JSON corregido de raíz para consultas relacionales complejas.

3. **Base de Datos Limpia (MariaDB)**:
   - Conexión configurada hacia MariaDB.
   - Se implementó un sembrador automático (`DbSeeder.cs`) que al arrancar el servidor genera un entorno de pruebas limpio con:
     - 3 Usuarios predefinidos (Operador, Técnico, Administrador).
     - 1 Proveedor de pruebas.
     - 3 Equipos de red base.

4. **Reglas de Negocio Implementadas**:
   - Mapeo estricto de roles: `0 = Administrador`, `1 = Técnico`, `2 = Operador`.
   - Filtros inteligentes: Solo los administradores pueden aprobar préstamos, y solo los equipos en estado "Disponible" pueden ser prestados.
   - Autoguardado al cambiar el estado de un equipo desde el modal de detalles.

---

## 💻 Instrucciones para el Equipo (Cómo levantar el proyecto)

Si es tu primera vez clonando el repositorio, sigue estos pasos para tener todo corriendo en tu máquina en menos de 2 minutos:

### 1. Requisitos Previos
Asegúrate de tener instalado en tu computadora:
- [Node.js](https://nodejs.org/) (Para correr el Frontend en React).
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download) (Para correr el servidor en C#).
- [MariaDB](https://mariadb.org/) o MySQL Server (Para la base de datos).

### 2. Configuración de la Base de Datos
- Entra a tu cliente SQL favorito (HeidiSQL, DBeaver, MySQL Workbench) o por consola.
- Inicia sesión con el usuario `root` y la contraseña `root` (si tu contraseña es distinta, deberás cambiarla en el archivo `backend/appsettings.json` en la línea del `DefaultConnection`).
- **NOTA:** No necesitas crear tablas a mano. El sistema lo hará por ti usando migraciones de Entity Framework Core.

### 3. Ejecutar el Backend (C#)
Abre una terminal, navega a la carpeta del backend y ejecuta el servidor:
```bash
cd backend
dotnet run
```
> **¿Qué pasará?** El servidor arrancará en el puerto `http://localhost:5219`. Al detectar que la base de datos está vacía, creará automáticamente la base de datos `NetInventoryDb`, construirá todas las tablas e inyectará los usuarios de prueba.

### 4. Ejecutar el Frontend (React)
Abre *otra* terminal (no cierres la del backend), navega a la carpeta frontend, instala las dependencias y corre el servidor de desarrollo:
```bash
cd frontend
npm install
npm run dev
```
> **¿Qué pasará?** Vite abrirá un servidor local (usualmente en `http://localhost:5173`). ¡Entra a ese enlace en tu navegador y verás la interfaz gráfica viva!

---

## 🧪 Usuarios de Prueba (Generados automáticamente)

Para que no tengan que registrar usuarios manualmente al hacer pruebas, la base de datos siempre inicia con estas tres cuentas:

| Nombre | Rol Lógico | Descripción |
| :--- | :--- | :--- |
| **Ana Gomez** | `Administrador` | Tiene autoridad para aparecer en la lista de "Aprobadores" de préstamos. |
| **Carlos Martinez** | `Técnico` | Personal de nivel intermedio para gestión de equipos. |
| **Juan Perez** | `Operador` | Usuario raso que puede recibir equipos en calidad de préstamo. |

¡Mucho éxito con el código y a seguir dándole forma al Proyecto 648!
