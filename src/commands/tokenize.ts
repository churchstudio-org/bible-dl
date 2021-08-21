import { GluegunCommand } from "gluegun";
import { AggressiveTokenizer, AggressiveTokenizerPt, TokenizerJa } from "natural";
import { LanguageCode } from "stopword";
import { BibleToolbox } from "../interfaces/bible-toolbox";
import { OpenKoreanTextTokenizer } from "../tokenizers/open-korean-text-tokenizer";

const command: GluegunCommand<BibleToolbox> = {
    name: 'tokenize',
    description: 'Tokenize each verse from bible.json',
    run: async ({ filesystem, parameters, postprocessing, preprocessing, print }) => {
        const filepath: string = parameters.first;
        const languageCode: LanguageCode = parameters.second as LanguageCode;
        const bible: string[][][] = filesystem.read(filepath, 'json');

        if (languageCode == 'en') {
            const tokenizer = new AggressiveTokenizer();
            await preprocessing.versesOf(bible, verse => tokenizer.tokenize(verse).join(' '));
        } else if (languageCode == 'ja') {
            const tokenizer = new TokenizerJa();
            await preprocessing.versesOf(bible, verse => tokenizer.tokenize(verse).join(' '));
        } else if (languageCode == 'ko') {
            const tokenizer = new OpenKoreanTextTokenizer();

            await preprocessing.versesOf(bible, async verse => {
                try {
                    var tokens = await tokenizer.tokenize(verse);

                    return tokens
                        .tokens
                        .map((e, i) => [e, tokens.token_strings[i]])
                        .filter(([token, _]) => !token.match('Foreign'))
                        .filter(([token, _]) => !token.match('Punctuation'))
                        .map(([_, word]) => word)
                        .join(' ');
                } catch {
                    print.error(`Failed to tokenize verse '${verse}'`);
                    return verse;
                }
            }, 1000);
        } else if (languageCode == 'pt') {
            const tokenizer = new AggressiveTokenizerPt();
            await preprocessing.versesOf(bible, verse => tokenizer.tokenize(verse).join(' '));
        } else if (languageCode == null) {
            print.error('You forgot to set the language code');
            print.error('e.g. bible-dl tokenize bible.json en');

            return;
        } else {
            print.error(`This language (${languageCode}) has no tokenizers available`);
            return;
        }

        print.success(`File saved as ${postprocessing.save(filepath, 'tokens.json', bible)}`);
    },
};

module.exports = command;