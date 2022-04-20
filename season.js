var cheerio = require('cheerio');
const request = require('request');
const { v4 } = require('uuid');
const { Episode } = require('./episode');
const server_url = '####';
const steal_from = "https://ww1.123moviesfree.net";

function season(html_result_elem, show_name) {
    this.title = cheerio.load(html_result_elem)('img')[0].attribs.alt;
    this.url = steal_from + html_result_elem.attribs.href + '/watching.html';
    this.id = v4();
    this.season_url = server_url + '/show?title=' + this.id;
    this.episodes = undefined;
    this.search_query = show_name;

    this.get_season_req = () => {
        return new Promise((resolve,reject)=>{
            request({
                url: this.url,
                type: 'get'
            },(e,r,b)=>{
                resolve(cheerio.load(b));
            })
        });
    }

    this.get_season_episodes = () => {
        return new Promise((resolve,reject)=>{
            this.get_season_req().then((season_page)=>{
                var episodes_links = season_page('.les-content > a');
                if (episodes_links.length) {
                    episodes = episodes_links.map((i,link_elem)=>{
                        return new Episode(link_elem, this);
                    })
                    this.episodes = [...episodes].sort((a,b)=>{a.title.localeCompare(b, undefined, {numeric: true})});
                    this.map_episodes();
                    resolve(this.episodes);
                } else {
                    throw "Couldn't retrieve episodes";
                }
            })
        })
    }

    this.map_episodes = () => {
        for (var i = 0; i < this.episodes.length; i++) {
            if (i - 1 >= 0) {
                this.episodes[i].prev = this.episodes[i - 1];
            }
            if (i + 1 < this.episodes.length) {
                this.episodes[i].next = this.episodes[i + 1];
            }
        }
    }

    this.get_episode_by_id = (id) => {
        return this.episodes.find((e)=>e.id == id);
    }

    return this;
}

module.exports = {season, steal_from, server_url};