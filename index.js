// const http = require("http");
import express from "express";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
// import request from "request-promise";
// var cors = require('cors');
// import casper from "casper";
import cors from "cors";
// import "./global.js";
// import "./hamfunction.js"
import puppeteer from "puppeteer";
import fs from "fs";
import { config } from "dotenv";

// pupperter cache dir
// const cacheDir = process.env.PUPPETEER_CACHE_DIR || "/tmp/puppeteer_cache";

// if (!fs.existsSync(cacheDir)) {
//   fs.mkdirSync(cacheDir, { recursive: true });
//   fs.chmodSync(cacheDir, "0777"); // Set permissions if necessary
// }

// express class 
var app = express();
// main url "https://www1.myasiantv.cc/" ||
const base_url =  "https://www.myasiantv.ac/";
// app.use(express.json())

// header

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Home req get
app.get("/drama/home", (req, res) => {
  try {
    const data = async (base_url) => {
      var datas = [];
      var slide_data = [];
      var recent_sub = {
        korean_sub: [],
        raw_epi: [],
        other_sub: [],
      };
      var movies = [];

      const response = await fetch(base_url)
        .then((res) => res.text())
        .then((text) => {
          return text;
        })
        .catch((err) => {
          console.log(err);
        });
      const $ = cheerio.load(response);
      // console.log(response);

      let slide_img = $('ul[id="movie-random-list"] > li'); // slide detail
      let korean_sub = $('div[class="loadep intro1"] > ul > li'); // recent korean subbed
      let raw_epi = $('div[class="loadep intro2"] > ul > li'); // recent RAW episode
      let other_sub = $('div[class="loadep intro3"] > ul > li'); // recent other subbed
      let movie_data = $("#list-1 > div:nth-child(2) > ul > li"); // Home page movies

      // console.log(movies.length)

      // slide img
      slide_img.each((i, el) => {
        let name = $(el).find("p").text().trim();
        let link = $(el).find("a").attr("href");
        let image = $(el).attr("style").split("url(")[1].split(")")[0];

        slide_data.push({
          name,
          link,
          image,
        });
      });

      // korean sub
      korean_sub.each((i, el) => {
        let name = $(el).find("a").text().trim();
        let link = $(el).find("a").attr("href");

        recent_sub.korean_sub.push({
          name,
          link,
        });
      });

      // raw episode
      raw_epi.each((i, el) => {
        let name = $(el).find("a").text().trim();
        let link = $(el).find("a").attr("href");

        recent_sub.raw_epi.push({
          name,
          link,
        });
      });

      // other subbed
      other_sub.each((i, el) => {
        let name = $(el).find("a").text().trim();
        let link = $(el).find("a").attr("href");

        recent_sub.other_sub.push({
          name,
          link,
        });
      });

      // Movie data
      movie_data.each((i, el) => {
        let name = $(el).find("a").text().trim();
        let link = $(el).find("a").attr("href");
        let image = $(el).find("img").attr("src");

        movies.push({
          name,
          link,
          image,
        });
      });

      // main push
      datas.push({
        slide_img: slide_data,
        recent_sub,
        movies,
      });

      res.send(datas);
    };
    data(base_url);
  } catch (e) {
    res.send({ message: e.message });
  }
});

// top get
app.get("/drama/top/:day", (req, res) => {
  const choice = req.params.day;

  try {
    const data = async (choice) => {
      var datas = [];
      var top_data = [];

      var url = "";
      switch (choice) {
        case "month":
          url = base_url + "anclytic.html?id=3";
          break;
        case "week":
          url = base_url + "anclytic.html?id=2";
          break;
        default:
          url = base_url + "anclytic.html?id=1";
          break;
      }

      const response = await fetch(url)
        .then((res) => res.text())
        .then((text) => {
          return text;
        })
        .catch((err) => console.log(err));
      const $ = cheerio.load(response);

      let top = $("body > div");

      if (choice === "day") {
        top = $("body > div"); // top day
      }
      if (choice === "week") {
        top = $("body > div"); // top week
      }
      if (choice === "month") {
        top = $("body > div"); // top month
      }

      // top loop
      top.each((i, el) => {
        let name = $(el).find("h2").text().trim();
        let link = $(el).find("a").attr("href");
        let image = $(el).find("img").attr("src");

        top_data.push({
          name,
          image,
          link,
        });
      });

      // main push
      datas.push({
        result: top_data,
      });

      res.send(datas);
    };
    data(choice);
  } catch (e) {
    res.send({ message: e.message });
  }
});

// trnding
// app.get('/home/:q',(req,res)=>{
//     const querry = req.params.q;

//     const data = async (q)=>{
//         var datas = [];
//         var result = [];

//         var url = base_url+'ajax/drama_by_status/1.html?page=1';
//         switch (q) {
//             case 'air':
//                 url = base_url+'ajax/drama_by_status/2.html?page=1';
//                 break;

