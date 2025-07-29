## (Solo por motivos de esta entrega se incluyen archivos .env)
##  Comandos para iniciar proyecto desde terminal   

    git clone ( URL REPO )    
    cd (nombre de carpeta)   
    npm install   
    npm start    

## Estructura del Proyecto

Este proyecto sigue una arquitectura en capas bien organizada, con una clara separación de responsabilidades. A continuación, se describe cada uno de los directorios y archivos clave:

### Directorios Principales

- **`src/`**: 
  - Contiene todo el código fuente de la aplicación.
  
- **`config/`**: 
  - Almacena la configuración de la aplicación, como la configuración de la base de datos y otras variables de entorno.

- **`connection/`**: 
  - Maneja la conexión a la base de datos, asegurando que la aplicación pueda interactuar con MongoDB.

- **`controllers/`**: 
  - Contiene los controladores que gestionan la lógica de negocio y las interacciones entre las rutas y los servicios.

- **`dao/`**: 
  - Implementa el patrón Data Access Object (DAO), gestionando las operaciones CRUD directas sobre la base de datos.

- **`docs/`**: 
  - Almacena la documentación del proyecto, que podría incluir especificaciones de la API, guías de desarrollo, etc.

- **`DTO/`**: 
  - Contiene los Data Transfer Objects (DTO), que son objetos diseñados para transportar datos entre diferentes capas de la aplicación.

- **`helper/`**: 
  - Incluye funciones auxiliares o utilidades que se utilizan en diferentes partes de la aplicación.
- archivo gestiona el envío de correos electrónicos en la aplicación utilizando Nodemailer. Está diseñado para manejar distintas situaciones como el envío de correos de bienvenida y la emisión de tickets de compra.
-  configura y gestiona el sistema de logging de la aplicación utilizando la librería `winston`. El sistema de logging está diseñado para capturar y registrar diferentes niveles de errores e información, tanto en desarrollo como en producción.


- **`image/`**: 
  - Directorio para almacenar imágenes estáticas o relacionadas con la aplicación, cuando probamos multer al principio `public/`.

- **`media/`**:  
- #####   Pendiente a  finalizar  , este directorio fue creado para almacenar documentacion cargada por el usuario


- **`middleware/`**: 
  - Contiene middlewares que interceptan y procesan las solicitudes HTTP antes de que lleguen a los controladores.

- **`public/`**: 
  - Directorio para archivos estáticos que son servidos directamente al cliente, como imágenes, archivos JavaScript y CSS.

- **`router/`**: 
  - Define las rutas de la aplicación y las asocia con los controladores correspondientes.

- **`services/`**: 
  - Contiene la lógica de negocio de la aplicación. Los servicios interactúan con los DAOs y otras capas para realizar operaciones.

- **`socket/`**: 
  - Maneja la funcionalidad relacionada con WebSockets, permitiendo comunicación en tiempo real entre el servidor y los clientes.
  - configura la funcionalidad de chat en tiempo real en la aplicación utilizando WebSockets. Se integra con un `MessageManager` que maneja las operaciones relacionadas con los mensajes en la base de datos.
  - define la funcionalidad de gestión de productos en tiempo real utilizando WebSockets. Está diseñado para permitir la manipulación de productos (agregar, eliminar, mostrar y actualizar) y para mantener actualizada la lista de productos en todos los clientes conectados.
  - Este archivo habilita la gestión de productos en tiempo real en la aplicación, permitiendo que múltiples usuarios interactúen con la lista de productos simultáneamente y vean los cambios reflejados de inmediato. La integración con `productService` y el uso de WebSockets asegura que la experiencia del usuario sea dinámica y reactiva, mientras que el uso de un logger proporciona trazabilidad y facilita la depuración en caso de errores.


- **`utils/`**: 
  - Contiene utilidades y funciones generales que pueden ser reutilizadas en diferentes partes de la aplicación.
Este archivo centraliza varias configuraciones y utilidades esenciales para la aplicación, abarcando desde la gestión de rutas de archivos, hasta la configuración de `Multer` para la carga de archivos, el manejo de autenticación con `Passport`, y la integración con `Swagger` para la documentación de la API.

### Descripción General
Est archivo está diseñado para proporcionar funcionalidades de utilidad que son reutilizadas en varias partes de la aplicación. También se encarga de configurar y exportar varios módulos importantes como `Multer`, `Passport`, `Bcrypt`, y `Swagger`.

#### FALTA  FINALIZAR Configuración de `Multer` para Carga de Archivos 

