import dotenv from'dotenv';
import { Command, Option } from'commander';

const programa = new Command();

// Definir modo con posibles valores y valor por defecto
programa.addOption(
    new Option('-m, --mode <modo>', 'Mode de ejecución del script')
        .choices(['dev', 'prod'])
        .default('dev')
);

programa.parse(process.argv);

const options = programa.opts();

dotenv.config({
    path: options.mode === 'prod' ? './src/.env.production' : './src/.env.development',
    override: true
});

export const configVarEntorno = 
{ 
    PORT: process.env.PORT || 3001
};

export const configEntornoClusterMDB = {
    CLUSTER: process.env.MONGODB
};
