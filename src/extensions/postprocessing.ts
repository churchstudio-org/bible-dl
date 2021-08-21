import { BibleToolbox } from "../interfaces/bible-toolbox";
import { GluegunFilesystem } from 'gluegun';

export class PostprocessingExtension {
    constructor(
        private filesystem: GluegunFilesystem,
    ) {}

    save(filepath: string, extension: string, data: any[]): string {
        const filename: string = this.filesystem.inspect(filepath).name;
        const output: string = filepath
            .replace(filename, `${filename.split('.')[0]}.${extension}`);

        this.filesystem.write(output, data);

        return output;
    }
}

module.exports = (toolbox: BibleToolbox) => {
    toolbox.postprocessing = new PostprocessingExtension(toolbox.filesystem);
};