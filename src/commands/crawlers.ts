import { CrawlerHelper } from "bible-crawler";
import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
    name: 'crawlers',
    description: 'List available crawlers',
    run: toolbox => {
        const crawlers = CrawlerHelper
            .list()
            .map(e => [e.name, e.website, e.languages().join()]);

        toolbox.print.table([
            ['Crawler', 'Website', 'Languages'],
            ...crawlers,
        ]);
    }
}

module.exports = command;