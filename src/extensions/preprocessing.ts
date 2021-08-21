import { BibleToolbox } from "../interfaces/bible-toolbox";

export class PreprocessingExtension {
    wait(delay: number) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    
    async chaptersOf(bible: string[][][], transform: (chapter: string[]) => string[] | Promise<string[]>, delay: number = 0) {
        for (var book = 0; book < bible.length; book++) {
            for (var chapter = 0; chapter < bible[book].length; chapter++) {
                bible[book][chapter] = await transform(bible[book][chapter]);
                delay && await this.wait(delay);
            }
        }
    }

    async versesOf(bible: string[][][], transform: (verse: string) => string | Promise<string>, delay: number = 0) {
        for (var book = 0; book < bible.length; book++) {
            for (var chapter = 0; chapter < bible[book].length; chapter++) {
                for (var verse = 0; verse < bible[book][chapter].length; verse++) {
                    bible[book][chapter][verse] = await transform(bible[book][chapter][verse]);
                    delay && await this.wait(delay);
                }
            }
        }
    }
}

module.exports = (toolbox: BibleToolbox) => {
    toolbox.preprocessing = new PreprocessingExtension();
};