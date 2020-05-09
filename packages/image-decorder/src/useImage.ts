import { useState, useEffect } from "react";

type ImageState = HTMLImageElement | null;

/**
 * 
 * @param imageUrl 
 */
const useImage = (imageUrl: string) => {
    const [imageElement, setImageElement] = useState<ImageState>(null);

    useEffect(() => {
        let image = new Image();
        image.onload = () => {
            setImageElement(image);
        };
        image.onerror = () => {
            setImageElement(null);
        };
        image.src = imageUrl;
    }, [imageUrl]);

    return imageElement;
};

export default useImage;
