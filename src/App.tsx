import { Component, createResource } from 'solid-js';

import styles from './App.module.css';
import QrScanner from 'qr-scanner';
import { createEffect, createSignal } from 'solid-js';

let videoRef: HTMLVideoElement;

function parseData(qr: string) {
  const d = qr.split('mint?jwt=');
  console.log({ d });
  if (d.length == 2) {
    const jwt = parseJwt(d[1]);
    console.log({ jwt });
  }
}

function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

const App: Component = () => {
  const [cameras] = createResource<QrScanner.Camera[]>(async () => {
    return await QrScanner.listCameras();
  });

  createEffect(() => {
    const scanner = new QrScanner(
      videoRef,
      (result) => {
        parseData(result.data);
      },
      {
        preferredCamera:
          // '7b1d19dd3625d8defe4a41f48d64ef3e8c930c4bc038e8154c3eb4b913292cf1',
          'e1d4cfef1e54845623ea53cb5d592d454c1cb2644095f41dc7593a425c749c4f',
      }
    );

    scanner.start();
  });

  return (
    <div class={styles.App}>
      {/* <header class={styles.header}>
        
      </header> */}
      {!cameras.loading &&
        cameras()?.map((camera) => {
          // console.log(camera);
          return <li>{camera.label}</li>;
        })}
      <video ref={videoRef}></video>
    </div>
  );
};

export default App;
