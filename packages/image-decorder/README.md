Image Decorder
===
base64 や objectURL 形式のイメージデータを Canvas の描画に使用できるイメージ変数に変換する高階コンポーネントです。

## 使用方法
```typescript
import React from "react";
import imageDecorder from "wwamaker-image-decorder";

// プロパティは予め定義しておきましょう。
interface Props {
    imageUrl: string,
    image?: HTMLImageElement
}

class SampleComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }
}

export default imageDecorder(
    (props: Props) => props.imageUrl,
    (image: HTMLImageElement, props: Props) => ({ ...props, image })
)(SampleComponent);
```

## API仕様

### imageDecorder
```typescript
imageDecorder(getImage, setImage)(wrappedComponent);
```

- **引数**
    - `getImageUrl(props)` ... イメージURLを取得するコールバックメソッドです。使用されるコンポーネントのプロパティから使用します。
    - `setImage(image, props)` ... 取得したイメージをプロパティにセットするコールバックメソッドです。前述の使用方法のようにスプレッド構文で使用するとより簡潔に記述できます。
- **出力** ... 下記の引数を持つメソッド
    - `wrappedComponent` ... 使用するコンポーネントです。コンポーネント内のプロパティからイメージ変数に変換し、コンポーネント内の別のプロパティに結果を取得します。
