const { Cheerio } = require("cheerio");
const { v4 } = require("uuid");
const { showSearcher } = require("./showSearcher");
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
        <h1 style='display:block;text-align:center'>${this.season.title}&nbsp;:&nbsp;${this.title}</h1>
        <div style='display:flex;justify-content:space-between'>
            ${this.prev ? '<a href="' + server_url + "/watch?season=" + this.prev.season + "&episode=" + this.prev.id + '">Previous</a>' : '<a href="#" disabled>Previous</a>'}
            <a href='${server_url}/home'>Home</a>
            ${this.next ? '<a href="' + server_url + "/watch?season=" + this.next.season + "&episode=" + this.next.id + '">Next</a>' : '<a href="#" disabled>Previous</a>'}
        </div>
        <iframe id='episode' sandbox = "allow-same-origin allow-scripts" src="${this.url}" mozallowfullscreen="true" width="100%" height="100%" frameborder="0"></iframe>
        <p>

        `
    }
}

module.exports = {Episode};