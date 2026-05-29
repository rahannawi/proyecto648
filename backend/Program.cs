// ESTE ARCHIVO SIRVE PARA:
// Configurar e iniciar el servidor web de la aplicación backend de .NET (Web API).
// Es el punto de entrada oficial (Entry Point) del backend. Aquí se inyectan los servicios al contenedor de dependencias,
// se configuran las políticas de seguridad (CORS), se conecta la base de datos MariaDB/MySQL,
// y se define la tubería (HTTP Request Pipeline) por donde pasan las peticiones web.

using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using NetInventory.API.Models;

// 1. Inicializamos el constructor del host web de la aplicación pasando los argumentos de la consola.
var builder = WebApplication.CreateBuilder(args);

// 2. REGISTRO DE SERVICIOS EN EL CONTENEDOR DE INYECCIÓN DE DEPENDENCIAS:
// Agregamos el soporte para controladores API REST a los servicios del contenedor.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    // CONFIGURACIÓN DE SEGURIDAD JSON (MUY IMPORTANTE PARA EVITAR ERRORES DE LOOP EN EF CORE):
    // IgnoreCycles le indica al serializador JSON que si encuentra una referencia circular en los modelos
    // (por ejemplo: un Préstamo tiene un Usuario, y ese Usuario a su vez tiene una lista de Préstamos),
    // ignore esa autoreferencia y no se quede en un bucle infinito que rompa el servidor.
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// CONFIGURACIÓN DE CORS (Cross-Origin Resource Sharing):
// El navegador web por seguridad bloquea peticiones HTTP cruzadas entre dominios distintos.
// Como el frontend corre en el puerto 5173 (React con Vite) y el backend en el puerto 5219 (.NET),
// definimos una política llamada "AllowFrontend" que permite de manera segura recibir peticiones desde el origen del cliente.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173") // Orígenes del puerto por defecto de Vite
                  .AllowAnyHeader()  // Permite cualquier tipo de cabecera HTTP (ej. Content-Type, Authorization)
                  .AllowAnyMethod(); // Permite cualquier método HTTP (GET, POST, PUT, DELETE)
        });
});

// CONFIGURACIÓN DEL CONTEXTO DE BASE DE DATOS (EF CORE + MARIADB):
// Extraemos la cadena de conexión (Connection String) definida en el archivo de configuración 'appsettings.json'.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Inyectamos nuestro contexto de base de datos 'AppDbContext' indicándole que utilice el proveedor de MySQL/MariaDB
// y que autodetecte la versión del servidor en ejecución para optimizar la compatibilidad de las sentencias SQL generadas.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Agregamos soporte para generar especificaciones OpenAPI (Swagger) que permiten documentar y probar los endpoints.
builder.Services.AddOpenApi();

// 3. CONSTRUCCIÓN DE LA APLICACIÓN WEB:
// Una vez configurados todos los servicios, construimos la instancia de la aplicación 'app'.
var app = builder.Build();

// LOGICA DE SEMBRADO Y MIGRACIÓN AUTOMÁTICA DE BASE DE DATOS:
// Creamos un ámbito de vida temporal (Scope) para obtener de forma segura el servicio 'AppDbContext'
// e invocar al DbSeeder que creará la estructura, las vistas de base de datos y los registros iniciales de demostración.
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    NetInventory.API.Data.DbSeeder.Seed(context);
}

// 4. CONFIGURACIÓN DEL PIPELINE DE SOLICITUDES HTTP (MIDDLEWARES):
// Si la aplicación se está ejecutando en entorno de desarrollo, habilitamos el mapeo de OpenAPI para pruebas del desarrollador.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Habilitamos el middleware de CORS usando la política "AllowFrontend" configurada anteriormente.
// Esto debe ir estrictamente antes de mapear los controladores para que no bloquee las llamadas AJAX de React.
app.UseCors("AllowFrontend");

// Habilitamos el middleware de autorización (preparado por si se implementa seguridad avanzada más adelante).
app.UseAuthorization();

// Mapea y conecta las rutas de los controladores (ej. /api/Users, /api/Loans) con sus clases correspondientes.
app.MapControllers();

// Ejecuta la aplicación web y comienza a escuchar peticiones entrantes en los puertos configurados.
app.Run();

