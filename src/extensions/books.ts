import { BookOf } from "bible-crawler";
import { BibleToolbox } from "../interfaces/bible-toolbox";

export class BooksExtension {
    list(): string[] {
        return Object
            .values(BookOf)
            .splice(0, BookOf.Revelation) as string[];
    }
}

module.exports = (toolbox: BibleToolbox) => {
    toolbox.books = new BooksExtension();
};