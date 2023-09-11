import fs from 'fs'
import fse from'fs-extra'
import sass from'node-sass'
import path from'path'
import UglifyJS from"uglify-js"

const listFiles = function(parent) {
  let dir = parent ? parent : '/';
  return fs.readdirSync(dir)
}

const read = function(file) {
  return fs.readFileSync(file, 'utf8');
}

const reCreateFolders = function(folder) {
  folder = folder ? folder : '/dist'
  if (fs.existsSync(folder)) { fs.rmSync(folder, { recursive: true }) }
  fs.mkdirSync(folder)
}

const assembleBody = function(contents) {
  let tmp = ''
  for (const section of contents) {
    tmp += fs.readFileSync('./pages/' + section)
  }
  return tmp
}

const getDirectories = function(dir) {
  const directoriesInDIrectory = fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  return directoriesInDIrectory
}
const consolidateAssets = function(){


  const directories = ['./src/css/', './src/js/']
  for (const dir of directories) {
    let data = ''
    let cssMap = ''
    let assets = listFiles(dir)
    assets = assets.filter(asset => asset.indexOf(".") >= 0)
    let directory = '.' + dir.replace('./src/', '').replace(/\//g, '')
    let newFile = dir.replace("./", "./dist/") + "file" + directory
    for (const asset of assets) {
      let assetData = read(dir + asset)
      let ext = path.parse(asset).ext
      if (ext === ".map") {
        cssMap += assetData;
      }
      if (ext === ".css") {
        data += assetData + " "
      }
      if (ext === ".js") {
        data += UglifyJS.minify(assetData).code + " "
      }
      if (ext === '.scss') {
        var result = sass.renderSync({
          file: dir + asset,
          includePaths: [dir + '/components/', dir],
          data: assetData,
          outputStyle: 'compressed',
          outFile: dir + '/file.css',
          sourceMap: true,
        });


        data += result.css
        cssMap += result?.map
      }
    }
    fs.writeFileSync(newFile, data);
    fs.writeFileSync("./dist/src/css/file.css.map", cssMap);
  }


  const assetFolders = ['./src/img/', './src/fonts/']
  for (const dir of assetFolders) {
    let destDir = dir.replace('./src/', './dist/src/')
    fse.copySync(dir, destDir)
  }
}

const makeSiteMaps = function(siteMap){
  fs.writeFileSync('./dist/site.xml', siteMap);
  fs.writeFileSync('./dist/sitemap.xml', siteMap);
  fs.writeFileSync('./dist/robots.txt', `
User-agent: *
Disallow: /src/

User-agent: Googlebot
Allow: /src/

Sitemap: https://flat18.co.uk/sitemap.xml
`);
}

export { fs, listFiles, read, reCreateFolders, makeSiteMaps,assembleBody, getDirectories, consolidateAssets }