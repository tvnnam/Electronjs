const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  Menu,
  dialog,
} = require("electron");
const path = require("path");
const fs = require("fs");
const profileWindow = require("./windows");
const aboutModal = require("./windows");

const isMac = process.platform === "darwin";

const menuTemplate = [
  {
    label: "Application",
    submenu: [
      {
        label: "About",
        click: () => {
          aboutModal.createAboutModal();
        },
      },
    ],
  },
  {
    label: "Developer",
    submenu: [
      {
        label: "Toggle Developer Tools",
        accelerator: isMac ? "Alt+Cmd+I" : "Ctrl+Shift+I",
        click: () => {
          mainWindow.webContents.toggleDevTools();
        },
      },
    ],
  },
  {
    label: "File",
    submenu: [
      {
        label: "File",
        accelerator: "CmdOrCtrl+O",
        click: () => {
          openFile();
        },
      },
    ],
  },
];

let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile("index.html");
  const menu = Menu.buildFromTemplate(menuTemplate);
  mainWindow.setMenu(menu);

  mainWindow.on("close", () => {
    mainWindow = null;
  });
};

//Open File
const openFile = () => {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
    })
    .then((result) => {
      console.log(result);
      if (!result.canceled) {
        const fileContent = fs
          .readFileSync(result.filePaths[0])
          .toString("base64");
        const _out = '<img src="data:image/png;base64,' + fileContent + '" />';
        console.log(_out);
      }
    });
};

ipcMain.handle("dark-mode:toggle", () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = "light";
  } else {
    nativeTheme.themeSource = "dark";
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:system", () => {
  nativeTheme.themeSource = "system";
});

ipcMain.on("dialog-profile:open", () => {
  profileWindow.createProfileWindow(mainWindow);
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
