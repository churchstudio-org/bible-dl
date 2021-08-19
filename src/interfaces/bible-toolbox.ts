import { Toolbox } from "gluegun/build/types/domain/toolbox";
import { BooksExtension } from "../extensions/books";
import { DownloadExtension } from "../extensions/download";

export interface BibleToolbox extends Toolbox {
    books: BooksExtension;
    download: DownloadExtension;
}