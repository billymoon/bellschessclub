import * as cheerio from "cheerio";

// void (async () => {
//     const $ = await cheerio.fromURL(
//         `https://www.chessscotland.com/grading/player/29439/`,
//         // `https://www.chessscotland.com/grading/player/32430/`,
//     );
//     // const htmlText = await fetch(
//     //     `https://www.chessscotland.com/grading/player/29439/`,
//     // ).then((r) => r.text());
//     // const $ = cheerio.load(htmlText);
//     const standard = $(`strong:contains("Standard:")`)
//         .parent().parent().text().replace(/\s+/gm, "");
//     console.log(/.*Grade:(Ung|\d+)(?:⇒(\d+))?.*Rank:(\d+)(?:⇒(\d+))?.*/.exec(standard))
// })();

// https://www.chessscotland.com/grading/search-players
// copy(JSON.stringify(Array.from(document.querySelectorAll("tbody tr")).map(tr => Object.fromEntries(Array.from(tr.querySelectorAll("td")).map(td => [td.getAttribute('data-column'), td.innerText])))))
// [{"pnum":"10833","name":"Archibald, A David","null":"SB, ED","status":"A","standard_published":"1718","standard_live":"1718","allegro_published":"—","allegro_live":"—"},{"pnum":"26618","name":"Booles, Gill","null":"SB","status":"A","standard_published":"562","standard_live":"562","allegro_published":"—","allegro_live":"—"},{"pnum":"20412","name":"Callaghan, George S","null":"SB, WD","status":"A","standard_published":"905","standard_live":"905","allegro_published":"—","allegro_live":"—"},{"pnum":"14010","name":"Ceron, Galo","null":"SB, WD","status":"A","standard_published":"1407","standard_live":"1407","allegro_published":"—","allegro_live":"—"},{"pnum":"3653","name":"Cullen, Mark","null":"SB","status":"A","standard_published":"1221","standard_live":"1221","allegro_published":"—","allegro_live":"—"},{"pnum":"30420","name":"Davidson, Maxwell","null":"SB","status":"A","standard_published":"1273","standard_live":"1269","allegro_published":"1250","allegro_live":"1250"},{"pnum":"32168","name":"Di Ponio, Steven","null":"SB","status":"NEW","standard_published":"Ung","standard_live":"Ung","allegro_published":"Ung","allegro_live":"Ung"},{"pnum":"7572","name":"Dimitrov, Todor","null":"SB, LS","status":"A","standard_published":"1597","standard_live":"1580","allegro_published":"1563","allegro_live":"1563"},{"pnum":"29136","name":"Dowle, Chris","null":"SB","status":"A","standard_published":"1190","standard_live":"1203","allegro_published":"1103","allegro_live":"1103"},{"pnum":"32314","name":"Gallagher, Jos","null":"SB","status":"NEW","standard_published":"Ung","standard_live":"Ung","allegro_published":"—","allegro_live":"—"},{"pnum":"32502","name":"Gilmore, Alex","null":"SB","status":"NEW","standard_published":"Ung","standard_live":"Ung","allegro_published":"—","allegro_live":"—"},{"pnum":"29348","name":"Hassan, Fathi","null":"SB","status":"A","standard_published":"2038","standard_live":"2038","allegro_published":"—","allegro_live":"—"},{"pnum":"32429","name":"Hutchings, Bert","null":"SB","status":"NEW","standard_published":"Ung","standard_live":"Ung","allegro_published":"—","allegro_live":"—"},{"pnum":"19505","name":"Jakimiuk, Andrej","null":"BS, SB","status":"A","standard_published":"—","standard_live":"—","allegro_published":"1450","allegro_live":"1450"},{"pnum":"27709","name":"Kerray, Bill","null":"SB","status":"A","standard_published":"992","standard_live":"992","allegro_published":"1019","allegro_live":"1019"},{"pnum":"4609","name":"Kirk, Steven","null":"EW, SB","status":"A","standard_published":"1377","standard_live":"1377","allegro_published":"—","allegro_live":"—"},{"pnum":"32430","name":"Krishna Kumar, Rohit","null":"SB","status":"A","standard_published":"Ung","standard_live":"1462","allegro_published":"Ung","allegro_live":"1851"},{"pnum":"16223","name":"Linskaill, Chris","null":"SB","status":"A","standard_published":"1720","standard_live":"1730","allegro_published":"1659","allegro_live":"1659"},{"pnum":"17963","name":"Malone, Nick","null":"SB","status":"A","standard_published":"1461","standard_live":"1461","allegro_published":"—","allegro_live":"—"},{"pnum":"5076","name":"McGregor, Lindsay A","null":"ED, SB","status":"A","standard_published":"1612","standard_live":"1612","allegro_published":"—","allegro_live":"—"},{"pnum":"9044","name":"McQuillan, Paul","null":"SB","status":"A","standard_published":"1599","standard_live":"1599","allegro_published":"—","allegro_live":"—"},{"pnum":"29439","name":"Moon, Billy","null":"SB","status":"A","standard_published":"1541","standard_live":"1523","allegro_published":"1545","allegro_live":"1545"},{"pnum":"9444","name":"Muir, Lindsay","null":"SB","status":"A","standard_published":"1046","standard_live":"1046","allegro_published":"1039","allegro_live":"1039"},{"pnum":"15998","name":"O`Connor, Jamie","null":"DL, SB","status":"A","standard_published":"1663","standard_live":"1663","allegro_published":"1690","allegro_live":"1690"},{"pnum":"15843","name":"Ross, John","null":"SB","status":"A","standard_published":"1670","standard_live":"1670","allegro_published":"—","allegro_live":"—"},{"pnum":"5884","name":"Ruxton, Keith FM","null":"SB","status":"A","standard_published":"2315","standard_live":"2315","allegro_published":"2315","allegro_live":"2315"},{"pnum":"19054","name":"Wallace, Jamie","null":"SB","status":"NEW","standard_published":"Ung","standard_live":"Ung","allegro_published":"—","allegro_live":"—"},{"pnum":"9443","name":"Wallace, Mike","null":"SB","status":"A","standard_published":"1264","standard_live":"1264","allegro_published":"1065","allegro_live":"1065"},{"pnum":"12169","name":"Ward, Peter James","null":"SB","status":"A","standard_published":"1070","standard_live":"1070","allegro_published":"—","allegro_live":"—"}]
// const chessScotlandData = [{"pnum":"10833","name":"Archibald, A David","null":"SB, ED","status":"A","standard_published":"1718","standard_live":"1718","allegro_published":"—","allegro_live":"—"},{"pnum":"26618","name":"Booles, Gill","null":"SB","status":"A","standard_published":"562","standard_live":"562","allegro_published":"—","allegro_live":"—"},{"pnum":"20412","name":"Callaghan, George S","null":"SB, WD","status":"A","standard_published":"905","standard_live":"905","allegro_published":"—","allegro_live":"—"},{"pnum":"14010","name":"Ceron, Galo","null":"SB, WD","status":"A","standard_published":"1407","standard_live":"1407","allegro_published":"—","allegro_live":"—"},{"pnum":"3653","name":"Cullen, Mark","null":"SB","status":"A","standard_published":"1221","standard_live":"1221","allegro_published":"—","allegro_live":"—"},{"pnum":"30420","name":"Davidson, Maxwell","null":"SB","status":"A","standard_published":"1273","standard_live":"1269","allegro_published":"1250","allegro_live":"1250"},{"pnum":"32168","name":"Di Ponio, Steven","null":"SB","status":"NEW","standard_published":"Ung","standard_live":"Ung","allegro_published":"Ung","allegro_live":"Ung"},{"pnum":"7572","name":"Dimitrov, Todor","null":"SB, LS","status":"A","standard_published":"1597","standard_live":"1580","allegro_published":"1563","allegro_live":"1563"},{"pnum":"29136","name":"Dowle, Chris","null":"SB","status":"A","standard_published":"1190","standard_live":"1203","allegro_published":"1103","allegro_live":"1103"},{"pnum":"32314","name":"Gallagher, Jos","null":"SB","status":"NEW","standard_published":"Ung","standard_live":"Ung","allegro_published":"—","allegro_live":"—"},{"pnum":"32502","name":"Gilmore, Alex","null":"SB","status":"NEW","standard_published":"Ung","standard_live":"Ung","allegro_published":"—","allegro_live":"—"},{"pnum":"29348","name":"Hassan, Fathi","null":"SB","status":"A","standard_published":"2038","standard_live":"2038","allegro_published":"—","allegro_live":"—"},{"pnum":"32429","name":"Hutchings, Bert","null":"SB","status":"NEW","standard_published":"Ung","standard_live":"Ung","allegro_published":"—","allegro_live":"—"},{"pnum":"19505","name":"Jakimiuk, Andrej","null":"BS, SB","status":"A","standard_published":"—","standard_live":"—","allegro_published":"1450","allegro_live":"1450"},{"pnum":"27709","name":"Kerray, Bill","null":"SB","status":"A","standard_published":"992","standard_live":"992","allegro_published":"1019","allegro_live":"1019"},{"pnum":"4609","name":"Kirk, Steven","null":"EW, SB","status":"A","standard_published":"1377","standard_live":"1377","allegro_published":"—","allegro_live":"—"},{"pnum":"32430","name":"Krishna Kumar, Rohit","null":"SB","status":"A","standard_published":"Ung","standard_live":"1462","allegro_published":"Ung","allegro_live":"1851"},{"pnum":"16223","name":"Linskaill, Chris","null":"SB","status":"A","standard_published":"1720","standard_live":"1730","allegro_published":"1659","allegro_live":"1659"},{"pnum":"17963","name":"Malone, Nick","null":"SB","status":"A","standard_published":"1461","standard_live":"1461","allegro_published":"—","allegro_live":"—"},{"pnum":"5076","name":"McGregor, Lindsay A","null":"ED, SB","status":"A","standard_published":"1612","standard_live":"1612","allegro_published":"—","allegro_live":"—"},{"pnum":"9044","name":"McQuillan, Paul","null":"SB","status":"A","standard_published":"1599","standard_live":"1599","allegro_published":"—","allegro_live":"—"},{"pnum":"29439","name":"Moon, Billy","null":"SB","status":"A","standard_published":"1541","standard_live":"1523","allegro_published":"1545","allegro_live":"1545"},{"pnum":"9444","name":"Muir, Lindsay","null":"SB","status":"A","standard_published":"1046","standard_live":"1046","allegro_published":"1039","allegro_live":"1039"},{"pnum":"15998","name":"O`Connor, Jamie","null":"DL, SB","status":"A","standard_published":"1663","standard_live":"1663","allegro_published":"1690","allegro_live":"1690"},{"pnum":"15843","name":"Ross, John","null":"SB","status":"A","standard_published":"1670","standard_live":"1670","allegro_published":"—","allegro_live":"—"},{"pnum":"5884","name":"Ruxton, Keith FM","null":"SB","status":"A","standard_published":"2315","standard_live":"2315","allegro_published":"2315","allegro_live":"2315"},{"pnum":"19054","name":"Wallace, Jamie","null":"SB","status":"NEW","standard_published":"Ung","standard_live":"Ung","allegro_published":"—","allegro_live":"—"},{"pnum":"9443","name":"Wallace, Mike","null":"SB","status":"A","standard_published":"1264","standard_live":"1264","allegro_published":"1065","allegro_live":"1065"},{"pnum":"12169","name":"Ward, Peter James","null":"SB","status":"A","standard_published":"1070","standard_live":"1070","allegro_published":"—","allegro_live":"—"}]
// console.log(chessScotlandData)

