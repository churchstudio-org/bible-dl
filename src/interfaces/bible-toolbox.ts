import { Toolbox } from "gluegun/build/types/domain/toolbox";
import { BooksExtension } from "../extensions/books";
import { DownloadExtension } from "../extensions/download";
import { PostprocessingExtension } from "../extensions/postprocessing";
import { PreprocessingExtension } from "../extensions/preprocessing";

export interface BibleToolbox extends Toolbox {
    books: BooksExtension;
    download: DownloadExtension;
    preprocessing: PreprocessingExtension;
    postprocessing: PostprocessingExtension;
}