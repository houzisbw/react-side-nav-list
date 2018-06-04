# react-side-nav-list
A react side navlist similar to Bilibili's sidenav
![img](https://github.com/houzisbw/react-side-nav-list/blob/master/images/draw.gif)
Cilck the content on side-nav will scroll the window to target element
## Installation
##### NPM
```bash
npm install --save react-side-nav-list
```
##### Yarn
```bash
yarn add react-side-nav-list
```
## Usage
The prop **data** is required and the format must be the list with object {id:string,content:string}, the **id** refers to the dom element's id,which helps the plugin to find target dom element,the **content** is the text word on nav list
```js
import ReactSideNav from 'react-side-nav-list'
let dataList = [
  {
    id:'div1',
    content:'firstSection'
  },
  {
    id:'div2',
    content:'SecondSection'
  },
  {
    id:'div3',
    content:'ThirdSection'
  },
  {
    id:'div4',
    content:'FourthSection'
  },
]
<ReactSideNav data={dataList}/>
```
## Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| position | string | 'right' | SideBar position on window('right','left') |
| activeDistance | number | 100 | the distance to viewport top when the target dom element is active |
| scrollTime | number | 1000 | scroll time to target dom element,milliseconds |
| offset | number | 20 | offset of NavBar to left or right side of document |
| customListItemStyle | object | {} | the custom style of nav-list,you can modify to your favourites's style |
