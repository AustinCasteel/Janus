const { app, dialog } = require("electron");
const fs = require("fs-extra");
const path = require("path");
const dns = require('dns');
var AdmZip = require("adm-zip");

// local dependencies
const notification = require("./notification");
const crypto = require("./crypto");

const userData = app.getPath("userData");
fs.ensureDirSync(userData);
const keysDir = path.resolve(userData, "keys");
fs.ensureDirSync(keysDir);
const orgDir = path.resolve(userData, "org");
fs.ensureDirSync(orgDir);
const vpnDir = path.resolve(orgDir);
fs.ensureDirSync(vpnDir);

// add files
exports.addFiles = (files = []) => {
  // copy `files` recursively (ignore duplicate file names)
  files.forEach((file) => {
    const filePath = path.resolve(keysDir, file.name);

    if (!fs.existsSync(filePath)) {
      fs.copyFileSync(file.path, filePath);
    }
  });

  // display notification
  notification.filesAdded(files.length);
};

// add key pair
exports.addKey = (name, private, public) => {
  const privatePath = path.resolve(keysDir, `${name}-private.asc`);
  const publicPath = path.resolve(keysDir, `${name}-public.asc`);

  if (!fs.existsSync(privatePath)) {
    fs.writeFileSync(privatePath, private);
  }

  if (!fs.existsSync(publicPath)) {
    fs.writeFileSync(publicPath, public);
  }

  // display notification
  notification.filesAdded(2);
};

exports.addVpn = (username, password, config, path, type) => {
  let lastEncryptedMessage;
  var zipName = "config.zip"
  var zipLoc = vpnDir
  var zipWrite = (zipLoc + "\\" + zipName);
  var zip = new AdmZip();
  zip.addFile("username.txt", Buffer.from(username, "utf8"), "");
  zip.addFile("password.txt", Buffer.from(password, "utf8"), "");
  zip.addFile("config.txt", Buffer.from(config, "utf8"), "");
  zip.writeZip(zipWrite);
  crypto.encryptConfig(path, type, zipWrite)
        .then((encryptedMessage) => {
          console.log(encryptedMessage);
          lastEncryptedMessage = encryptedMessage;
      
          const filePath = app.getPath('documents') + '/EncryptedConfig.zip.gpg';
          let options = { 
            defaultPath: filePath,
            title: "Save Encrypted VPN Config",
            buttonLabel: "Save Config File",
            filters:[
              {name: 'OpenPGP Encrypted File', extensions: ['gpg', 'pgp']}
            ]
          }
          dialog.showSaveDialog(options).then((result) => {
            fs.writeFile(result.filePath, lastEncryptedMessage, (err) => {
            });
          }).catch((err) => {
            console.log(err);
            dialog.showErrorBox("app", "Unable to find encrypted config file.");
          });
      
      
          // fs.writeFile(app.getPath('documents') + '/EncryptedConfig.zip.gpg', lastEncryptedMessage, function (err) {
          //   if (err) return console.log(err);
          //   console.log("saved");
          // });
        })
};

// exports.addOrg = (key) => {
//   const keyPath1 = path.resolve(orgDir, `ts-pub.asc`);
//   if (!fs.existsSync(keyPath1)) {
//     fs.writeFileSync(keyPath1, key);
//   }
//   const keyPath2 = path.resolve(orgDir, `ts-pvt.asc`);
//   if (!fs.existsSync(keyPath2)) {
//     fs.writeFileSync(keyPath2, key);
//   }
// };