//             case 'completed':
//                 url = base_url+'ajax/drama_by_status/3.html?page=1';
//                 break;

//             default:
//                 url = base_url+'ajax/drama_by_status/2.html?page=1';
//                 break;
//         };
//         console.log(q,url)

//         const response = await fetch(url).then((res)=>res.text()).then((text)=>{return text}).catch((err)=>console.log(err));
//         const $ = cheerio.load(response);

//         let trending_data = $('div[id="list-1"] > div > ul > li') // movies
//         if (q === 'movie'){
//             trending_data = $('div[id="list-1"] > div > ul > li') // movies
//         };
//         if (q === 'air'){
//             trending_data = $('div[id="list-2"] > div > ul > li') // on the air
//         };
//         if (q === 'completed'){
//             trending_data = $('div[id="list-3"] > div > ul > li') // completed
//         };

//         trending_data.each((i,el)=>{
//             let name = $(el).find('h2 > a').text().trim();
//             let link = $(el).find('a').attr('href');
//             let image = $(el).find('img').attr('src');

//             result.push({
//                 name,link,image
//             });
//         });

//         // main push
//         datas.push({
//             result
//         })

//         res.send(datas)
//     };
//     data(querry)
// });

// get req for search
app.get("/drama/search", (req, res) => {
  // console.log(req.query);
  var q = req.query.q;
  var page = req.query.page || null;

  try {
    const data = async (q, page, base_url) => {
      var datas = [];

      switch (page) {
        case null:
          var url = base_url + `search.html?key=${q}`;
          break;

        default:
          var url = base_url + `search.html?key=${q}&page=${page}`;
          break;
      }

      // console.log(url)

      const response = await fetch(url)
        .then((res) => res.text())
        .then((text) => {
          return text;
        })
        .catch((err) => console.log(err));

      const $ = cheerio.load(response);

      let list = $('div[class="list"] > div > ul > li');

      // let image = $('div[id="list-1"] > div > ul > li >')

      // let title = $('div[id="list-1"] > div > ul > li')

      list.each((index, element) => {
        // console.log(index,element)
        datas.push({
          name: $(element).find("h2 > a").text().trim(),
          link: $(element).find("h2 > a").attr("href"),
          image: $(element).find("img").attr("src"),
        });
      });

      switch (datas) {
        case []:
          res.send({ message: "No Data Found !!!" });
          break;

        default:
          res.send(datas);
          break;
      }
      // console.log(typeof datas)
    };
    data(q, page, base_url);
  } catch (e) {
    res.send({ message: e.message });
  }
});