- **`Multer` Storage:**
  - La configuración de `Multer` se establece para gestionar la carga de archivos en diferentes rutas basadas en el tipo de archivo (`profile`, `product`, `identificacion`, `comprobanteProducto`, `estadoDeCuenta`, y otros).
  - **Validación de Tipo de Archivo:** Solo se permiten imágenes y documentos; cualquier otro tipo de archivo es rechazado.

- **`upload`:**
  - Exporta la configuración de `Multer` para ser utilizada en las rutas donde se gestionan las cargas de archivos.

#### Autenticación con `Passport`

- **`passportCall`:**
  - Función de middleware que envuelve la autenticación de `Passport` para diferentes estrategias.
  - Maneja los errores y la respuesta en caso de que la autenticación falle, asegurando que solo usuarios autenticados accedan a rutas protegidas.

#### Manejo de Contraseñas con `Bcrypt`

- **`generaHash`:**
  - Genera un hash seguro para una contraseña utilizando `bcrypt`.

- **`validaPassword`:**
  - Compara una contraseña sin hash con su versión hasheada para verificar la autenticidad.

#### Validación de IDs de MongoDB

- **`isValidObjectId`:**
  - Verifica que un `ObjectId` de MongoDB sea válido, comparando su formato y valor.

#### Manejo de Errores Personalizados

- **`CustomError`:**
  - Clase que permite la creación de errores personalizados con un nombre, causa, mensaje y código de error. Facilita la gestión de errores específicos en la aplicación.

#### Integración con `Swagger` para Documentación

- **Configuración de `Swagger`:**
  - Define las opciones para la documentación de la API con `Swagger`, incluyendo el título, versión, y descripción del API.
  - **Especificaciones de Swagger:** Los archivos `Carrito.yaml` y `Productos.yaml` se utilizan para generar la documentación de la API.

- **`especificacionSwagger`:**
  - Exporta la especificación de `Swagger` generada con `swaggerJsdoc` para su uso en la configuración de la documentación de la API.

- **`views/`**: 
  - Almacena las vistas que se renderizan en el lado del servidor, utilizando Handlebars.

### Archivos Clave

- **`.env.development` y `.env.production`**: 
  - Archivos que contienen las variables de entorno específicas para los entornos de desarrollo y producción.

- **`app.js`**: 
  - El archivo principal de la aplicación que inicializa el servidor, configura los middlewares, y define las rutas base.

- **`ErrorLog.log`**: 
  - Archivo de log quealmacena los errores ocurridos en la aplicación para su posterior revisión y depuración.

- **`utils.js`**: 
  - Archivo que contiene funciones que no pertenecen a ninguna categoría específica pero que son necesarias en varias partes del proyecto.

### Directorio de Pruebas

- **`test/dao/`**: 
  - Contiene los archivos de prueba para los DAOs (`cartManager-dao.test.js`, `productManager-dao.test.js`, `userManager-dao.test.js`), asegurando que las operaciones de acceso a datos funcionen correctamente.
  
### Archivos de Configuración

- **`nodemon.json`**: 
  - Archivo de configuración para `nodemon`, una herramienta que reinicia automáticamente la aplicación cuando detecta cambios en el código.

- **`package.json` y `package-lock.json`**: 
  - Archivos que describen las dependencias del proyecto y otras configuraciones relacionadas con el entorno de Node.js.















    
##  Testing
    
   ##  Pruebas de Integración para CartManager
Este archivo (cartManager-dao.test.js) contiene pruebas de integración para verificar la funcionalidad del CartManager, que maneja la lógica relacionada con los carritos de compras en la aplicación.

##### Descripción General
Las pruebas aseguran que las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los carritos se realicen correctamente, interactuando directamente con la base de datos MongoDB.

##### Configuración Inicial

- **Conexión a la Base de Datos:** 
  - Se establece una conexión a MongoDB utilizando Mongoose para interactuar con una base de datos real durante las pruebas.
  
- **Cliente HTTP:** 
  - Se utiliza `supertest` para simular solicitudes HTTP a la API, permitiendo validar el comportamiento del `CartManager` en un entorno controlado.

##### Hooks de Configuración

- **`before`:** 
  - Antes de ejecutar las pruebas, se realiza una autenticación con credenciales administrativas (`email: "admincoder@coder.com", password: "admin"`) para obtener un token JWT y una cookie de sesión.
  - Luego, se crea un carrito de prueba y se guarda su ID (`createdCartId`) para utilizarlo en las pruebas subsecuentes.

