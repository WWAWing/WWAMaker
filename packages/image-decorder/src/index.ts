import React from "react";

type GetImageUrl<P> = (prps: P) => string | null;
type SetImage<P> = (image: HTMLImageElement, props: P) => P;

interface State {
    image: HTMLImageElement | null;
}

export default function imageDecorder<P>(getImageUrl: GetImageUrl<P>, setImage: SetImage<P>) {
    return (wrappedComponent: React.FunctionComponent<P> | React.ComponentClass<P>) => {

        return class extends React.Component<P, State> {
            constructor(props: P) {
                super(props);
                this.state = {
                    image: null
                };
            }

            public componentDidMount() {
                this.createImage();
            }

            public componentDidUpdate() {
                this.createImage();
            }

            public shouldComponentUpdate(nextProps: P) {
                return getImageUrl(nextProps) !== getImageUrl(this.props);
            }

            public createImage() {
                const imageUrl = getImageUrl(this.props);
                if (imageUrl === null) {
                    return;
                }

                let image = new Image();
                image.onload = () => {
                    this.setState({
                        image
                    });
                };
                image.onerror = () => {
                    this.setState({
                        image: null
                    });
                };
                image.src = imageUrl;
            }

            public render() {
                if (this.state.image === null) {
                    return React.createElement(wrappedComponent, this.props);
                }

                const props = setImage(this.state.image, this.props);
                return React.createElement(wrappedComponent, props);
            }
        };

    };
}
