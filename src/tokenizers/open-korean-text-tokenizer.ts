import fetch from 'cross-fetch';

export type OpenKoreanTextTokens = {
    tokens: string[];
    token_strings: string[];   
}

export class OpenKoreanTextTokenizer {
    url: string = "https://open-korean-text.herokuapp.com/tokenize?text=";

    async tokenize(text: string): Promise<OpenKoreanTextTokens> {
        text = encodeURIComponent(text);
        return await fetch(this.url + text).then<OpenKoreanTextTokens>(e => e.json());
    }
}