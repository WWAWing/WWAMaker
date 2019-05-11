export default class WWAData {
    private wwaData: Object|null;

    constructor (fileName: string) {
        this.wwaData = null;
        const loaderWorker = new Worker('./wwaload.js');

        loaderWorker.postMessage({
            fileName: fileName
        });
        loaderWorker.addEventListener('message', event => {
            if (event.data.error !== null) {
                throw new Error(event.data.error.message);
            }
            if (event.data.progress === null) {
                this.wwaData = event.data.wwaData;
            }
        });
    }
}
