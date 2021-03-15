// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

process.once("loaded", () => {
  console.log("loaded");
});

const fs = require("fs");
const { contextBridge, ipcRenderer } = require("electron");
const key = require("./main/key");
const crypto = require("./main/crypto");

contextBridge.exposeInMainWorld("api", {
  readFileSync: fs.readFileSync,
  copyFiles: (files = []) => {
    return ipcRenderer.invoke("app:on-file-add", files);
  },
  writeKey: (name, private, public) => {
    return ipcRenderer.invoke("app:on-key-add", name, private, public);
  },
  listKeys: () => {
    return ipcRenderer.invoke("app:get-keys");
  },
  findPublicKey: (keyFile) => {
    return ipcRenderer.invoke("app:find-public-key", keyFile);
  },
  downloadPublicKey: (keyFile) => {
    return ipcRenderer.invoke("app:download-public-key", keyFile);
  },
  reloadKeys: () => {
    return ipcRenderer.sendTo(1, "data:reload-keys");
  },
  onReloadKeys: (callBack) => {
    return ipcRenderer.on("data:reload-keys", (e, ...args) =>
      callBack(...args)
    );
  },
  key: key,
  crypto: crypto,
});
