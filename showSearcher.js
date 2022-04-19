const request = require('request');
const cheerio = require('cheerio');
const { season,steal_from } = require('./season');
const MAX_PAGE = 5;

var showSearcher = {
    search_url: steal_from + "/search-query/",
    current_show: {
        title: undefined,
        seasons: undefined
    },

    get_season_by_id(id) {
        return showSearcher.current_show.seasons.find((season_ob)=>season_ob.id == id);
    },
    
    search(show_name) {
        return new Promise((resolve,reject)=>{
            request({
                url: showSearcher.search_url + show_name.replace(' ','+'),
                type: 'get'
            }, (e,r,b)=>{
                resolve(cheerio.load(b));
            })
        })
    },

    display_seasons() {
        var r = '';
        showSearcher.current_show.seasons.forEach((s)=>{
            r += `<p><a href='${s.season_url}'>${s.title}</a></p>`;
        });
        return r;
    },

    *get_rest_of_show(show_name) {
        var next_available = true;
        var page_num = 2;
        while (next_available && page_num < MAX_PAGE) {
            yield new Promise((resolve, reject)=>{
                showSearcher.search(show_name+"?page="+page_num++).then((page)=>{
                    let results = page('.ml-item');
                    if (results.length) {
                        let seasons = page('.ml-item > a');
                        seasons = [...seasons.map((i,season_elem)=>{
                            return new season(season_elem);
                        })].filter((show_instance)=>{
                            return show_instance.title.toLowerCase().includes(show_name.toLowerCase());
                        });
                        showSearcher.current_show.seasons  = showSearcher.current_show.seasons.concat(seasons);
                        showSearcher.current_show.seasons.sort((a,b)=>a.title.localeCompare(b.title, undefined, {numeric: true}));
                        resolve(true);
                    } else {
                        next_available = false;
                        resolve(false);
                    }
                })
            })
        }
    },

    get_show(show_name) {
        return new Promise((resolve,reject)=>{
            showSearcher.search(show_name).then((page)=>{
                let results = page('.ml-item');
                if (results.length) {
                    showSearcher.current_show.title = show_name;
                    showSearcher.current_show.seasons = seasons = page('.ml-item > a');
                    showSearcher.current_show.seasons = [...showSearcher.current_show.seasons.map((i,season_elem)=>{
                        return new season(season_elem);
                    })].filter((show_instance)=>{
                        return show_instance.title.toLowerCase().includes(show_name.toLowerCase());
                    }).sort((a,b)=>a.title.localeCompare(b.title, undefined, {numeric: true}));
                    
                    let page_nums = [...page('ul.pagination > li > a')].map(e=>e.children[0].data).filter(e=>!isNaN(e));

                    if (page_nums.length > 0) {
                        Promise.all([...showSearcher.get_rest_of_show(show_name)]).then(d=>resolve(d),e=>console.log(e));
                    } else {
                        resolve(true);
                    }
                } else {
                    console.log(e);
                }
            });
        })
    }
}

module.exports =  {showSearcher};