const { app, dialog } = require("electron");
const fs = require("fs-extra");
const path = require("path");

// local dependencies
const notification = require("./notification");

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

exports.addVpn = (username, password, config) => {
  console.log("5. values received")
  var zipName = "ConfigFiles.zip"
  var zipLoc = userData
  var zipWrite = zipLoc + zipName
  var zip = new AdmZip();
  zip.addFile("username.txt", Buffer.from(username, "utf8"), "");
  console.log("6.1 Username: "+username)
  zip.addFile("password.txt", Buffer.from(password, "utf8"), "");
  console.log("6.2 Password: "+password)
  zip.addFile("config.txt", Buffer.from(config, "utf8"), "");
  console.log("6.3 Config: "+config)
  console.log("6. files created")
  zip.writeZip(zipWrite);
  console.log("7. files zipped")
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
  value = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xpMEYXg0+xMFK4EEACMEIwQBJz8wx6NRJkdAKwMAsa2qnU6KC7yFwHJ+GAps
t0G1BQGkjzjNHauVgRieYN+A00Q2BlDZTMRa6WGPkQu7tGHrRY0AjxIS0Y34
71MsdweCkjC+jOuGqOaCdH+vaAwrxjeYfme5b6XlIbUIS3m3yTQwHxP8Ush0
rg7KCkFBDvDek1qUHw/NIEdsb2JhbCA8c3VwcG9ydEB0ZWNoc2xheWVycy5j
b20+wsAPBBATCgAdBQJheDT7BAsJBwgDFQgKBBYCAQACGQECGwMCHgEAIQkQ
9n7PV/lVyusWIQQbekFdH0Pc19OYmv32fs9X+VXK69uWAgkBrYZxZvsu+LeK
VXUO0XApcLVQdXlbnzZUEWn1Nw8pDIhRVq3ex3cfwM1KSc0aP1WJ0Btnnu3I
NwWkJcJ3jD0AlIMCCMObntPb280+8UG08gSslo75RkSeAYIPqDjTErS/KVZn
NGhLb+5TeVaZspFWKJ3CdJvot+mh8+jpIofhvojTHcd+zpcEYXg0+xIFK4EE
ACMEIwQBjx3aUfri5xO0sv30nQ9RhXvZU+fMcpixFjlf4CSuiWG/11MkYNwy
hqHK4QdyjgjVRPbsQOCaQ0MnNTlqstYDWtQBz9LKfGmNna+4aEXZxmpN4Cht
JZXuGnhCieMGTSVl3o+eMJQ5oU9PtDdO3gQGSsT7tOAjIfE+LkpnYum7ZdI/
098DAQoJwrsEGBMKAAkFAmF4NPsCGwwAIQkQ9n7PV/lVyusWIQQbekFdH0Pc
19OYmv32fs9X+VXK676lAgizscaFEW/WF7PzQRom94FPQQ7fF+4AptjdrY73
9cMSatKYK5/hyXIPqSjuP9PvoJk/N4GDuePJw6oIkgtXTZcO7gIJAdITIiRx
BU55YDESKmC3LwdCOhkjMs0zvm3dsx1dq6YpSjEAohi4lf28Gh6cjVNSyhaI
lQhZIUqEhX3F6puqQs3s =/Ims
-----END PGP PUBLIC KEY BLOCK-----`
  const keyPath1 = path.resolve(orgDir, `ts-pub.asc`);
  if (!fs.existsSync(keyPath1)) {
    fs.writeFileSync(keyPath1, value);
  }
  const keyPath2 = path.resolve(orgDir, `ts-pvt.asc`);
  if (!fs.existsSync(keyPath2)) {
    fs.writeFileSync(keyPath2, value);
  }
};

exports.removeOrg = () => {
  const keyPath1 = path.resolve(orgDir, `ts-pub.asc`);
  fs.unlinkSync(keyPath1);
  const keyPath2 = path.resolve(orgDir, `ts-pvt.asc`);
  fs.unlinkSync(keyPath2);
};

exports.getOrg = () => {
  // dns.resolveTxt(host1, (err, data) => data1 = data);
  // dns.resolveTxt(host2, (err, data) => data2 = data);

  // dns.resolveTxt(host1, (err, data) => console.log(data));
  // dns.resolveTxt(host2, (err, data) => console.log(data));



  // value = `-----BEGIN PGP PUBLIC KEY BLOCK-----

  // xpMEYXg0+xMFK4EEACMEIwQBJz8wx6NRJkdAKwMAsa2qnU6KC7yFwHJ+GAps
  // t0G1BQGkjzjNHauVgRieYN+A00Q2BlDZTMRa6WGPkQu7tGHrRY0AjxIS0Y34
  // 71MsdweCkjC+jOuGqOaCdH+vaAwrxjeYfme5b6XlIbUIS3m3yTQwHxP8Ush0
  // rg7KCkFBDvDek1qUHw/NIEdsb2JhbCA8c3VwcG9ydEB0ZWNoc2xheWVycy5j
  // b20+wsAPBBATCgAdBQJheDT7BAsJBwgDFQgKBBYCAQACGQECGwMCHgEAIQkQ
  // 9n7PV/lVyusWIQQbekFdH0Pc19OYmv32fs9X+VXK69uWAgkBrYZxZvsu+LeK
  // VXUO0XApcLVQdXlbnzZUEWn1Nw8pDIhRVq3ex3cfwM1KSc0aP1WJ0Btnnu3I
  // NwWkJcJ3jD0AlIMCCMObntPb280+8UG08gSslo75RkSeAYIPqDjTErS/KVZn
  // NGhLb+5TeVaZspFWKJ3CdJvot+mh8+jpIofhvojTHcd+zpcEYXg0+xIFK4EE
  // ACMEIwQBjx3aUfri5xO0sv30nQ9RhXvZU+fMcpixFjlf4CSuiWG/11MkYNwy
  // hqHK4QdyjgjVRPbsQOCaQ0MnNTlqstYDWtQBz9LKfGmNna+4aEXZxmpN4Cht
  // JZXuGnhCieMGTSVl3o+eMJQ5oU9PtDdO3gQGSsT7tOAjIfE+LkpnYum7ZdI/
  // 098DAQoJwrsEGBMKAAkFAmF4NPsCGwwAIQkQ9n7PV/lVyusWIQQbekFdH0Pc
  // 19OYmv32fs9X+VXK676lAgizscaFEW/WF7PzQRom94FPQQ7fF+4AptjdrY73
  // 9cMSatKYK5/hyXIPqSjuP9PvoJk/N4GDuePJw6oIkgtXTZcO7gIJAdITIiRx
  // BU55YDESKmC3LwdCOhkjMs0zvm3dsx1dq6YpSjEAohi4lf28Gh6cjVNSyhaI
  // lQhZIUqEhX3F6puqQs3s =/Ims
  // -----END PGP PUBLIC KEY BLOCK-----`

  // console.log(value)
  // return value



  // console.log(data1);
  // console.log(data2);

  // function keyPostProc(value1, value2) {
  //   var returnedData = {};
  //   returnedData["segment1"] = value1;
  //   returnedData["segment2"] = value2;
  //   return returnedData;
  // }
  // var returnValue = keyPostProc(data1, data2)

  // console.log(returnValue)
  
  //return returnValue



















  // dns.resolveTxt('segmented11.csdsuite.com', (err, addresses) => {
  //   if (err) {
  //     console.log("DNS Error: "+err);
  //   }
  //   const segment2 = addresses;
  //   console.log("segment2: "+segment2);
  // });
  // dns.resolveTxt('segmented01.csdsuite.com', (err, addresses) => {
  //   if (err) {
  //     console.log("DNS Error: "+err);
  //   }
  //   const segment1 = addresses;
  //   console.log("segment1: "+segment1);
  // });
};

exports.tsZip = () => {
  const files = fs.readdirSync(userData);

  return files
    .filter((file) => [".zip"].includes(path.extname(file)))
    .map((filename) => {
      const filePath = path.resolve(userData, filename);
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
    dialog.showSaveDialog(
      { defaultPath: publicKeyFile, title: "Export Certificates", buttonLabel: "Save Public Key", filters:[{name: 'OpenPGP Certificates', extensions: ['asc', 'key']}]},
      keyContent,
      console.log
    );
  } catch (err) {
    console.log(err);
    dialog.showErrorBox("app", "Unable to find public key file.");
  }
};