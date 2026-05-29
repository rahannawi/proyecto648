# 🚀 Sistema de Inventario de Redes (Net-Inventory) - Proyecto 648

¡Bienvenidos al repositorio oficial de **Net-Inventory (Proyecto 648)**! Este sistema empresarial premium está diseñado para la gestión y auditoría automatizada de inventarios de equipos de red, proveedores, usuarios, préstamos y reseñas de la empresa. Cuenta con una interfaz moderna con efectos de **glassmorphism**, tema oscuro, y un backend empresarial robusto en **.NET 10.0** conectado a **MariaDB**.

---

## 👥 Matriz de Roles y Permisos (Reglas de Negocio Estrictas)

El sistema implementa un control de acceso bajo roles (`0 = Administrador`, `1 = Técnico`, `2 = Usuario`) con privilegios acoplados estrictamente al backlog del proyecto:

| Módulo / Acción | Administrador (`role: 0`) | Técnico (`role: 1`) | Usuario (`role: 2`) |
| :--- | :---: | :---: | :---: |
| **Ver Catálogo de Equipos** | Sí | Sí | Sí (Solo Lectura) |
| **Registrar Equipos (`+ Registrar Equipo`)** | **Sí (Exclusivo)** | No | No |
| **Editar Estado de Equipo** | No | **Sí (Exclusivo)** | No |
| **Ver Proveedores** | Sí | Sí | Sí |
| **Registrar Proveedores (`+ Registrar Proveedor`)** | **Sí (Exclusivo)** | No | No |
| **Ver Préstamos** | Sí | Sí | Sí |
| **Registrar Préstamos (`+ Nuevo Préstamo`)** | No | **Sí (Exclusivo)** | No |
| **Ver / Registrar Usuarios** | **Sí (Exclusivo)** | No | No |
| **Ver Reseñas de la Empresa** | Sí | Sí | Sí |
| **Crear Reseñas de la Empresa** | No | No | **Sí (Exclusivo)** |

---

## 💻 Instrucciones para Levantar el Proyecto (Fácil en 1 Clic)

Hemos optimizado el despliegue del proyecto para que tus compañeros puedan configurarlo en sus computadoras de forma instantánea sin escribir comandos manuales repetitivos.

### 1. Requisitos Previos e Instalación
Asegúrate de tener instalado lo siguiente en tu máquina Windows:
1. **Node.js** (Versión 18 o superior) -> Descargar de [nodejs.org](https://nodejs.org/).
2. **.NET 10.0 SDK** (o superior) -> Descargar de [dotnet.microsoft.com](https://dotnet.microsoft.com/).
3. **MariaDB 12.2** (o superior) -> Descargar de [mariadb.org](https://mariadb.org/).

### 2. Configuración de Base de Datos y Arranque en 1 Clic
* En la raíz de tu proyecto encontrarás el archivo **`Iniciar-Proyecto.bat`**. 
* **Simplemente haz doble clic sobre `Iniciar-Proyecto.bat`** y el script se encargará automáticamente de:
  1. Iniciar el servicio local de la base de datos MariaDB (en el puerto 3306).
  2. Restaurar dependencias, compilar y levantar el backend de C# (`http://localhost:5219`).
  3. Instalar las dependencias de node, compilar y ejecutar el servidor de desarrollo del frontend de Vite (`http://localhost:5173`).
  4. Abrir automáticamente tu navegador web predeterminado en el sistema de inventario.

---

## 🧪 Usuarios de Prueba Autogenerados (Base de Datos Limpia)

Cada vez que el backend se inicia, el sembrador (`DbSeeder.cs`) realiza una limpieza total de las tablas y genera datos de prueba limpios con credenciales consistentes:

* **Usuario General (Solo Lectura y Reseñas):**
  * **Email:** `usuario@test.com` | **Clave:** `123` | **Nombre:** Juan Perez
* **Personal Técnico (Préstamos y Edición de Equipos):**
  * **Email:** `tecnico@test.com` | **Clave:** `123` | **Nombre:** Carlos Martinez
* **Administrador (Registro de Equipos, Proveedores y Usuarios):**
  * **Email:** `admin@test.com` | **Clave:** `123` | **Nombre:** Ana Gomez

---

## 📊 Vista SQL Integrada para HeidiSQL
Para auditar los préstamos de forma legible en tu gestor de base de datos SQL (como HeidiSQL), el sembrador crea automáticamente una vista de base de datos llamada **`v_prestamos_detalles`**. Al consultarla mediante:

```sql
SELECT * FROM v_prestamos_detalles;
```

Obtendrás una tabla perfectamente legible donde los identificadores numéricos se reemplazan por los nombres reales de los equipos, marcas, modelos y nombres de los técnicos o solicitantes involucrados.
