import React from 'react';
import './App.scss';
import MainToolbar from './components/MainToolbar';
import MainEditArea from './components/MainEditArea';

/**
 * WWA Maker 全体のコンポーネントです。
 */
export default class App extends React.Component {
  public render() {
    return (
      <div>
        <MainToolbar></MainToolbar>
        <MainEditArea></MainEditArea>
      </div>
    );
  }
}
