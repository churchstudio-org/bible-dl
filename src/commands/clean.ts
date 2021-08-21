import { GluegunCommand } from "gluegun";
import { LanguageCode, removeStopwords } from "stopword";
import stopword = require("stopword");
import { BibleToolbox } from "../interfaces/bible-toolbox";

const command: GluegunCommand<BibleToolbox> = {
    name: 'clean',
    description: 'Remove stopwords from bible.json',
    run: async ({ filesystem, parameters, postprocessing, preprocessing, print }) => {
        const filepath: string = parameters.first;
        const languageCode: LanguageCode = parameters.second as LanguageCode;
        const bible: string[][][] = filesystem.read(filepath, 'json');

        await preprocessing.versesOf(bible, (verse) => {
            var tokens = verse.split(' ');
            return removeStopwords(tokens, stopword[languageCode]).join(' ');
        });

        print.success(`File saved as ${postprocessing.save(filepath, 'clean.json', bible)}`);
    },
};

module.exports = command;