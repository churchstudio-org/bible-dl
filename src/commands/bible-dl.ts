import { BookOf, ChaptersOf, CrawlerHelper, IBibleCrawler, Language } from "bible-crawler";
import { GluegunCommand } from "gluegun";
import { BibleToolbox } from "../interfaces/bible-toolbox";

const command: GluegunCommand<BibleToolbox> = {
    name: 'bible-dl',
    description: 'Download bible from website',
    run: async ({ books, download, parameters, print, prompt }) => {
        var book: BookOf;
        var chapter: number;
        var crawler: IBibleCrawler;
        var language: Language;
        var output: string = parameters.first ?? '';
        var confirm: boolean = false;

        var { bookOption } = await prompt.confirm('Download Genesis to Apocalipse?')
            ? { bookOption: null }
            : await prompt.ask({
                name: 'bookOption',
                message: 'Select a book',
                type: 'autocomplete',
                choices: books.list(),
            });

        book = bookOption ? parseInt(BookOf[bookOption]) : null;
        chapter = 0;

        var downloadChapter = bookOption && parseInt(ChaptersOf[bookOption]) > 1
            ? !(await prompt.confirm(`Download all chapters of ${bookOption}?`))
            : false;

        if (downloadChapter) {
            var min = 1;
            var max = parseInt(ChaptersOf[bookOption]);

            while (chapter < min || chapter > max) {
                await prompt.ask({
                    name: 'chapterOption',
                    message: `Type a chapter between ${min} - ${max}`,
                    type: 'numeral',
                    validate: (value) => {
                        chapter = parseInt(value);

                        if (chapter < min)
                            return `Chapter is smaller than ${min}`;

                        if (chapter > max)
                            return `Chapter is greater than ${max}`;

                        return true;
                    }
                });
            }
        }

        const { crawlerOption } = await prompt.ask({
            name: 'crawlerOption',
            message: 'Select a crawler',
            type: 'select',
            choices: CrawlerHelper.list().map(e => e.name),
        });

        crawler = CrawlerHelper.find(crawlerOption);

        const { languageOption } = await prompt.ask({
            name: 'languageOption',
            message: 'Select a language',
            type: 'select',
            choices: crawler.languages()
        });

        language = languageOption as Language;

        print.muted(`- File(s) will be saved on ${output || 'current directory'}`);
    
        if (!output) {
            print.warning('* It\'s possible to change the output directory');
            print.warning(`* e.g. bible-dl output/${language}`);
        } else if (output[output.length - 1] != '/') {
            output += '/';
        }

        if (!book) {
            confirm = await prompt.confirm(`Confirm download from Genesis to Apocalipse (${language})`, true);
        } else if (book && !chapter) {
            confirm = await prompt.confirm(`Confirm download of ${bookOption} (${language})`, true);
        } else {
            confirm = await prompt.confirm(`Confirm download of ${bookOption} chapter ${chapter} (${language})`, true);
        }

        if (confirm) {
            try {
                print.info('\n');
                print.info(crawler.attribution);
                print.info(crawler.website);
                print.info('\n');

                await download.start(crawler, language, book, chapter, output);
                
                print.success('- Download successed');
            } catch (e) {
                print.error('- Download failed');
                print.error(e);
            }
        }
    }
}

module.exports = command;