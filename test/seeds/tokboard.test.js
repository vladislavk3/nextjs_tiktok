const { Model } = require('objection');
import {pg} from 'helpers/db'
import {parseJson} from 'seeds/tokboard'

const SONG_1 = {"playCount":29033900,"popularVideoCount":162,"id":"6878895065788319745","title":"Lovesick Girls","authorName":"BLACKPINK","playUrl":"https://sf16-sg.tiktokcdn.com/obj/tiktok-obj/6bb17f80a9c20291d405c6de5f8a41e8.mp3","coverThumb":"https://p16-sg.tiktokcdn.com/aweme/100x100/tiktok-obj/image/f47d16a6c5b1f6aac7be926bd5283263.jpg.jpeg","coverMedium":"https://p16-sg.tiktokcdn.com/aweme/200x200/tiktok-obj/image/f47d16a6c5b1f6aac7be926bd5283263.jpg.jpeg","coverLarger":null,"original":0,"videoCount":0,"createdAt":"2020-10-02T08:06:18.000Z","updatedAt":"2020-10-26T02:53:02.000Z","userId":null,"dead":0,"ids":["6878895065788319745"],"listUpdateTime":1603681711055.6606,"playsByFlag":[["🇰🇷",14004458],["🇵🇭",8928228],["🇮🇩",4031684],["🇺🇸",4008465],["🇷🇺",3721324],["🇩🇰",2617300],["🇹🇭",2491046],["🇨🇭",1814194],["🇲🇾",1486656],["🇯🇵",1383496],["🇺🇦",1253056],["🇹🇷",1134739],["🇵🇹",1104913],["🇨🇦",1089770],["🇨🇳",993441],["🇲🇽",900864]],"dailyStats":[[1603695600,"323668","27"],[1603609200,"1687273","38"],[1603522800,"6700317","31"],[1603436400,"5135110","46"],[1603350000,"3245872","54"],[1603263600,"5194191","51"],[1603177200,"6995988","61"],[1603090800,"5406722","47"],[1603004400,"6621233","69"],[1602918000,"19139168","89"],[1602831600,"7337168","64"],[1602745200,"9937159","76"],[1602658800,"8796616","45"],[1602572400,"16654548","73"],[1602486000,"9879298","71"],[1602399600,"9385350","81"],[1602313200,"7575898","77"],[1602226800,"19848942","144"],[1602140400,"15764471","97"],[1602054000,"12372929","79"],[1601967600,"15046708","103"],[1601881200,"16915597","114"],[1601794800,"26551505","139"],[1601708400,"62234334","190"],[1601622000,"1268981","7"]],"tags":[["#blackpink",3487],["#lovesickgirls",1994],["#kpop",1472],["#jennie",1336],["#lisa",1205],["#jisoo",1204],["#blink",1181],["#rose",771],["#rosé",391],["#thealbum",347],["#lovesickgirlsblackpink",288],["#blackpinkofficial",228],["#blinks",215],["#bts",197],["#dance",188],["#kpopfyp",184],["#bp",181],["#blackpinkinyourarea",161],["#블랙핑크",159],["#lalisamanoban",129]],"stats":{"0":{"totalPlayCount":"300098259"}}}

beforeAll(async () => {
});
afterAll(async () => {
});
 
describe("tokboard seed", () => {
    const expected = {
        song_id: "6878895065788319745",
        title: "Lovesick Girls",
        author: "BLACKPINK",
        plays: "300098259",
        tags: SONG_1.tags,
        peak_day: new Date(1602745200*1000)
    }
  test("parses song", 
    () => expect(parseJson(SONG_1)).toEqual(expected));
});