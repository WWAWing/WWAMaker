import { Menu, MenuItemConstructorOptions } from 'electron';

function makeMenu(): Menu {

    // FIXME: MenuItemConstructorOptions と明示的な指定が無いと型の不一致が発生する
    const template = [
        {
            label: 'ファイル',
            submenu: [
                { label: '新規作成' },
                { label: '開く' },
                { label: '上書き保存' },
                { label: '名前を付けて保存' },
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
        }
    ];
    
    return Menu.buildFromTemplate(template);

}

export default makeMenu;
