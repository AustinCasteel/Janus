$("#SEF-cancel-btn").on("click", function() {
    window.location.replace("./index.html");
});

$("#2-1").removeAttr("style").hide();
$("#3-1").removeAttr("style").hide();

$("#btn-step-2").on("click", function() {
  $("#1-1").removeAttr("style").hide();
  $("#2-1").show();
});

$("#btn-step-3").on("click", function() {
  $("#2-1").removeAttr("style").hide();
  $("#3-1").show();
});



$("#save-enc-section").removeAttr("style").hide();
// $("#btn-save-enc").removeAttr("style").hide();
$("#btn-show-enc").removeAttr("style").hide();
$("#pw").removeAttr("style").hide();
$("#processing").removeAttr("style").hide();

$("#sel-keys")
  .on("change", () => {
    const keyFile =
      savedKeys.find((key) => key.name == $("#sel-keys").val());
    if (!keyFile) {
      $("#txt-key-id").text("Key information");
      $("#txt-key-email").text(null);
      $("#txt-key-fp").text(null);
      return;
    }
    console.log(keyFile);

    const keyType = getKeyType(keyFile);
    if (keyType < 0) {
      alert(
        "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
      );
      return;
    }

    window.api.key
      .readKeyFile(keyFile.path, keyType == 0)
      .then((privateKey) => {
        console.log(privateKey);
        const userInfo = privateKey.users[0].userId;
        $("#txt-key-id").text(userInfo.name);
        $("#txt-key-email").text(userInfo.email);
        const fingerprint = privateKey.keyPacket.fingerprint;
        const fpr = toHex(fingerprint).toUpperCase();
        $("#txt-key-fp").text(fpr.slice(0, 4) + ' ' + fpr.slice(4, 8) + ' ' + fpr.slice(8, 12) + ' ' + fpr.slice(12, 16) + ' ' + fpr.slice(16, 20) + ' ' + fpr.slice(20, 24) + ' ' + fpr.slice(24, 28) + ' ' + fpr.slice(28, 32) + ' ' + fpr.slice(32, 36) + ' ' + fpr.slice(36));
      })
      .catch(alert);

      $("#pw").show();
  });

$("#btn-export-key").on("click", (e) => {
  e.preventDefault();

  const keyFile = savedKeys.find((key) => key.name == $("#sel-keys").val());
  if (!keyFile) {
    alert("Please select a key pair from list");
    return;
  }

  window.api.downloadPublicKey(keyFile.name);
});

$("#btn-encrypt").on("click", function (e) {
  e.preventDefault();

  let keyFile =
    savedKeys.find((key) => key.name == $("#sel-keys").val());
  if (new RegExp("private|pvt").test(keyFile.name)) {
    window.api
      .findPublicKey(keyFile.name)
      .then((k) => {
        console.log(k);
        encryptWithKey(k);
      })
      .catch(alert);
  } else {
    encryptWithKey(keyFile);
  }
});

// $("#btn-save-zip").on("click", function (e) {
//   e.preventDefault();
//   let vpnUN = $("#vpn-un").val();
//   let vpnPW = $("#vpn-pw").val();
//   let vpnConfig = $("#vpn-config").val();
//   window.api.writeVpn(vpnUN, vpnPW, vpnConfig)
// });

$("#btn-save-zip").on("click", function() {
  var vpnUN = $.trim($("#vpn-un").val());
  var vpnPW = $.trim($('#vpn-pw').val());
  var vpnConfig = $.trim($('#vpn-config').val());
  var zip = new JSZip();
  zip.file("username.txt", vpnUN);
  zip.file("password.txt", vpnPW);
  zip.file("config.txt", vpnConfig);
  zip.generateAsync({type:"blob"})
  .then(function(content) {
      saveAs(content, "Config.zip");
  });
});

$("#btn-show-enc").on("click", function (e) {
  e.preventDefault();
  const abc = window.api.crypto
    .armorMessage(lastEncryptedMessage)
    .then((armoredMessage) => {
      $("#msg-encrypted").val(armoredMessage);
    })
    .catch(alert);
  console.log(abc);
});

