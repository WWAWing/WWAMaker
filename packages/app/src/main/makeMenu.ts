import { App, dialog, Menu, MenuItemConstructorOptions } from 'electron';

function makeMenu(): Menu {

    const FILE_FILTERS = [
        { name: 'WWA マップデータ', extensions: ['dat'] },
        { name: 'すべてのファイル', extensions: ['*'] }
    ];

    // FIXME: MenuItemConstructorOptions と明示的な指定が無いと型の不一致が発生する
    const template = [
        {
            label: 'ファイル',
            submenu: [
                { label: '新規作成' },
                // TODO: 別の関数に移す
                { label: '開く', click: () => dialog.showOpenDialogSync({
                    title: 'マップデータを開く',
                    filters: FILE_FILTERS
                }) },
                { label: '上書き保存' },
                // TODO: 別の関数に移す
                { label: '名前を付けて保存', click: () => dialog.showSaveDialogSync({
                    title: 'マップデータを保存',
                    filters: FILE_FILTERS,
                    properties: [
                        'createDirectory'
                    ]
                }) },
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
