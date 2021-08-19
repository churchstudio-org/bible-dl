import { GluegunCommand } from "gluegun";
import { BibleToolbox } from "../interfaces/bible-toolbox";

const command: GluegunCommand<BibleToolbox> = {
    name: 'merge',
    description: 'Merge book.json files to create a bible.json',
    run: ({ books, filesystem, parameters, print }) => {
        var target = parameters.first ?? '';

        print.muted(`- Read book files from ${target || 'current directory'}`);
    
        if (!target) {
            print.warning('* It\'s possible to change the target directory');
            print.warning(`* e.g. bible-dl merge path/to/books`);
        } else if (target[target.length - 1] != '/') {
            target += '/';
        }

        try {
            var bible = [];
            var merge = books
                .list()
                .map(e => e.toLowerCase());

            for (var book of merge) {
                var filepath = `${target}${book}.json`;
                var content = filesystem.read(filepath, 'json');

                bible.push(content);
            }

            var filepath = `${target}bible.json`;

            filesystem.write(filepath, bible);

            print.success('- Merge successed');
        } catch (e) {
            print.error('- Merge failed');
            print.error(e);
        }
    }
}

module.exports = command;