/* eslint-disable no-plusplus */
/* eslint-disable no-redeclare */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable block-scoped-var */
function changeSlider() {
  const slider = document.getElementById('myRange'); const folderWidget = document.querySelectorAll('[id^="FolderWidget"]'); const fileWidget = document.querySelectorAll('[id^="FileWidget"]'); const folderWidgetWrapper = document.querySelectorAll('[id^="folderWidgetWrapper"]'); const fileWidgetWrapper = document.querySelectorAll('[id^="fileWidgetWrapper"]'); const _folderWidgetClick = document.querySelectorAll('[id^="folderWidgetClick"]'); const _folderWidgetImage = document.querySelectorAll('[id^="folderWidgetImage"]'); const _imgFolderWidget = document.querySelectorAll('[id^="imgFolderWidget"]'); const _folderWidgetText = document.querySelectorAll('[id^="folderWidgetText"]'); const _inputFolderWidget = document.querySelectorAll('[id^="inputFolderWidget"]'); const _fileWidgetClick = document.querySelectorAll('[id^="fileWidgetClick"]'); const _fileWidgetImage = document.querySelectorAll('[id^="fileWidgetImage"]'); const _imgFileWidget = document.querySelectorAll('[id^="imgFileWidget"]'); const _fileWidgetText = document.querySelectorAll('[id^="fileWidgetText"]'); const _inputFileWidget = document.querySelectorAll('[id^="inputFileWidget"]'); for (let i = 0; i < folderWidget.length; i++) { var currentElem = document.getElementById(folderWidget[i].id); var widthInt = 200 * (slider.value / 10); currentElem.style.width = `${widthInt}px`; }
  for (let c = 0; c < folderWidgetWrapper.length; c++) {
    var currentElem = document.getElementById(folderWidgetWrapper[c].id);
    var widthInt = 210 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
    var heightInt = 200 * (slider.value / 10);
    currentElem.style.height = `${heightInt}px`;
  }
  for (let e = 0; e < _folderWidgetClick.length; e++) {
    var currentElem = document.getElementById(_folderWidgetClick[e].id);
    var widthInt = 200 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
  }
  for (let f = 0; f < _folderWidgetImage.length; f++) {
    var currentElem = document.getElementById(_folderWidgetImage[f].id);
    var widthInt = 200 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
    var topInt = 3 * (slider.value / 10);
    currentElem.style.paddingTop = `${topInt}vh`;
  }
  for (let g = 0; g < _imgFolderWidget.length; g++) {
    var currentElem = document.getElementById(_imgFolderWidget[g].id);
    var widthInt = 140 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
  }
  for (let h = 0; h < _folderWidgetText.length; h++) {
    var currentElem = document.getElementById(_folderWidgetText[h].id);
    var widthInt = 200 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
    var topInt = 2 * (slider.value / 10);
    currentElem.style.marginTop = `${topInt}vh`;
    var pBottomInt = 3 * (slider.value / 10);
    currentElem.style.paddingBottom = `${pBottomInt}vh`;
  }
  for (let j = 0; j < _inputFolderWidget.length; j++) {
    var currentElem = document.getElementById(_inputFolderWidget[j].id);
    var widthInt = 200 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
    var topInt = 26 * (slider.value / 10);
    currentElem.style.marginTop = `${topInt}px`;
    var mBottomInt = 39 * (slider.value / 10);
    currentElem.style.marginBottom = `${mBottomInt}px`;
  }
  for (let b = 0; b < fileWidget.length; b++) {
    var currentElem = document.getElementById(fileWidget[b].id);
    var widthInt = 200 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
    var heightInt = 240 * (slider.value / 10);
    currentElem.style.height = `${heightInt}px`;
  }
  for (let d = 0; d < fileWidgetWrapper.length; d++) {
    var currentElem = document.getElementById(fileWidgetWrapper[d].id);
    var widthInt = 200 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
  }
  for (let z = 0; z < _fileWidgetClick.length; z++) {
    var currentElem = document.getElementById(_fileWidgetClick[z].id);
    var widthInt = 200 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
  }
  for (let y = 0; y < _fileWidgetImage.length; y++) {
    var currentElem = document.getElementById(_fileWidgetImage[y].id);
    var widthInt = 200 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
    var topInt = 3 * (slider.value / 10);
    currentElem.style.paddingTop = `${topInt}vh`;
  }
  for (let x = 0; x < _imgFileWidget.length; x++) {
    var currentElem = document.getElementById(_imgFileWidget[x].id);
    var widthInt = 110 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
  }
  for (let w = 0; w < _fileWidgetText.length; w++) {
    var currentElem = document.getElementById(_fileWidgetText[w].id);
    var widthInt = 200 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
    var topInt = 2 * (slider.value / 10);
    currentElem.style.marginTop = `${topInt}vh`;
    var pBottomInt = 3 * (slider.value / 10);
    currentElem.style.paddingBottom = `${pBottomInt}vh`;
  }
  for (let u = 0; u < _inputFileWidget.length; u++) {
    var currentElem = document.getElementById(_inputFileWidget[u].id);
    var widthInt = 200 * (slider.value / 10);
    currentElem.style.width = `${widthInt}px`;
    var topInt = 26 * (slider.value / 10);
    currentElem.style.marginTop = `${topInt}px`;
    var mBottomInt = 40 * (slider.value / 10);
    currentElem.style.marginBottom = `${mBottomInt}px`;
  }
}
