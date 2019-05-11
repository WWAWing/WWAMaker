import React from 'react';
import './App.scss';
import MainToolbar from './components/MainToolbar';
import MainEditArea from './components/MainEditArea';

export default function App() {
  return (
    <div className="App">
      <MainToolbar></MainToolbar>
      <MainEditArea></MainEditArea>
    </div>
  );
}
