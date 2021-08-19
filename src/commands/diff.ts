import { GluegunCommand } from "gluegun";
import { BibleVersions, BookOf, ChaptersOf, Language } from "../../../bible-crawler/dist";
import { BibleToolbox } from "../interfaces/bible-toolbox";

const command: GluegunCommand<BibleToolbox> = {
    name: 'diff',
    description: 'Compare bible.json files',
    run: ({ books, filesystem, print, parameters }) => {
        var versions: BibleVersions = parameters.options;
        var languages: Language[] = Object.keys(versions) as Language[];
        var result: [string, boolean, boolean, number[]][] = books
            .list()
            .map(e => [e, true, true, []]);

        for (var language1 of languages) {
            var bible1: string[][][] = filesystem.read(versions[language1], 'json');

            for (var language2 of languages.filter(e => e != language1)) {
                var bible2: string[][][] = filesystem.read(versions[language2], 'json');

                for (var book of books.list()) {
                    var bookIndex = BookOf[book] - 1;
                    
                    if (bible1[bookIndex].length != bible2[bookIndex].length) {
                        result[bookIndex][1] = false;
                    }

                    for (var chapter = 0; chapter < ChaptersOf[book]; chapter++) {
                        if (bible1[bookIndex][chapter].length != bible2[bookIndex][chapter].length) {
                            result[bookIndex][2] = false;
                            
                            if (!result[bookIndex][3].includes(chapter + 1)) {
                                result[bookIndex][3].push(chapter + 1);
                                result[bookIndex][3].sort((a, b) => a - b);
                            }
                        }
                    }
                }
            }
        }

        print.table([
            ['Book', 'Chapters', 'Verses'],
            ...result.map(([book, chapters, verses, list]) => {
                var success = print.colors.success('√');
                var error = print.colors.error('×');

                return [
                    book,
                    chapters ? success : error,
                    verses ? success : error,
                    list.join(),
                ];
            }),
            [
                print.colors.error('Failed'),
                null,
                null,
                print.colors.error(`${[]
                    .concat
                    .apply([], result.map(e => e[3]))
                    .length
                    .toString()} chapters`),
            ],
        ]);
    }
}

module.exports = command;