- **`afterEach`:** 
  - Después de cada prueba, se elimina el carrito de prueba creado, asegurando que la base de datos quede en un estado limpio para la siguiente ejecución.

##### Pruebas Principales

1. **Obtener Lista de Carritos:** 
   - Verifica que se pueda recuperar una lista de carritos desde la base de datos y que cada carrito tenga las propiedades esperadas como `_id`, `products`, y `createdAt`.

2. **Crear un Nuevo Carrito:** 
   - Asegura que se pueda crear un nuevo carrito en la base de datos y valida que el carrito creado contenga las propiedades necesarias y correctas.

3. **Agregar Producto a un Carrito:** 
   - Verifica que se pueda agregar un producto a un carrito existente, comprobando que el producto se agregue correctamente y que las propiedades relevantes se actualicen.


## Pruebas de Integración para Productos
Este archivo (productos-dao.test.js) contiene pruebas de integración para verificar la funcionalidad relacionada con la gestión de productos en la aplicación.

##### Descripción General
Las pruebas aseguran que las operaciones relacionadas con productos, como la creación, obtención y validación de IDs, funcionen correctamente al interactuar con la base de datos MongoDB y la API de productos.

##### Configuración Inicial

- **Conexión a la Base de Datos:** 
  - Se establece una conexión a MongoDB utilizando Mongoose antes de ejecutar las pruebas para garantizar la interacción con una base de datos real.

- **Cliente HTTP:** 
  - Se utiliza `supertest` para simular solicitudes HTTP a la API de productos, permitiendo probar el comportamiento del sistema en un entorno controlado.

##### Hooks de Configuración

- **`before`:** 
  - Conecta a la base de datos y autentica al usuario administrador para obtener el token y la cookie de sesión necesarios para las solicitudes autenticadas.

- **`afterEach`:** 
  - Elimina cualquier producto creado durante las pruebas para mantener la base de datos en un estado limpio.

##### Pruebas Principales

- **Obtener Lista de Productos:** 
  - Verifica que se pueda recuperar una lista de productos y que cada producto tenga las propiedades esperadas (`_id`, `title`, `price`, `description`).

- **Crear un Nuevo Producto:** 
  - Asegura que se puede crear un nuevo producto y que la respuesta contiene las propiedades correctas, como `_id`, `title`, `description`, `price`, `stock`, `code`, y `category`.

- **Obtener Producto por ID:** 
  - Verifica que se pueda recuperar un producto específico por su `ID` y que el producto tiene las propiedades correctas.

- **Manejo de IDs de Producto Inválidos:** 
  - Asegura que la API devuelva un error cuando se intenta acceder a un producto con un `ID` no válido.

## Pruebas de Integración para UsersManager
Este archivo (userManager-dao.test.js) contiene pruebas de integración para verificar la funcionalidad del UsersManager, que maneja la lógica relacionada con los usuarios en la aplicación.

##### Descripción General
Las pruebas aseguran que las operaciones CRUD (Crear, Leer) sobre los usuarios se realicen correctamente, interactuando directamente con la base de datos MongoDB para validar que la funcionalidad del UsersManager funcione según lo esperado.

##### Configuración Inicial

- **Conexión a la Base de Datos:** 
  - Se establece una conexión a MongoDB utilizando Mongoose antes de ejecutar las pruebas, garantizando la interacción con una base de datos real.

- **Cliente HTTP:** 
  - Se utiliza `supertest` para simular solicitudes HTTP a la API de usuarios, permitiendo validar el comportamiento del `UsersManager` en un entorno controlado.

##### Hooks de Configuración

- **`before`:** 
  - Se inicializa la instancia de `UsersManager` para ser utilizada en las pruebas, preparando el entorno para la ejecución de las mismas.

- **`afterEach`:** 
  - Después de cada prueba, se elimina el usuario de prueba creado para mantener la base de datos limpia y evitar interferencias en las pruebas subsecuentes.

##### Pruebas Principales

- **Obtener Lista de Usuarios:** 
  - Verifica que el método `getBy` del DAO retorne un array de usuarios. Además, se asegura de que cada usuario en el array tenga propiedades básicas como `_id` y `email`.

- **Crear un Nuevo Usuario:** 
  - Asegura que se pueda crear un nuevo usuario en la base de datos y que el usuario creado tenga un ID válido (`_id`) y que las propiedades principales (`first_name`, `last_name`, `email`, etc.) se guarden correctamente.
  - 
  ***


