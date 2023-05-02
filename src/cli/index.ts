import chalk from 'chalk';
import { Command } from 'commander';
import { LogikLanguageMetaData } from '../server/language/module';
import { createLogikServices } from '../server/logik-module';
import { extractAstDocument, extractDestinationAndName } from './cli-util';
import { NodeFileSystem } from 'langium/node';
import path from 'path';
import fs from 'fs';
import { LangiumDiagramGeneratorArguments } from 'langium-sprotty';
import { CancellationToken } from 'vscode-languageclient';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createLogikServices(NodeFileSystem).logik;
    const document = await extractAstDocument(fileName, services);
    const diagramGenerator = services.diagram.DiagramGenerator;
    const root = await diagramGenerator.generate(<LangiumDiagramGeneratorArguments>{
        document,
        cancelToken: CancellationToken.None
    });
    const generatedJSON =  JSON.stringify(root, undefined, 2)

    // handle file related functionality here now
    const data = extractDestinationAndName(fileName, opts.destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.json`;
    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, generatedJSON);

    console.log(chalk.green(`JSON object generated successfully: ${generatedFilePath}`));
};

export enum OutputFormat {
    relay, gate
}

export type GenerateOptions = {
    destination?: string;
    format?: OutputFormat;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);

    const fileExtensions = LogikLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .option('-f, --format <format>', 'generation format (possible formats: gate, relay)')
        .description('generates Logik commands that can be used as drawing instructions')
        .action(generateAction);

    program.parse(process.argv);
}
