import webgazer from '../index';

window.addEventListener('load', () => {
  webgazer.begin(() => console.log('Camera unavailable'));
});

webgazer.begin().then(() => {
  webgazer.setGazeListener((data: any) => {
    // noop; dot is moved internally
  });
});
