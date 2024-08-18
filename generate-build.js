import fs from 'fs'
console.log("Incrementing build number...");
fs.readFile("./package.json", function (err, data) {
  if (err) throw err;
  var version = JSON.parse(data);
  fs.readFile("server/build.json", function (err, content) {
    if (err) throw err;
    var build = JSON.parse(content);
    build.number = (build.version === version.version ? build.number : 0) + 1;
    build.version = version.version;
    fs.writeFile("server/build.json", JSON.stringify(build), function (err) {
      if (err) throw err;
      console.log("Current build number: " + build.number);
    });
  });
});
