import makeMenu from './makeMenu';
import WWAMakerApp from '../core/WWAMakerApp';
import { app, BrowserWindow, Menu } from 'electron';
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
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
    let debugWin = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        resizable: false,
        maximizable: false,
        minimizable: false,
        // TODO: 特にメニューバーは必要ないのに Alt を押すと表示されてしまう、修正したい
        autoHideMenuBar: true,
        parent: win
    });

    let app = new WWAMakerApp(win, debugWin);

    // TODO: production 時の URL も用意しておく
    // TODO: 今後は webpack-dev-server と組み込む形でなるように検討する
    const url = "http://localhost:3000";

    // そしてこのアプリの index.html をロード
    win.loadURL(url);

    messages.setLoadMessages(app);
    messages.setMessageMessages(app);
    messages.setTestPlayMessages(app);

    Menu.setApplicationMenu(makeMenu(app));
}

app.whenReady().then(() => {
    installExtension(REDUX_DEVTOOLS)
        .then(name => console.log(`Added Extension: ${name}`))
        .catch(error => console.error(`An error occured: `, error));
    createWindow();
});
