const { BrowserWindow, remote, ipcMain } = require("electron");

let profileWindow;
// Window profile
const createProfileWindow = (mainWindow) => {
  profileWindow = new BrowserWindow({
    width: 800,
    height: 600,
    modal: false,
    resizable: false,
    parent: mainWindow,
  });

  profileWindow.loadFile("profile.html");
  profileWindow.setMenu(null);

  profileWindow.on("close", () => {
    console.log("close profile");
    profileWindow = null;
  });
};

module.exports = {
  createProfileWindow,
};