// get req for detail view
app.get("/drama/:drama/:slug", (req, res) => {
  // console.log(req.params)

  const q = req.params.slug;
  const drama = req.params.drama;
  var page = 2;
  var url = base_url + `${drama}/${q}`;

  try {
    const MoreEpisodes = async (as, pages, url) => {
      var more_episode_html = "";
      var more_episode = [];

      try {
        var browser = await puppeteer.launch({
          headless: "new",
          //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
          executablePath:
            process.env.NODE_ENV === "production"
              ? process.env.PUPPETEER_EXECUTABLE_PATH
              : puppeteer.executablePath(),
          //   executablePath: '/usr/bin/google-chrome-stable' // Path to the installed Chrome binary
        });
        var page = await browser.newPage();
        await page.goto(url);
        const show = await page.evaluate(
          (as, page) => {
            document.querySelectorAll(".paging").item(0).click();
            var alias = as;
            // return {as:as}
            return $.ajax({
              url:
                base_url +
                "ajax/episode-list/" +
                alias +
                "/" +
                page +
                ".html?page=" +
                page,
              type: "GET",
              dataType: "html",
              success: function (b) {
                return b;
              },
            });
            // return document.querySelectorAll(".list-episode > li");
          },
          as,
          pages
        );

        // console.log(show);
        more_episode_html = show;

        await browser.close();
      } catch (e) {
        more_episode = "No Data Available";
        console.warn(e);
      }

      const $ = cheerio.load(more_episode_html);

      let data = $("li");
      let ShowMore = $("a.paging");

      // console.log("first",more_episode);

      data.each((i, el) => {
        let name = $(el).find("a").text().trim();
        let link = $(el).find("a").attr("href");
        let created = $(el).find("span").text().trim().split(" ")[0];

        more_episode.push({
          ep_name: name,
          link: link,
          created,
        });
      });

      // console.log("show more",ShowMore.length === 1);

      if (ShowMore.length === 1) {
        // console.log({a:as,page:pages,url:url})
        // try {
        let innerep = await MoreEpisodes(as, pages + 1, url);
        // } catch (e) {
        //   console.log("Error in More Episode ==> ", e);
        //   return more_episode;
        // }
        // console.log(innerep)
        innerep.forEach((el) => {
          more_episode.push(el);
        });
        return more_episode;
      } else {
        return more_episode;
      }
    };

    const data = async (drama, url) => {
      var datas = [];
      var details_data = {
        // name:'',
        Original_name: "",
        Release_year: "",
        Status: "",
        Country: "",
        Genre: [],
      };
      var episodes = [];
      var similar = [];
      var Extra_Eps = [];

      var response = await fetch(url)
        .then((res) => res.text())
        .then((text) => {
          return text;
        })
        .catch((err) => console.log(err));

      const $ = cheerio.load(response);

      let name = $('div[class="movie"] > a > h1').text().trim();
      let Image = $('div[class="left"] > img').attr("src"); // [0].attributes[1].value
      let summery = $('div[class="info"]').text().trim();
      let details = $('div[class="left"] > p'); // name,orignal name, country, year, genre, status
      let Episodes = $('ul[class="list-episode"] > li'); // according to episode
      let ShowMore = $("#content-left > div.movie > div.right > ul > a");
      let Similar = $('div[id="sidebarlist-1"] > div').slice(0, 10); // 11 data
      let count = 1;

      // details arry

      details.each((index, element) => {
        let key = $(element).find("strong").text().trim();
        let value = $(element).find("span").text().trim();

        //    if (key === "Name:"){
        //     var name = value;
        //     details_data.name = name;
        //    };
        if (key === "Original name:") {
          details_data.Original_name = value
            .split("\n")
            .join(",")
            .split(" ")
            .join("");
        } else if (key === "Release year:") {
          details_data.Release_year = value;
        } else if (key === "Country:") {
          details_data.Country = value;
        } else if (key === "Status:") {
          details_data.Status = value;
        } else if (key === "Genre:") {
          var Genre = value.split(",");
          details_data.Genre = Genre;
        }
      });

      Episodes.each((index, element) => {
        let name = $(element).find("a").text().trim();
        let link = $(element).find("a").attr("href");
        let created = $(element).find("span").text().trim().split(" ")[0];
        // console.log(name,link,created)

        episodes.push({
          ep_name: name,
          link: link,
          created,
        });
      });
      // episodes?.reverse()

      // similar

      Similar.each((index, element) => {
        let name = $(element).find("h2 > a").text().trim();
        let image = $(element).find("img").attr("src");
        let link = $(element).find("a").attr("href");
        let ep = $(element).find("p").text().split(":")[1].split("R")[0].trim();
        let year = $(element).find("p").text().split("year:")[1];
        // console.log(name,image,link,ep,year)

        similar.push({
          name,
          image,
          link,
          ep,
          year,
        });
      });

      // Episodes $ Date
      if (ShowMore.length === 1) {
        let ep = episodes;
        try {
          var Extra_episode = await MoreEpisodes(q, page, url);
          // console.log(episodes);
          Extra_episode.forEach((el) => {
            episodes.push(el);
          });
        } catch (e) {
          episodes = ep;
          console.warn("Error in Extra Ep ==>", e);
        }
      }

      episodes?.reverse();

      datas.push({
        name,
        type: drama,
        image: Image,
        detail: details_data,
        summery,
        episodes,
        similar,
      });

      res.send(datas);
    };

    data(drama, url);
  } catch (e) {
    res.send({ message: e.message });
  }
});

