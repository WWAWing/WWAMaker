import { Menu, MenuItemConstructorOptions } from 'electron';
import WWAMakerApp from '../core/WWAMakerApp';

function makeMenu(app: WWAMakerApp): Menu {

    // FIXME: MenuItemConstructorOptions と明示的な指定が無いと型の不一致が発生する
    const template = [
        {
            label: 'ファイル',
            submenu: [
                { label: '新規作成' },
                // TODO: 別の関数に移す
                { label: '開く', click: () => app.openWithDialog() },
                { label: '上書き保存', click: () => app.save() },
                // TODO: 別の関数に移す
                { label: '名前を付けて保存', click: () => app.saveWithDialog() },
                { type: 'separator' },
                { role: 'quit' }
            ] as MenuItemConstructorOptions[]
        }, {
            label: '編集',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' }
            ] as MenuItemConstructorOptions[]
        }, {
            label: '表示',
            submenu: [

            ]
        }, {
            label: 'ヘルプ',
            submenu: [

            ]
        }, {
            label: '開発',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' }
            ] as MenuItemConstructorOptions[]
        }
    ];
    
    return Menu.buildFromTemplate(template);

}

export default makeMenu;
