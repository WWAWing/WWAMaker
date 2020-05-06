import React from "react";

type GetImageUrl<P> = (prps: P) => string;
type SetImage<P> = (image: HTMLImageElement, props: P) => P;

export default function imageDecorder<P>(getImageUrl: GetImageUrl<P>, setImage: SetImage<P>) {
    return (CurrentComponent: React.Component) => {

        return class extends React.Component<P> {
            public render() {
                return CurrentComponent;
            }
        };

    };
}
