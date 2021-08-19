import { ChaptersOf, VersesOf } from "bible-crawler";
import { GluegunCommand } from "gluegun";
import { BibleToolbox } from "../interfaces/bible-toolbox";

const command: GluegunCommand<BibleToolbox> = {
    name: 'books',
    description: 'List bible books',
    run: ({ books, print }) => print.table([
        ['Book', 'Chapters', 'Verses'],
        ...books
            .list()
            .map(e => [e, ChaptersOf[e], VersesOf[e]]),
    ]),
};

module.exports = command;