$("#btn-save-enc").on("click", function (e) {
  e.preventDefault();

  const element = document.createElement("a");
  const file = new Blob([lastEncryptedMessage], { type: "application/pgp-encrypted" });
  element.href = URL.createObjectURL(file);
  element.download = lastEncryptedMessage.path ?? "EncryptedConfig.zip.gpg";
  element.click();
});

function encryptWithKey(keyFile) {
  if (!keyFile) {
    alert("Please select a public key from list or import from file");
    return;
  }
  console.log(keyFile);

  const keyType = getKeyType(keyFile);
  if (keyType < 0) {
    alert(
      "Unknown key file format. Please use *.key for binary or *.asc for armored ASCII"
    );
    return;
  }

  const plainFile = document.getElementById("file-plain").files[0];
  // const plainMessage = $("#msg-plain").val();
  if (plainFile) {
    $("#btn-encrypt").removeAttr("style").hide();
    $("#btn-save-enc").removeAttr("style").hide();
    $("#processing").show();
    console.log(plainFile);
    window.api.crypto
      .encryptFile(keyFile.path, keyType == 0, plainFile.path)
      .then((encryptedMessage) => {
        console.log(encryptedMessage);
        lastEncryptedMessage = encryptedMessage;
        alert("File was encrypted successfully. Remember to Save it!");
        $("#btn-save-enc").show();
        $("#processing").removeAttr("style").hide();
        $("#btn-encrypt").show();
      })
      .catch(alert);
    return;
  // } else if (plainMessage && !plainMessage.empty) {
  //   console.log(plainMessage);
  //   window.api.crypto
  //     .encryptText(keyFile.path, keyType == 0, plainMessage)
  //     .then((encryptedMessage) => {
  //       console.log(encryptedMessage);
  //       lastEncryptedMessage = encryptedMessage;
  //       alert("Data was encrypted successfully. Remember Save it!");
  //     })
  //     .catch(alert);
  //   return;
  } else {
    alert("Please provide an plain file or paste in text box");
    return;
  }
}

function getKeyType(keyFile) {
  let extension = keyFile.name.split(".").reverse()[0];
  console.log(extension);
  if (extension == "key") {
    console.log("binary");
    return 0;
  } else if (extension == "asc") {
    console.log("ascii");
    return 1;
  }
  return -1;
}

function bindKeys(files = []) {
  $("#sel-keys").empty();
  $("#sel-keys").append(new Option("Select a key.."));
  savedKeys = files
    .filter((file) => new RegExp("private|pvt").test(file.name))
    .map(fileToKey);
  savedKeys.forEach((key) => {
    $("#sel-keys").append(new Option(key.title, key.name));
  });
}

function bindKeys2(files = []) {
  $("#sel-keys2").empty();
  savedKeys2 = files
    .filter((file) => new RegExp("private|pvt").test(file.name))
    .map(fileToKey);
  savedKeys2.forEach((key) => {
    $("#sel-keys2").append(new Option(key.title, key.name));
  });
}

function bindKeys3(files = []) {
  $("#sel-keys3").empty();
  savedKeys3 = files
    .filter((file) => new RegExp("ConfigFiles").test(file.name))
    .map(filesToFile)
  console.log(files);
  savedKeys3.forEach((file) => {
    console.log(file);
    $("#sel-keys3").append(new Option(file));
  });
}

function fileToKey(file) {
  let fileElements = file.name.split("-");
  fileElements.pop();
  return {
    title: fileElements.join(" "),
    name: file.name,
    path: file.path,
  };
}
function filesToFile(file) {
  return {
    name: file.name,
    path: file.path,
  };
}

let savedKeys = [];
let savedKeys2 = [];
let savedKeys3 = [];
let lastPlainMessage;
let lastEncryptedMessage;

window.api.onReloadKeys((args) => {
  console.log("on Reload Keys");
  window.api.listKeys().then(bindKeys).catch(alert);
});

(() => {
  window.api.listKeys().then(bindKeys).catch(alert);
  window.api.vpnKey().then(bindKeys2).catch(alert);
})();

function toHex(buffer) {
  return Array.prototype.map
    .call(buffer, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}