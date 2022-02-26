import makeMenu from './makeMenu';
import WWAMakerApp from '../core/WWAMakerApp';
import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import messages from "../messages";

function createWindow () {
    // ブラウザウインドウを作成
    let win = new BrowserWindow({
        width: 1344,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    });

    let app = new WWAMakerApp(win);

    // TODO: 今後は webpack-dev-server と組み込む形でなるように検討する
    const url = process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : path.join(__dirname, "../../../maker/public/index.html");

    // そしてこのアプリの index.html をロード
    win.loadURL(url);

    messages.setLoadMessages(app);
    messages.setMessageMessages(app);
    messages.setTestPlayMessages(app);

    if (process.platform === "darwin") {
        Menu.setApplicationMenu(makeMenu(app));
    } else {
        win.setMenu(makeMenu(app));
    }
}

app.whenReady().then(() => {
    installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
        .then(name => console.log(`Added Extension: ${name}`))
        .catch(error => console.error(`An error occured: `, error));
    createWindow();
});
