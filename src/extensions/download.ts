import { BookOf, IBibleCrawler, Language } from 'bible-crawler';
import { GluegunFilesystem, GluegunPrint } from 'gluegun';
import ora = require('ora');
import { spinners } from '../constants/spinners';
import { BibleToolbox } from '../interfaces/bible-toolbox';
import { BooksExtension } from './books';

export class DownloadExtension {
    constructor(
        private books: BooksExtension,
        private filesystem: GluegunFilesystem,
        private print: GluegunPrint, 
    ) {}

    async start(crawler: IBibleCrawler, language: Language, book: BookOf, chapter: number, output: string) {
        if (!book) {
            var bible = [];

            for (var bookTitle of this.books.list() as string[]) {
                const spinner = this.print.spin({
                    text: `Reading ${bookTitle}`,
                    spinner: spinners.point,
                });

                var filename = bookTitle.toLowerCase();
                var content: any[] = await crawler.readAllChapters(BookOf[bookTitle], language);

                this.save(output, filename, content, spinner);

                bible.push(content);
            }

            this.save(output, 'bible', bible);
        } else if (book && !chapter) {
            const spinner = this.print.spin({
                text: `Reading ${BookOf[book]}`,
                spinner: spinners.point,
            });
                
            var filename = BookOf[book].toLowerCase();
            var content: any[] = await crawler.readAllChapters(book, language);
            
            this.save(output, filename, content, spinner);
        } else {
            const spinner = this.print.spin({
                text: `Reading ${BookOf[book]} chapter ${chapter}`,
                spinner: spinners.point,
            });

            var filename = `${BookOf[book].toLowerCase()}_${chapter}`;
            var content: any[] = await crawler.read(book, chapter, language);
            
            this.save(output, filename, content, spinner);
        }
    }

    async save(directory: string, filename: string, data: any[], spinner?: ora.Ora) {
        var filepath = `${directory}${filename}.json`;

        this.filesystem.write(filepath, data);
        
        if (spinner) {
            spinner.succeed(`Saved ${filepath}`);
        } else {
            this.print.success(`√ Saved ${filepath}`);
        }
    }
}

module.exports = (toolbox: BibleToolbox) => {
    const { books, filesystem, print } = toolbox;
    toolbox.download = new DownloadExtension(books, filesystem, print);
};