import React from 'react';

/**
 * InfoPanel は画面右に配置されるパネルのことで、主にパーツの編集やマップデータの情報などではこの InfoPanel から表示されます。
 * 使い勝手としては、 Apple の Pages や WordPress の Gutenberg に近づけています。
 */
export default class InfoPanel extends React.Component {
    public render() {
        return (
            <div>
                <header>
                    <div>インフォパネル</div>
                </header>
                <div>
                    <p>これはテスト。</p>
                </div>
            </div>
        );
    }
}
