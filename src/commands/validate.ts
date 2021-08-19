import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
    name: 'validate',
    description: 'Validate a bible.json',
    run: ({ filesystem, parameters, print }) => {
        var filepath = parameters.first;
        var bible: string[][][] = filesystem.read(filepath, 'json');
        var chapters: string[][] = [].concat.apply([], bible as any[]);
        var verses: string[] = [].concat.apply([], chapters as any[]);

        if (bible.length == 66) {
            print.success('√ Bible has 66 books');
        } else {
            print.error(`× Bible has ${bible.length} books`);
        }

        if (chapters.length == 1189) {
            print.success('√ Bible has 1189 chapters');
        } else {
            print.error(`× Bible has ${chapters.length} chapters`);
        }

        if (verses.length >= 30000) {
            print.success(`√ Bible has ${verses.length} verses`);
        } else {
            print.error(`× Bible has ${verses.length} verses`);
        }
    }
}

module.exports = command;