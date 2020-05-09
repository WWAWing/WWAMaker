import React, { useEffect, useState } from "react";

type GetImageUrl<P> = (prps: P) => string | null;
type SetImage<P> = (image: HTMLImageElement, props: P) => P;

type ImageState = HTMLImageElement | null;

// FIXME: 実装すると wrappedComponent の defaultProps が外れる
export default function imageDecorder<P>(getImageUrl: GetImageUrl<P>, setImage: SetImage<P>) {
    return (wrappedComponent: React.FunctionComponent<P> | React.ComponentClass<P>) => {

        return (props: P) => {
            const [imageElement, setImageElement] = useState<ImageState>(null);

            useEffect(() => {
                const imageUrl = getImageUrl(props);
                if (imageUrl === null) {
                    return;
                }

                let image = new Image();
                image.onload = () => {
                    setImageElement(image);
                };
                image.onerror = () => {
                    setImageElement(null);
                };
                image.src = imageUrl;

            }, [getImageUrl(props)]);

            if (imageElement === null) {
                return React.createElement(wrappedComponent, props);
            }

            const mergedProps = setImage(imageElement, props);
            return React.createElement(wrappedComponent, mergedProps);
        }

    };
}