// Eipsodes get /episodes-num
app.get("/drama/:drama/:slug/:episode", (req, res) => {
  const drama = req.params.drama;
  const slug = req.params.slug;
  const episode = req.params.episode;

  try {
    const data = async (d, s, e, base_url) => {
      var datas = [];
      var server_list = [];
      var episodes = [];
      var k_slug = [];
      var other_slug = [];

      const url = base_url + `${d}/${s}/${e}`;
      const response = await fetch(url)
        .then((res) => res.text())
        .then((text) => {
          return text;
        })
        .catch((err) => console.log(err));

      const $ = cheerio.load(response);

      let name = $('div[class="play"] > h1').text().trim().split(" Eng")[0]; // Name
      let download = "https:" + $('a[class="download"]').attr("href"); // download btn link
      let main_server =
        "https:" + $('div[class="play-video"] > iframe').attr("src"); // main server
      let servers = $(
        'div[class="CapiTnv nav nav-pills anime_muti_link"] > div'
      ); // servers
      let Episodes = $('ul[class="list-episode"] > li'); // according to episode
      let next_ep = $('div[class="play"] > ul > li > a[class="m3"]').attr(
        "href"
      ); // next episode
      let prev_ep = $('div[class="play"] > ul > li > a[class="m1"]').attr(
        "href"
      ); // previous episode
      let korean_sug = $('div[id="sidebarlist-1"] > div').slice(0, 16); // korean dramas suggesion 11
      let other_sug = $('div[id="sidebarlist-2"] > div').slice(0, 16); // other dramas suggesion

      // servers loop

      servers.each((index, element) => {
        let server_name = $(element).attr("title").trim();
        let server = $(element).attr("data-video");
        if (server_name === "Our Server") {
          server = "https:" + server;
        }
        server_list.push({
          server_name,
          server,
        });
      });

      // Episodes $ Date

      Episodes.each((index, element) => {
        let name = $(element).find("a").text().trim();
        let link = $(element).find("a").attr("href");
        let created = $(element).find("span").text().trim().split(" ")[0];
        // console.log(name,link,created)

        episodes.push({
          ep_name: name,
          link: link,
          created,
        });
      });

      // korean suggession

      korean_sug.each((index, element) => {
        let name = $(element).text().trim(); // episode name
        let link = $(element).find("a").attr("href"); // ep link

        k_slug.push({
          name,
          link,
        });
      });

      // other suggession

      other_sug.each((index, element) => {
        let name = $(element).text().trim(); // episode name
        let link = $(element).find("a").attr("href"); // ep link

        other_slug.push({
          name,
          link,
        });
      });

      // main data
      datas.push({
        name,
        type: d,
        download,
        main_server,
        servers: server_list,
        episodes,
        next_ep: next_ep || null,
        prev_ep: prev_ep || null,
        k_slug,
        other_slug,
      });

      res.send(datas);
    };

    data(drama, slug, episode, base_url);
  } catch (e) {
    res.send({ message: e.message });
  }
});

// get Data Search                //  ?selOrder=0&selCat=0&selCountry=0&selYear=0&btnFilter=Submit&page=1
app.get("/drama/:type", (req, res) => {
  var type = req.params.type;
  var Order = req.query.selOrder || 0;
  var Catagory = req.query.selCat || 0;
  var Country = req.query.selCountry || 0;
  var Year = req.query.selYear || 0;
  var Submit = req.query.btnFilter || "Submit";
  var page = req.query.page || 0;

  try {
    const FetchData = async () => {
      var datas = [];

      var url = `${base_url}${type}?selOrder=${Order}&selCat=${Catagory}&selCountry=${Country}&selYear=${Year}&btnFilter=${Submit}&page=${page}`;
      var response = await fetch(url)
        .then((res) => res.text())
        .then((text) => {
          return text;
        })
        .catch((err) => console.log(err));

      var $ = cheerio.load(response);

      let movie_data = $("#list-1 > div > ul > li"); // has the list of movies

      movie_data.each((i, el) => {
        let status = $(el).find("span").text().trim();
        let name = $(el).find("a").text().trim();
        let image = $(el).find("img").attr("src");
        let link = $(el).find("a").attr("href");

        datas.push({ status, name, image, link });
      });

      res.send(datas);
    };

    FetchData();
  } catch (e) {
    res.send({ message: e.message });
  }
});

// gogo Animi

app.get("/animi/home", (req, res) => {
  try {
    const FetchData = async () => {
      var datas = [];
      var Recent_EP = [];
      var Popular = [];
      var Recent_SR = [];

      var url = "https://www5.gogoanimes.fi/";
      var response = await fetch(url)
        .then((res) => res.text())
        .then((res) => {
          return res;
        })
        .catch((e) => console.log(e));

      var $ = cheerio.load(response);

      // console.log(response)
      let Recent_Releases = $(
        "#load_recent_release > div.last_episodes.loaddub > ul > li"
      );
      let Popular_Ongoing = $(
        "#load_popular_ongoing > div.added_series_body.popular > ul > li"
      );
      let Recent_Added = $(
        "#wrapper_bg > section > section.content_left > div.main_body.none > div.added_series_body.final > ul > li"
      );

      console.log(Popular_Ongoing);

      Recent_Releases.each((i, el) => {
        let name = $(el).find("a").text().trim();
        let img = $(el).find("img").attr("src");
        let link = $(el).find("a").attr("href");
        link = "/category" + link.split("-episode")[0];

        Recent_EP.push({
          name,
          image: img,
          link,
        });
      });

      Popular_Ongoing.each((i, el) => {
        let name = $(el).find("a").text().trim();
        let link = $(el).find("a").attr("href");
        let img = $(el).find("img").attr("src");
        // link = "/category"+link.split("-episode")[0];

        console.log(name);

        Popular.push({ name, image: img, link });
      });

      Recent_Added.each((i, el) => {
        let name = $(el).find("a").text().trim();
        let link = $(el).find("a").attr("href");

        Recent_SR.push({ name, link });
      });

      datas.push({
        Recent_EP,
        Popular,
        Recent_SR,
      });

      res.send(datas);
    };

    FetchData();
  } catch (e) {
    console.log({ message: e.message });
  }
});

var port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Your Server Running in port %d", port);
});
