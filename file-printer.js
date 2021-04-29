var path = require('path'),
  fs = require('fs')
let ans = ''

function pbcopy(data) {
  var proc = require('child_process').spawn('pbcopy')
  proc.stdin.write(data)
  proc.stdin.end()
}

function fromDir(startPath, filter) {
  //console.log('Starting from dir '+startPath+'/');

  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath)
    return
  }

  var files = fs.readdirSync(startPath)
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i])
    var stat = fs.lstatSync(filename)
    if (
      stat.isDirectory() &&
      filename !== 'node_modules' &&
      filename !== 'dist'
    ) {
      fromDir(filename, filter) //recurse
    } else if (
      filter.some((e) => {
        return filename.indexOf(e) >= 0
      }) &&
      filename !== 'file-printer.js' &&
      filename !== 'package-lock.json'
    ) {
      ans += '\n\n===============\n\n' + filename + '\n\n===============\n\n'
      ans += fs.readFileSync(filename)
    }
  }
}

fromDir('./', ['.js', '.scss', '.ejs'])
console.log(ans)

pbcopy(ans)