// <input type="hidden" name="_csrf_token" value="202f8ad2bb4954ad950578ebf9e19b76f67e8d6f428b6b8153d2c634e67f4d31">

void (async () => {
  const searchPageResponse = await fetch(
    `https://www.chessscotland.com/grading/search-players`,
  );
  const PHPSESSID = searchPageResponse.headers
    .get("set-cookie")
    .match(/PHPSESSID=(.+?);/)[1];
  const $searchPage = cheerio.load(await searchPageResponse.text());
  const CSRF = $searchPage(`input[name=_csrf_token]`).attr("value");
  if (PHPSESSID && CSRF) {
    const BOUNDARY = `----WebKitFormBoundary${Math.random().toString(16).slice(2)}`;
    const sbData = await fetch("https://www.chessscotland.com/handle-form", {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": `multipart/form-data; boundary=${BOUNDARY}`,
        cookie: `PHPSESSID=${PHPSESSID}`,
      },
      body: `--${BOUNDARY}
Content-Disposition: form-data; name="_csrf_token"

${CSRF}
--${BOUNDARY}
Content-Disposition: form-data; name="action"

search_players
--${BOUNDARY}
Content-Disposition: form-data; name="forename"


--${BOUNDARY}
Content-Disposition: form-data; name="surname"


--${BOUNDARY}
Content-Disposition: form-data; name="pnum"


--${BOUNDARY}
Content-Disposition: form-data; name="gender"


--${BOUNDARY}
Content-Disposition: form-data; name="club"

SB
--${BOUNDARY}
Content-Disposition: form-data; name="fide_fed"


--${BOUNDARY}
Content-Disposition: form-data; name="min_age"


--${BOUNDARY}
Content-Disposition: form-data; name="max_age"


--${BOUNDARY}--
`,
      method: "POST",
    }).then((r) => r.json());

    const $ = cheerio.load(sbData.html);

    console.log(
      $("tbody tr")
        .toArray()
        .map((tr) =>
          Object.fromEntries(
            $("td", tr)
              .toArray()
              .map((td) => {
                const $td = $(td);
                return [$td.attr("data-column") || "clubs", $td.text().trim()];
              }),
          ),
        ),
    );
  } else {
    console.log({ PHPSESSID, CSRF });
  }
})();
