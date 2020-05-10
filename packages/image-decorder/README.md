Image Decorder
===
base64 や objectURL 形式のイメージデータを Canvas の描画に使用できるイメージ変数に変換する React の カスタムフックです。

## 使用方法
```typescript
import React from "react";
import { useImage } from "wwamaker-image-decorder";

const SampleComponent: React.FC<{
    imageUrl: string
}> = props => {
    // そのまま useImage にイメージのURLを入れておくだけで使用できます。
    const image = useImage(props.imageUrl);

    return (
        // ...
    );
}
```

## API仕様
useImage は React の Hooks API で実装したメソッドです。

### useImage
```typescript
const image = useImage(imageUrl);
```

- **引数**
    - `imageUrl` ... イメージURL
- **出力** ... イメージ要素
