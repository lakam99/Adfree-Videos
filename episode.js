const { Cheerio } = require("cheerio");
const { v4 } = require("uuid");
const server_url = '####';

function Episode(episode_btn, season) {
    this.title = episode_btn.attribs.title;
    this.url = episode_btn.attribs.onclick.substring(19).replace(/'/g,'').replace(')','');
    this.season = season;
    this.prev = undefined;
    this.next = undefined;
    this.id = v4();

    this.get_btn = () => {
        return `
        <a href='${server_url}/watch?season=${this.season.id}&episode=${this.id}'>${this.title}</a>
        `
    }

    this.get_episode = () => {
        return `
        <head><title>${this.season.title}&nbsp;:&nbsp;${this.title}</title></head>
        <body>
            <a href='${server_url}/search?title=${season.search_query}'>Back to Results</a><h1 style='display:block;text-align:center'>${this.season.title}&nbsp;:&nbsp;${this.title}</h1>
            <div style='display:flex;justify-content:space-between'>
                ${this.prev ? '<a href="' + server_url + "/watch?season=" + this.prev.season.id + "&episode=" + this.prev.id + '">Previous</a>' : '<a href="#">&nbsp;</a>'}
                <a href='${server_url}/home'>Home</a>
                ${this.next ? '<a href="' + server_url + "/watch?season=" + this.next.season.id + "&episode=" + this.next.id + '">Next</a>' : '<a href="#">&nbsp;</a>'}
            </div>
            <iframe id='episode' sandbox = "allow-same-origin allow-scripts" src="${this.url}" mozallowfullscreen="true" width="100%" height="100%" frameborder="0"></iframe>
            <p>
        </body>

        `
    }
}

module.exports = {Episode};