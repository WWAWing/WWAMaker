import makeMenu from './makeMenu';
import { app, BrowserWindow, Menu } from 'electron';

function createWindow () {
    // ブラウザウインドウを作成
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    // TODO: production 時の URL も用意しておく
    // TODO: 今後は webpack-dev-server と組み込む形でなるように検討する
    const url = "http://localhost:3000";

    // そしてこのアプリの index.html をロード
    win.loadURL(url);

    Menu.setApplicationMenu(makeMenu(win));
}

app.whenReady().then(createWindow);
