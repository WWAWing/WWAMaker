const Worker = require('worker_threads').Worker;

// このファイルは、 WWA Saver のテストファイルです。Node.js で実行してください。
// TODO: Node では WWA Loader に対応していないため、 Event Emitter が publish されるのを待つ
const loader = new Worker('./wwaload.js');

loader.on('message', (event) => {
    if (event.data.error === null && event.data.progress === null) {
        console.log(event.data.wwaData);
    }
});

loader.postMessage({
    fileName: 'wwamap.dat'
});
