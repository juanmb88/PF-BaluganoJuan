/* import dotenv from 'dotenv'
dotenv.config({
    path: './src/.env',
    override : true
});

export const configVarEntorno = { 
    PORT : process.env.PORT || 3001
};

export const configEntornoClusterMDB = {
    CLUSTER: process.env.MONGODB
};
 */
import dotenv from'dotenv';
import { Command, Option } from'commander';

// Crear una nueva instancia de Command
const programa = new Command();

// Definir la opción de modo con sus posibles valores y valor por defecto
programa.addOption(
    new Option('-m, --mode <modo>', 'Mode de ejecución del script')
        .choices(['dev', 'prod'])
        .default('dev')
);

// Parsear los argumentos de la línea de comandos
programa.parse(process.argv);

// Obtener las opciones seleccionadas
const options = programa.opts();

// Cargar las variables de entorno correspondientes al modo seleccionado
dotenv.config({
    path: options.mode === 'prod' ? './src/.env.production' : './src/.env.development',
    override: true
});

// Exportar las configuraciones
export const configVarEntorno = 
{ 
    PORT: process.env.PORT || 3001
};

export const configEntornoClusterMDB = {
    CLUSTER: process.env.MONGODB
};
