var express = require('express');
var showSearcher = require('./showSearcher').showSearcher;
const server_url = 'nsercpasakon.zapto.org';
const path = require('path');

var showShower = {
    server: undefined,

    setup() {
        showShower.server = express();
        showShower.requests();
        showShower.start_server();
    },

    requests() {
        showShower.server.get('/home', (req,res)=>{
            res.sendFile(path.join(__dirname,'home.html'))
        })
        showShower.server.get('/search', (req,res)=>{
            let query = req.query.title;
            if (!query) {res.sendStatus(404)} else {
                showSearcher.get_show(query).then(()=>{
                    res.send(showSearcher.display_seasons());
                })
            }
        });
        showShower.server.get('/show', (req,res)=>{
            let query = req.query.title;
            if (!query) {res.sendStatus(404)} else {
                let season = showSearcher.get_season_by_id(query);
                if (season) {
                    season.get_season_episodes().then((episodes)=>{
                        let r = ``;
                        episodes.forEach((episode_ob)=>{
                            r += `<p>${episode_ob.get_btn()}</p>`;
                        });
                        res.send(r);
                    })
                } else {
                    res.sendStatus(404);
                }
            }
        });
        showShower.server.get('/watch', (req,res)=>{
            let query = req.query;
            if (!query) {res.sendStatus(404)} else {
                let season = showSearcher.get_season_by_id(query.season);
                if (!season) {res.sendStatus(404)} else {
                    let episode = season.get_episode_by_id(query.episode);
                    if (!episode) {res.sendStatus(404)} else {
                        res.send(episode.get_episode());
                    }
                }
            }
        })
    },

    start_server() {
        showShower.server.listen('6942', '0.0.0.0', ()=>{
            console.log("Listening at http:6942//0.0.0.0");
        })
    }
}

showShower.setup('k');

module.exports = {server_url};