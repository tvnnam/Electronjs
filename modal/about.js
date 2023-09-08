//Modal About
const createAboutModal = () => {
  let aboutWindow = new BrowserWindow({
    parent: mainWindow,
    width: 400,
    height: 200,
    show: false,
    modal: true,
  });

  aboutWindow.loadFile("about.html");
  aboutWindow.setMenu(null);
  aboutWindow.once("ready-to-show", () => {
    aboutWindow.show();
  });
};

module.exports = {
  createAboutModal,
};