exports.addOrg = () => {
  segment1 = "segmented01.csdsuite.com"
  segment2 = "segmented11.csdsuite.com"
  dns.resolveTxt(segment1, (err, data1) => {
    if(err) throw err;
    dns.resolveTxt(segment2, (err, data2) => {
      if(err) throw err;
      pushResults(data1, data2);
    });
  });

  function pushResults(data1, data2){
    var seg1 = data1;
    var seg2 = data2;
    var seg11 = seg1.toString();
    var seg22 = seg2.toString();
    var seg111 = seg11.replace(/,/g, '');
    var seg222 = seg22.replace(/,/g, '');
    let com = seg111.concat(seg222);
    let com1 = com.slice(36,-34);
    function addNewlines(str) {
      var result = '';
      while (str.length > 0) {
        result += str.substring(0, 60) + '\n';
        str = str.substring(60);
      }
      return result;
    }
    var com2 = addNewlines(com1);
    var com3 = com2.substring(0, com2.lastIndexOf("="));
    var com4 = com2.substring(com2.lastIndexOf("="), com2.length);
    var header = "-----BEGIN PGP PUBLIC KEY BLOCK-----"
    var footer = "-----END PGP PUBLIC KEY BLOCK-----"
    var nl = "\n"
    var com5 = header+nl+nl+com3+nl+com4+footer;
    const keyPath1 = path.resolve(orgDir, `ts-pub.asc`);
    if (!fs.existsSync(keyPath1)) {
      fs.writeFileSync(keyPath1, com5);
    }
    const keyPath2 = path.resolve(orgDir, `ts-pvt.asc`);
    if (!fs.existsSync(keyPath2)) {
      fs.writeFileSync(keyPath2, com5);
    }
  }
};

exports.removeOrg = () => {
  const keyPath1 = path.resolve(orgDir, `ts-pub.asc`);
  if (fs.existsSync(keyPath1)) {
    fs.unlinkSync(keyPath1);
  }
  const keyPath2 = path.resolve(orgDir, `ts-pvt.asc`);
  if (fs.existsSync(keyPath2)) {
    fs.unlinkSync(keyPath2);
  }
  const configPath = path.resolve(orgDir, `config.zip`);
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
};

exports.getOrg = () => {
  // segment1 = "segmented01.csdsuite.com"
  // segment2 = "segmented11.csdsuite.com"
  // dns.resolveTxt(segment1, (err, data1) => {
  //   if(err) throw err;
  //   dns.resolveTxt(segment2, (err, data2) => {
  //     if(err) throw err;
  //     pushResults(data1, data2);
  //   });
  // });

  // function pushResults(data1, data2){
  //   var seg1 = data1;
  //   var seg2 = data2;
  //   var seg11 = seg1.toString();
  //   var seg22 = seg2.toString();
  //   var seg111 = seg11.replace(/,/g, '');
  //   var seg222 = seg22.replace(/,/g, '');
  //   let com = seg111.concat(seg222);
  //   let com1 = com.slice(36,-34);
  //   function addNewlines(str) {
  //     var result = '';
  //     while (str.length > 0) {
  //       result += str.substring(0, 60) + '\n';
  //       str = str.substring(60);
  //     }
  //     return result;
  //   }
  //   var com2 = addNewlines(com1);
  //   var com3 = com2.substring(0, com2.lastIndexOf("="));
  //   var com4 = com2.substring(com2.lastIndexOf("="), com2.length);
  //   var header = "-----BEGIN PGP PUBLIC KEY BLOCK-----"
  //   var footer = "-----END PGP PUBLIC KEY BLOCK-----"
  //   var nl = "\n"
  //   var com5 = header+nl+nl+com3+nl+com4+footer;

  //   //console.log(com3);
  //   //console.log(com2);
  //   //console.log(com1);
  // }
};

exports.tsZip = () => {
  const files = fs.readdirSync(orgDir);

  return files
    .filter((file) => [".zip"].includes(path.extname(file)))
    .map((filename) => {
      const filePath = path.resolve(orgDir, filename);
      const fileStats = fs.statSync(filePath);
      return {
        name: filename,
        path: filePath,
        size: Number(fileStats.size / 1000).toFixed(1), // kb
      };
    });
};

exports.tsKey = () => {
  const files = fs.readdirSync(orgDir);

  return files
    .filter((file) => [".asc", ".key"].includes(path.extname(file)))
    .map((filename) => {
      const filePath = path.resolve(orgDir, filename);
      const fileStats = fs.statSync(filePath);
      return {
        name: filename,
        path: filePath,
        size: Number(fileStats.size / 1000).toFixed(1), // kb
      };
    });
};

