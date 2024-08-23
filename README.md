<<<<<<< HEAD
<h2 class="code-line" data-line-start=0 data-line-end=1 ><a id="Comandos_para_iniciar_proyecto_desde_terminal_0"></a>Comandos para iniciar proyecto desde terminal</h2>
<pre><code>git clone ( URL REPO )    
cd (nombre de carpeta)   
npm install   
npm start    
</code></pre>
<h2 class="code-line" data-line-start=7 data-line-end=8 ><a id="Estructura_del_Proyecto_7"></a>Estructura del Proyecto</h2>
<p class="has-line-data" data-line-start="9" data-line-end="10">Este proyecto sigue una arquitectura en capas bien organizada, con una clara separación de responsabilidades. A continuación, se describe cada uno de los directorios y archivos clave:</p>
<h3 class="code-line" data-line-start=11 data-line-end=12 ><a id="Directorios_Principales_11"></a>Directorios Principales</h3>
<ul>
<li class="has-line-data" data-line-start="13" data-line-end="16">
<p class="has-line-data" data-line-start="13" data-line-end="14"><strong><code>src/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="14" data-line-end="16">Contiene todo el código fuente de la aplicación.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="16" data-line-end="19">
<p class="has-line-data" data-line-start="16" data-line-end="17"><strong><code>config/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="17" data-line-end="19">Almacena la configuración de la aplicación, como la configuración de la base de datos y otras variables de entorno.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="19" data-line-end="22">
<p class="has-line-data" data-line-start="19" data-line-end="20"><strong><code>connection/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="20" data-line-end="22">Maneja la conexión a la base de datos, asegurando que la aplicación pueda interactuar con MongoDB.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="22" data-line-end="25">
<p class="has-line-data" data-line-start="22" data-line-end="23"><strong><code>controllers/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="23" data-line-end="25">Contiene los controladores que gestionan la lógica de negocio y las interacciones entre las rutas y los servicios.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="25" data-line-end="28">
<p class="has-line-data" data-line-start="25" data-line-end="26"><strong><code>dao/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="26" data-line-end="28">Implementa el patrón Data Access Object (DAO), gestionando las operaciones CRUD directas sobre la base de datos.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="28" data-line-end="31">
<p class="has-line-data" data-line-start="28" data-line-end="29"><strong><code>docs/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="29" data-line-end="31">Almacena la documentación del proyecto, que podría incluir especificaciones de la API, guías de desarrollo, etc.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="31" data-line-end="34">
<p class="has-line-data" data-line-start="31" data-line-end="32"><strong><code>DTO/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="32" data-line-end="34">Contiene los Data Transfer Objects (DTO), que son objetos diseñados para transportar datos entre diferentes capas de la aplicación.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="34" data-line-end="36">
<p class="has-line-data" data-line-start="34" data-line-end="35"><strong><code>helper/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="35" data-line-end="36">Incluye funciones auxiliares o utilidades que se utilizan en diferentes partes de la aplicación.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="36" data-line-end="37">
<p class="has-line-data" data-line-start="36" data-line-end="37">archivo gestiona el envío de correos electrónicos en la aplicación utilizando Nodemailer. Está diseñado para manejar distintas situaciones como el envío de correos de bienvenida y la emisión de tickets de compra.</p>
</li>
<li class="has-line-data" data-line-start="37" data-line-end="38">
<p class="has-line-data" data-line-start="37" data-line-end="38">configura y gestiona el sistema de logging de la aplicación utilizando la librería <code>winston</code>. El sistema de logging está diseñado para capturar y registrar diferentes niveles de errores e información, tanto en desarrollo como en producción.</p>
</li>
</ul>
<ul>
<li class="has-line-data" data-line-start="40" data-line-end="43">
<p class="has-line-data" data-line-start="40" data-line-end="41"><strong><code>image/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="41" data-line-end="43">Directorio para almacenar imágenes estáticas o relacionadas con la aplicación, cuando probamos multer al principio <code>public/</code>.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="43" data-line-end="44">
<p class="has-line-data" data-line-start="43" data-line-end="44"><strong><code>media/</code></strong>:</p>
</li>
<li class="has-line-data" data-line-start="44" data-line-end="45">
<h5 class="code-line" data-line-start=44 data-line-end=45 ><a id="Pendiente_a__finalizar___este_directorio_fue_creado_para_almacenar_documentacion_cargada_por_el_usuario_44"></a>Pendiente a  finalizar  , este directorio fue creado para almacenar documentacion cargada por el usuario</h5>
</li>
</ul>
<ul>
<li class="has-line-data" data-line-start="47" data-line-end="50">
<p class="has-line-data" data-line-start="47" data-line-end="48"><strong><code>middleware/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="48" data-line-end="50">Contiene middlewares que interceptan y procesan las solicitudes HTTP antes de que lleguen a los controladores.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="50" data-line-end="53">
<p class="has-line-data" data-line-start="50" data-line-end="51"><strong><code>public/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="51" data-line-end="53">Directorio para archivos estáticos que son servidos directamente al cliente, como imágenes, archivos JavaScript y CSS.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="53" data-line-end="56">
<p class="has-line-data" data-line-start="53" data-line-end="54"><strong><code>router/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="54" data-line-end="56">Define las rutas de la aplicación y las asocia con los controladores correspondientes.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="56" data-line-end="59">
<p class="has-line-data" data-line-start="56" data-line-end="57"><strong><code>services/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="57" data-line-end="59">Contiene la lógica de negocio de la aplicación. Los servicios interactúan con los DAOs y otras capas para realizar operaciones.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="59" data-line-end="64">
<p class="has-line-data" data-line-start="59" data-line-end="60"><strong><code>socket/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="60" data-line-end="61">Maneja la funcionalidad relacionada con WebSockets, permitiendo comunicación en tiempo real entre el servidor y los clientes.</li>
<li class="has-line-data" data-line-start="61" data-line-end="62">configura la funcionalidad de chat en tiempo real en la aplicación utilizando WebSockets. Se integra con un <code>MessageManager</code> que maneja las operaciones relacionadas con los mensajes en la base de datos.</li>
<li class="has-line-data" data-line-start="62" data-line-end="63">define la funcionalidad de gestión de productos en tiempo real utilizando WebSockets. Está diseñado para permitir la manipulación de productos (agregar, eliminar, mostrar y actualizar) y para mantener actualizada la lista de productos en todos los clientes conectados.</li>
<li class="has-line-data" data-line-start="63" data-line-end="64">Este archivo habilita la gestión de productos en tiempo real en la aplicación, permitiendo que múltiples usuarios interactúen con la lista de productos simultáneamente y vean los cambios reflejados de inmediato. La integración con <code>productService</code> y el uso de WebSockets asegura que la experiencia del usuario sea dinámica y reactiva, mientras que el uso de un logger proporciona trazabilidad y facilita la depuración en caso de errores.</li>
</ul>
</li>
</ul>
<ul>
<li class="has-line-data" data-line-start="66" data-line-end="70"><strong><code>utils/</code></strong>:
<ul>
<li class="has-line-data" data-line-start="67" data-line-end="70">Contiene utilidades y funciones generales que pueden ser reutilizadas en diferentes partes de la aplicación.<br>
Este archivo centraliza varias configuraciones y utilidades esenciales para la aplicación, abarcando desde la gestión de rutas de archivos, hasta la configuración de <code>Multer</code> para la carga de archivos, el manejo de autenticación con <code>Passport</code>, y la integración con <code>Swagger</code> para la documentación de la API.</li>
</ul>
</li>
</ul>
<h3 class="code-line" data-line-start=70 data-line-end=71 ><a id="Descripcin_General_70"></a>Descripción General</h3>
<p class="has-line-data" data-line-start="71" data-line-end="72">Est archivo está diseñado para proporcionar funcionalidades de utilidad que son reutilizadas en varias partes de la aplicación. También se encarga de configurar y exportar varios módulos importantes como <code>Multer</code>, <code>Passport</code>, <code>Bcrypt</code>, y <code>Swagger</code>.</p>
<h4 class="code-line" data-line-start=73 data-line-end=74 ><a id="FALTA__FINALIZAR_Configuracin_de_Multer_para_Carga_de_Archivos_73"></a>FALTA  FINALIZAR Configuración de <code>Multer</code> para Carga de Archivos</h4>
<ul>
<li class="has-line-data" data-line-start="75" data-line-end="79">
<p class="has-line-data" data-line-start="75" data-line-end="76"><strong><code>Multer</code> Storage:</strong></p>
<ul>
<li class="has-line-data" data-line-start="76" data-line-end="77">La configuración de <code>Multer</code> se establece para gestionar la carga de archivos en diferentes rutas basadas en el tipo de archivo (<code>profile</code>, <code>product</code>, <code>identificacion</code>, <code>comprobanteProducto</code>, <code>estadoDeCuenta</code>, y otros).</li>
<li class="has-line-data" data-line-start="77" data-line-end="79"><strong>Validación de Tipo de Archivo:</strong> Solo se permiten imágenes y documentos; cualquier otro tipo de archivo es rechazado.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="79" data-line-end="82">
<p class="has-line-data" data-line-start="79" data-line-end="80"><strong><code>upload</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="80" data-line-end="82">Exporta la configuración de <code>Multer</code> para ser utilizada en las rutas donde se gestionan las cargas de archivos.</li>
</ul>
</li>
</ul>
<h4 class="code-line" data-line-start=82 data-line-end=83 ><a id="Autenticacin_con_Passport_82"></a>Autenticación con <code>Passport</code></h4>
<ul>
<li class="has-line-data" data-line-start="84" data-line-end="88"><strong><code>passportCall</code>:</strong>
<ul>
<li class="has-line-data" data-line-start="85" data-line-end="86">Función de middleware que envuelve la autenticación de <code>Passport</code> para diferentes estrategias.</li>
<li class="has-line-data" data-line-start="86" data-line-end="88">Maneja los errores y la respuesta en caso de que la autenticación falle, asegurando que solo usuarios autenticados accedan a rutas protegidas.</li>
</ul>
</li>
</ul>
<h4 class="code-line" data-line-start=88 data-line-end=89 ><a id="Manejo_de_Contraseas_con_Bcrypt_88"></a>Manejo de Contraseñas con <code>Bcrypt</code></h4>
<ul>
<li class="has-line-data" data-line-start="90" data-line-end="93">
<p class="has-line-data" data-line-start="90" data-line-end="91"><strong><code>generaHash</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="91" data-line-end="93">Genera un hash seguro para una contraseña utilizando <code>bcrypt</code>.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="93" data-line-end="96">
<p class="has-line-data" data-line-start="93" data-line-end="94"><strong><code>validaPassword</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="94" data-line-end="96">Compara una contraseña sin hash con su versión hasheada para verificar la autenticidad.</li>
</ul>
</li>
</ul>
<h4 class="code-line" data-line-start=96 data-line-end=97 ><a id="Validacin_de_IDs_de_MongoDB_96"></a>Validación de IDs de MongoDB</h4>
<ul>
<li class="has-line-data" data-line-start="98" data-line-end="101"><strong><code>isValidObjectId</code>:</strong>
<ul>
<li class="has-line-data" data-line-start="99" data-line-end="101">Verifica que un <code>ObjectId</code> de MongoDB sea válido, comparando su formato y valor.</li>
</ul>
</li>
</ul>
<h4 class="code-line" data-line-start=101 data-line-end=102 ><a id="Manejo_de_Errores_Personalizados_101"></a>Manejo de Errores Personalizados</h4>
<ul>
<li class="has-line-data" data-line-start="103" data-line-end="106"><strong><code>CustomError</code>:</strong>
<ul>
<li class="has-line-data" data-line-start="104" data-line-end="106">Clase que permite la creación de errores personalizados con un nombre, causa, mensaje y código de error. Facilita la gestión de errores específicos en la aplicación.</li>
</ul>
</li>
</ul>
<h4 class="code-line" data-line-start=106 data-line-end=107 ><a id="Integracin_con_Swagger_para_Documentacin_106"></a>Integración con <code>Swagger</code> para Documentación</h4>
<ul>
<li class="has-line-data" data-line-start="108" data-line-end="112">
<p class="has-line-data" data-line-start="108" data-line-end="109"><strong>Configuración de <code>Swagger</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="109" data-line-end="110">Define las opciones para la documentación de la API con <code>Swagger</code>, incluyendo el título, versión, y descripción del API.</li>
<li class="has-line-data" data-line-start="110" data-line-end="112"><strong>Especificaciones de Swagger:</strong> Los archivos <code>Carrito.yaml</code> y <code>Productos.yaml</code> se utilizan para generar la documentación de la API.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="112" data-line-end="115">
<p class="has-line-data" data-line-start="112" data-line-end="113"><strong><code>especificacionSwagger</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="113" data-line-end="115">Exporta la especificación de <code>Swagger</code> generada con <code>swaggerJsdoc</code> para su uso en la configuración de la documentación de la API.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="115" data-line-end="118">
<p class="has-line-data" data-line-start="115" data-line-end="116"><strong><code>views/</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="116" data-line-end="118">Almacena las vistas que se renderizan en el lado del servidor, utilizando Handlebars.</li>
</ul>
</li>
</ul>
<h3 class="code-line" data-line-start=118 data-line-end=119 ><a id="Archivos_Clave_118"></a>Archivos Clave</h3>
<ul>
<li class="has-line-data" data-line-start="120" data-line-end="123">
<p class="has-line-data" data-line-start="120" data-line-end="121"><strong><code>.env.development</code> y <code>.env.production</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="121" data-line-end="123">Archivos que contienen las variables de entorno específicas para los entornos de desarrollo y producción.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="123" data-line-end="126">
<p class="has-line-data" data-line-start="123" data-line-end="124"><strong><code>app.js</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="124" data-line-end="126">El archivo principal de la aplicación que inicializa el servidor, configura los middlewares, y define las rutas base.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="126" data-line-end="129">
<p class="has-line-data" data-line-start="126" data-line-end="127"><strong><code>ErrorLog.log</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="127" data-line-end="129">Archivo de log quealmacena los errores ocurridos en la aplicación para su posterior revisión y depuración.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="129" data-line-end="132">
<p class="has-line-data" data-line-start="129" data-line-end="130"><strong><code>utils.js</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="130" data-line-end="132">Archivo que contiene funciones que no pertenecen a ninguna categoría específica pero que son necesarias en varias partes del proyecto.</li>
</ul>
</li>
</ul>
<h3 class="code-line" data-line-start=132 data-line-end=133 ><a id="Directorio_de_Pruebas_132"></a>Directorio de Pruebas</h3>
<ul>
<li class="has-line-data" data-line-start="134" data-line-end="137"><strong><code>test/dao/</code></strong>:
<ul>
<li class="has-line-data" data-line-start="135" data-line-end="137">Contiene los archivos de prueba para los DAOs (<code>cartManager-dao.test.js</code>, <code>productManager-dao.test.js</code>, <code>userManager-dao.test.js</code>), asegurando que las operaciones de acceso a datos funcionen correctamente.</li>
</ul>
</li>
</ul>
<h3 class="code-line" data-line-start=137 data-line-end=138 ><a id="Archivos_de_Configuracin_137"></a>Archivos de Configuración</h3>
<ul>
<li class="has-line-data" data-line-start="139" data-line-end="142">
<p class="has-line-data" data-line-start="139" data-line-end="140"><strong><code>nodemon.json</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="140" data-line-end="142">Archivo de configuración para <code>nodemon</code>, una herramienta que reinicia automáticamente la aplicación cuando detecta cambios en el código.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="142" data-line-end="144">
<p class="has-line-data" data-line-start="142" data-line-end="143"><strong><code>package.json</code> y <code>package-lock.json</code></strong>:</p>
<ul>
<li class="has-line-data" data-line-start="143" data-line-end="144">Archivos que describen las dependencias del proyecto y otras configuraciones relacionadas con el entorno de Node.js.</li>
</ul>
</li>
</ul>
<h3 class="code-line" data-line-start=160 data-line-end=161 ><a id="Testing_160"></a>Testing</h3>
<h3 class="code-line" data-line-start=162 data-line-end=163 ><a id="Pruebas_de_Integracin_para_CartManager_162"></a>Pruebas de Integración para CartManager</h3>
<p class="has-line-data" data-line-start="163" data-line-end="164">Este archivo (cartManager-dao.test.js) contiene pruebas de integración para verificar la funcionalidad del CartManager, que maneja la lógica relacionada con los carritos de compras en la aplicación.</p>
<h5 class="code-line" data-line-start=165 data-line-end=166 ><a id="Descripcin_General_165"></a>Descripción General</h5>
<p class="has-line-data" data-line-start="166" data-line-end="167">Las pruebas aseguran que las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los carritos se realicen correctamente, interactuando directamente con la base de datos MongoDB.</p>
<h5 class="code-line" data-line-start=168 data-line-end=169 ><a id="Configuracin_Inicial_168"></a>Configuración Inicial</h5>
<ul>
<li class="has-line-data" data-line-start="170" data-line-end="173">
<p class="has-line-data" data-line-start="170" data-line-end="171"><strong>Conexión a la Base de Datos:</strong></p>
<ul>
<li class="has-line-data" data-line-start="171" data-line-end="173">Se establece una conexión a MongoDB utilizando Mongoose para interactuar con una base de datos real durante las pruebas.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="173" data-line-end="176">
<p class="has-line-data" data-line-start="173" data-line-end="174"><strong>Cliente HTTP:</strong></p>
<ul>
<li class="has-line-data" data-line-start="174" data-line-end="176">Se utiliza <code>supertest</code> para simular solicitudes HTTP a la API, permitiendo validar el comportamiento del <code>CartManager</code> en un entorno controlado.</li>
</ul>
</li>
</ul>
<h5 class="code-line" data-line-start=176 data-line-end=177 ><a id="Hooks_de_Configuracin_176"></a>Hooks de Configuración</h5>
<ul>
<li class="has-line-data" data-line-start="178" data-line-end="182">
<p class="has-line-data" data-line-start="178" data-line-end="179"><strong><code>before</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="179" data-line-end="180">Antes de ejecutar las pruebas, se realiza una autenticación con credenciales administrativas (<code>email: &quot;admincoder@coder.com&quot;, password: &quot;admin&quot;</code>) para obtener un token JWT y una cookie de sesión.</li>
<li class="has-line-data" data-line-start="180" data-line-end="182">Luego, se crea un carrito de prueba y se guarda su ID (<code>createdCartId</code>) para utilizarlo en las pruebas subsecuentes.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="182" data-line-end="185">
<p class="has-line-data" data-line-start="182" data-line-end="183"><strong><code>afterEach</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="183" data-line-end="185">Después de cada prueba, se elimina el carrito de prueba creado, asegurando que la base de datos quede en un estado limpio para la siguiente ejecución.</li>
</ul>
</li>
</ul>
<h5 class="code-line" data-line-start=185 data-line-end=186 ><a id="Pruebas_Principales_185"></a>Pruebas Principales</h5>
<ol>
<li class="has-line-data" data-line-start="187" data-line-end="190">
<p class="has-line-data" data-line-start="187" data-line-end="188"><strong>Obtener Lista de Carritos:</strong></p>
<ul>
<li class="has-line-data" data-line-start="188" data-line-end="190">Verifica que se pueda recuperar una lista de carritos desde la base de datos y que cada carrito tenga las propiedades esperadas como <code>_id</code>, <code>products</code>, y <code>createdAt</code>.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="190" data-line-end="193">
<p class="has-line-data" data-line-start="190" data-line-end="191"><strong>Crear un Nuevo Carrito:</strong></p>
<ul>
<li class="has-line-data" data-line-start="191" data-line-end="193">Asegura que se pueda crear un nuevo carrito en la base de datos y valida que el carrito creado contenga las propiedades necesarias y correctas.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="193" data-line-end="195">
<p class="has-line-data" data-line-start="193" data-line-end="194"><strong>Agregar Producto a un Carrito:</strong></p>
<ul>
<li class="has-line-data" data-line-start="194" data-line-end="195">Verifica que se pueda agregar un producto a un carrito existente, comprobando que el producto se agregue correctamente y que las propiedades relevantes se actualicen.</li>
</ul>
</li>
</ol>
<h2 class="code-line" data-line-start=197 data-line-end=198 ><a id="Pruebas_de_Integracin_para_Productos_197"></a>Pruebas de Integración para Productos</h2>
<p class="has-line-data" data-line-start="198" data-line-end="199">Este archivo (productos-dao.test.js) contiene pruebas de integración para verificar la funcionalidad relacionada con la gestión de productos en la aplicación.</p>
<h5 class="code-line" data-line-start=200 data-line-end=201 ><a id="Descripcin_General_200"></a>Descripción General</h5>
<p class="has-line-data" data-line-start="201" data-line-end="202">Las pruebas aseguran que las operaciones relacionadas con productos, como la creación, obtención y validación de IDs, funcionen correctamente al interactuar con la base de datos MongoDB y la API de productos.</p>
<h5 class="code-line" data-line-start=203 data-line-end=204 ><a id="Configuracin_Inicial_203"></a>Configuración Inicial</h5>
<ul>
<li class="has-line-data" data-line-start="205" data-line-end="208">
<p class="has-line-data" data-line-start="205" data-line-end="206"><strong>Conexión a la Base de Datos:</strong></p>
<ul>
<li class="has-line-data" data-line-start="206" data-line-end="208">Se establece una conexión a MongoDB utilizando Mongoose antes de ejecutar las pruebas para garantizar la interacción con una base de datos real.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="208" data-line-end="211">
<p class="has-line-data" data-line-start="208" data-line-end="209"><strong>Cliente HTTP:</strong></p>
<ul>
<li class="has-line-data" data-line-start="209" data-line-end="211">Se utiliza <code>supertest</code> para simular solicitudes HTTP a la API de productos, permitiendo probar el comportamiento del sistema en un entorno controlado.</li>
</ul>
</li>
</ul>
<h5 class="code-line" data-line-start=211 data-line-end=212 ><a id="Hooks_de_Configuracin_211"></a>Hooks de Configuración</h5>
<ul>
<li class="has-line-data" data-line-start="213" data-line-end="216">
<p class="has-line-data" data-line-start="213" data-line-end="214"><strong><code>before</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="214" data-line-end="216">Conecta a la base de datos y autentica al usuario administrador para obtener el token y la cookie de sesión necesarios para las solicitudes autenticadas.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="216" data-line-end="219">
<p class="has-line-data" data-line-start="216" data-line-end="217"><strong><code>afterEach</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="217" data-line-end="219">Elimina cualquier producto creado durante las pruebas para mantener la base de datos en un estado limpio.</li>
</ul>
</li>
</ul>
<h5 class="code-line" data-line-start=219 data-line-end=220 ><a id="Pruebas_Principales_219"></a>Pruebas Principales</h5>
<ul>
<li class="has-line-data" data-line-start="221" data-line-end="224">
<p class="has-line-data" data-line-start="221" data-line-end="222"><strong>Obtener Lista de Productos:</strong></p>
<ul>
<li class="has-line-data" data-line-start="222" data-line-end="224">Verifica que se pueda recuperar una lista de productos y que cada producto tenga las propiedades esperadas (<code>_id</code>, <code>title</code>, <code>price</code>, <code>description</code>).</li>
</ul>
</li>
<li class="has-line-data" data-line-start="224" data-line-end="227">
<p class="has-line-data" data-line-start="224" data-line-end="225"><strong>Crear un Nuevo Producto:</strong></p>
<ul>
<li class="has-line-data" data-line-start="225" data-line-end="227">Asegura que se puede crear un nuevo producto y que la respuesta contiene las propiedades correctas, como <code>_id</code>, <code>title</code>, <code>description</code>, <code>price</code>, <code>stock</code>, <code>code</code>, y <code>category</code>.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="227" data-line-end="230">
<p class="has-line-data" data-line-start="227" data-line-end="228"><strong>Obtener Producto por ID:</strong></p>
<ul>
<li class="has-line-data" data-line-start="228" data-line-end="230">Verifica que se pueda recuperar un producto específico por su <code>ID</code> y que el producto tiene las propiedades correctas.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="230" data-line-end="233">
<p class="has-line-data" data-line-start="230" data-line-end="231"><strong>Manejo de IDs de Producto Inválidos:</strong></p>
<ul>
<li class="has-line-data" data-line-start="231" data-line-end="233">Asegura que la API devuelva un error cuando se intenta acceder a un producto con un <code>ID</code> no válido.</li>
</ul>
</li>
</ul>
<h2 class="code-line" data-line-start=233 data-line-end=234 ><a id="Pruebas_de_Integracin_para_UsersManager_233"></a>Pruebas de Integración para UsersManager</h2>
<p class="has-line-data" data-line-start="234" data-line-end="235">Este archivo (userManager-dao.test.js) contiene pruebas de integración para verificar la funcionalidad del UsersManager, que maneja la lógica relacionada con los usuarios en la aplicación.</p>
<h5 class="code-line" data-line-start=236 data-line-end=237 ><a id="Descripcin_General_236"></a>Descripción General</h5>
<p class="has-line-data" data-line-start="237" data-line-end="238">Las pruebas aseguran que las operaciones CRUD (Crear, Leer) sobre los usuarios se realicen correctamente, interactuando directamente con la base de datos MongoDB para validar que la funcionalidad del UsersManager funcione según lo esperado.</p>
<h5 class="code-line" data-line-start=239 data-line-end=240 ><a id="Configuracin_Inicial_239"></a>Configuración Inicial</h5>
<ul>
<li class="has-line-data" data-line-start="241" data-line-end="244">
<p class="has-line-data" data-line-start="241" data-line-end="242"><strong>Conexión a la Base de Datos:</strong></p>
<ul>
<li class="has-line-data" data-line-start="242" data-line-end="244">Se establece una conexión a MongoDB utilizando Mongoose antes de ejecutar las pruebas, garantizando la interacción con una base de datos real.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="244" data-line-end="247">
<p class="has-line-data" data-line-start="244" data-line-end="245"><strong>Cliente HTTP:</strong></p>
<ul>
<li class="has-line-data" data-line-start="245" data-line-end="247">Se utiliza <code>supertest</code> para simular solicitudes HTTP a la API de usuarios, permitiendo validar el comportamiento del <code>UsersManager</code> en un entorno controlado.</li>
</ul>
</li>
</ul>
<h5 class="code-line" data-line-start=247 data-line-end=248 ><a id="Hooks_de_Configuracin_247"></a>Hooks de Configuración</h5>
<ul>
<li class="has-line-data" data-line-start="249" data-line-end="252">
<p class="has-line-data" data-line-start="249" data-line-end="250"><strong><code>before</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="250" data-line-end="252">Se inicializa la instancia de <code>UsersManager</code> para ser utilizada en las pruebas, preparando el entorno para la ejecución de las mismas.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="252" data-line-end="255">
<p class="has-line-data" data-line-start="252" data-line-end="253"><strong><code>afterEach</code>:</strong></p>
<ul>
<li class="has-line-data" data-line-start="253" data-line-end="255">Después de cada prueba, se elimina el usuario de prueba creado para mantener la base de datos limpia y evitar interferencias en las pruebas subsecuentes.</li>
</ul>
</li>
</ul>
<h5 class="code-line" data-line-start=255 data-line-end=256 ><a id="Pruebas_Principales_255"></a>Pruebas Principales</h5>
<ul>
<li class="has-line-data" data-line-start="257" data-line-end="260">
<p class="has-line-data" data-line-start="257" data-line-end="258"><strong>Obtener Lista de Usuarios:</strong></p>
<ul>
<li class="has-line-data" data-line-start="258" data-line-end="260">Verifica que el método <code>getBy</code> del DAO retorne un array de usuarios. Además, se asegura de que cada usuario en el array tenga propiedades básicas como <code>_id</code> y <code>email</code>.</li>
</ul>
</li>
<li class="has-line-data" data-line-start="260" data-line-end="264">
<p class="has-line-data" data-line-start="260" data-line-end="261"><strong>Crear un Nuevo Usuario:</strong></p>
<ul>
<li class="has-line-data" data-line-start="261" data-line-end="262">Asegura que se pueda crear un nuevo usuario en la base de datos y que el usuario creado tenga un ID válido (<code>_id</code>) y que las propiedades principales (<code>first_name</code>, <code>last_name</code>, <code>email</code>, etc.) se guarden correctamente.</li>
<li class="has-line-data" data-line-start="262" data-line-end="264"></li>
</ul>
</li>
</ul>
=======
##  Comandos para iniciar proyecto desde terminal   

    git clone ( URL REPO )    
    cd (nombre de carpeta)   
    npm install   
    npm start    
>>>>>>> 61656d201c96c58cf62b8bdef5b04c2da110d5c0
