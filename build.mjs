import { fs, read, reCreateFolders, makeSiteMaps,assembleBody, getDirectories, consolidateAssets } from './modules/build-functions.mjs'

const vars_raw = read('./.env').split('\n')
let variables = {}
for (const v of vars_raw) {
  const instance = v.split("=")
  let object = instance[1].substring(0,1)==='"' && instance[1].substring(instance[1].length-1)==='"' ? instance[1].substring(1,instance[1].length-1) : instance[1]
  variables[instance[0]]=object
}
console.log(variables)

function titlify(text) {
  text = text.replace(/_/g, ' ')
  text = text[0].toUpperCase() + text.substring(1, text.length)
  text = text === 'Homepage' ? '' : text + ' | '
  return text
}


function makePage(directory) {
  let dist = ''
  let head = String(fs.readFileSync('./components/head.ejs'))
  head = head.replace(/\$name/g, variables.SITE_NAME)
  head = head.replace(/\$title/g, titlify(directory))
  head = head.replace(/\$site/g, variables.BASE_URL )
  head = head.replace(/\$description/g, variables.SITE_DESCRIPTION )
  head = head.replace(/\$keywords/g, variables.SITE_KEYWORDS )
  head = head.replace(/\$canonical/g, variables.BASE_URL  + '/' + directory)
  dist += head
  let nav = String(fs.readFileSync('./components/nav.ejs'))
  nav = nav.replace(/\$name/g, variables.SITE_NAME)
  nav = nav.replace(/\$site/g, variables.BASE_URL)

  let bodyWrapper = String(fs.readFileSync('./components/body-wrapper.ejs'))
  let body = fs.readFileSync('./pages/' + directory + '/index.ejs', { encoding: 'utf8', flag: 'r' })

  let parsedBody = {}
  let testBody = String(body).replace(/ /g, "")
  if (testBody.indexOf('[') == 0 && testBody.indexOf(']') == testBody.length - 1) {
    parsedBody.contents = assembleBody(JSON.parse(body))
  } else if (testBody.indexOf('{') == 0 && testBody.indexOf('}') == testBody.length - 1) {
    let jsonBody = JSON.parse(body)
    parsedBody.contents = assembleBody(jsonBody.contents)
    parsedBody.dir = jsonBody.destination
  }
  else {
    parsedBody.contents = body
  }

  bodyWrapper = bodyWrapper.replace(/\$nav/g, nav)
  bodyWrapper = bodyWrapper.replace(/\$body/g, parsedBody.contents)
  dist += bodyWrapper

  dist += fs.readFileSync('./components/foot.ejs')

  const extraScripts = './pages/' + directory + '/scripts.js'

  try {
    if (fs.existsSync(extraScripts)) {
      //file exists
      dist += '<script>'
      dist += fs.readFileSync(extraScripts)
      dist += '</script>'
      console.log('Files attached for ' + directory)

    }
  } catch (err) {
    // console.log('No additional files attached for ' + directory)
  }

  let subDirectory = directory === 'homepage' ? '/' : '/' + directory + '/'
  subDirectory = parsedBody.dir?parsedBody.dir: subDirectory
  console.log(subDirectory)
  try { fs.mkdirSync("./dist" + subDirectory, { recursive: true }) } catch (e) { }
  fs.writeFileSync('./dist' + subDirectory + 'index.html', dist);
  appendSiteXML(subDirectory)
}




//PERFORMING BUILD
const mainFolders = ["./dist", "./dist/src", "./dist/src/css", "./dist/src/fonts", "./dist/src/img", "./dist/src/js"]
for (const folder of mainFolders) { reCreateFolders(folder) }
consolidateAssets()

let siteMap = '<urlset></urlset>'
function appendSiteXML(dir) {
  let date = new Date()
  let loc = `<url>
  <loc>${variables.BASE_URL  + dir}</loc>
  <lastmod>${date}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>1</priority>
</url>
</urlset>`;
  siteMap = siteMap.replace("</urlset>", loc)
}



for (const directory of getDirectories('./pages')) {
  makePage(directory)
}

makeSiteMaps(siteMap)