// get the list of keys
exports.getKeys = () => {
  const files = fs.readdirSync(keysDir);

  return files
    .filter((file) => [".asc", ".key"].includes(path.extname(file)))
    .map((filename) => {
      const filePath = path.resolve(keysDir, filename);
      const fileStats = fs.statSync(filePath);
      return {
        name: filename,
        path: filePath,
        size: Number(fileStats.size / 1000).toFixed(1), // kb
      };
    });
};

exports.findPublicKey = (privateKeyName) => {
  const files = fs.readdirSync(keysDir);
  const publicKeyFile = files.find((filename) => {
    const nameElements = privateKeyName.split("-").pop();
    const publicName = nameElements.startsWith("private")
      ? privateKeyName.replace("private", "public")
      : nameElements.startsWith("pvt")
      ? privateKeyName.replace("pvt", "pub")
      : privateKeyName;
    return publicName == filename;
  });
  try {
    const filePath = path.resolve(keysDir, publicKeyFile);
    return {
      name: publicKeyFile,
      path: filePath,
    };
  } catch (err) {
    console.log(err);
    dialog.showErrorBox("app", "Unable to find public key file.");
  }
};

exports.findPublicKey2 = (privateKeyName) => {
  const files = fs.readdirSync(orgDir);
  const publicKeyFile = files.find((filename) => {
    const nameElements = privateKeyName.split("-").pop();
    const publicName = nameElements.startsWith("private")
      ? privateKeyName.replace("private", "public")
      : nameElements.startsWith("pvt")
      ? privateKeyName.replace("pvt", "pub")
      : privateKeyName;
    return publicName == filename;
  });
  try {
    const filePath = path.resolve(orgDir, publicKeyFile);
    return {
      name: publicKeyFile,
      path: filePath,
    };
  } catch (err) {
    console.log(err);
    dialog.showErrorBox("app", "Unable to find public key file.");
  }
};

exports.downloadPublicKey = (privateKeyName) => {
  const files = fs.readdirSync(keysDir);
  const publicKeyFile = files.find((filename) => {
    const nameElements = privateKeyName.split("-").pop();
    const publicName = nameElements.startsWith("private")
      ? privateKeyName.replace("private", "public")
      : nameElements.startsWith("pvt")
      ? privateKeyName.replace("pvt", "pub")
      : privateKeyName;
    return publicName == filename;
  });
  try {
    const filePath = path.resolve(keysDir, publicKeyFile);
    const keyContent = fs.readFileSync(filePath);
    let options = { 
      defaultPath: publicKeyFile,
      title: "Export Certificates",
      buttonLabel: "Save Public Key",
      filters:[
        {name: 'OpenPGP Certificates', extensions: ['asc', 'key']}
      ]
    }
    dialog.showSaveDialog(options).then((result) => {
      fs.writeFile(result.filePath, keyContent, (err) => {
      });
    }).catch((err) => {
      console.log(err);
      dialog.showErrorBox("app", "Unable to find public key file.");
    });
  } catch (err) {
    console.log(err);
    dialog.showErrorBox("app", "Unable to find public key file.");
  }
};

exports.downloadPrivateKey = (privateKeyName) => {
  const files = fs.readdirSync(keysDir);
  const privateKeyFile = files.find((filename) => {
    const nameElements = privateKeyName.split("-").pop();
    const privateName = nameElements.startsWith("private")
      ? privateKeyName.replace("private", "private")
      : nameElements.startsWith("pvt")
      ? privateKeyName.replace("pvt", "pvt")
      : privateKeyName;
    return privateName == filename;
  });
  try {
    const filePath = path.resolve(keysDir, privateKeyFile);
    const keyContent = fs.readFileSync(filePath);
    let options = { 
      defaultPath: privateKeyFile,
      title: "Export Certificates",
      buttonLabel: "Save Private Key",
      filters:[
        {name: 'OpenPGP Certificates', extensions: ['asc', 'key']}
      ]
    }
    dialog.showSaveDialog(options).then((result) => {
      fs.writeFile(result.filePath, keyContent, (err) => {
      });
    }).catch((err) => {
      console.log(err);
      dialog.showErrorBox("app", "Unable to find private key file.");
    });
  } catch (err) {
    console.log(err);
    dialog.showErrorBox("app", "Unable to find private key file.");
  }
};