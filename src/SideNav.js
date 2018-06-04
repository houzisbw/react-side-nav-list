import React from 'react'
import PropTypes from 'prop-types'
import './index.css'
class ReactSideNav extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//当前激活的列表项id，对应滚动到的dom元素
			activeId:null,
			//计时器id
			intervalId:null,
			//窗口最大滚动距离
			maxScrollHeight:0
		}
	}
	//节流函数
	throttle(fn,waitTime){
		let lastTime = 0;
		return function(){
			let currentTime = Date.now();
			if(currentTime - lastTime > waitTime){
				fn.apply(this,arguments);
				lastTime = currentTime;
			}
		}
	}
	//获取最大滚动距离,这里body和documentElement有区别，注意了
	getMaxScrollHeightAvaliable(){
		//获取网页总高度
		let pageTotalHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
		//获取窗口高度
		let windowHeight = window.innerHeight || document.documentElement.clientHeight;
		//计算出窗口可滚动的最大距离
		return pageTotalHeight>windowHeight ? pageTotalHeight-windowHeight : 0;
	}
	componentDidMount(){
		//获取props里面data中对应的dom元素,必须加这个事件，否则可能无法获取dom
		window.addEventListener('load',this.handleOnloadInit.bind(this));
		//获取最大滚动距离
		this.setState({
			maxScrollHeight:this.getMaxScrollHeightAvaliable()
		})
	}
	handleWindowScroll(e){
		//计算各个id对应的dom的距离视口顶部的距离
		this.props.data.map((item)=>{
			let domEle = document.getElementById(item.id);
			let distToViewtop = this.getDistanceToViewportTop(domEle);
			//这里计算规则是各个id对应的div的顶部距离视口顶部的距离的绝对值小于阈值则更新activeId
			if(Math.abs(distToViewtop)<this.props.activeDistance){
				this.setState({
					activeId:item.id
				})
			}
		})
	}
	//对对应的dom元素进行offset计算
	handleOnloadInit(e){
		//需要节流,注意这里的节流阈值不能太大，否则快速滚动滚动条会导致对应div未激活
		window.addEventListener('scroll',this.throttle(this.handleWindowScroll.bind(this),20))
	}
	//获取元素到文档顶部的距离
	getDistanceToDocumentTop(ele){
		let dist = 0;
		while(ele){
			dist += ele.offsetTop;
			ele = ele.offsetParent;
		}
		return dist;
	}
	//获取元素到视口顶部的距离
	getDistanceToViewportTop(ele){
		//获取元素到文档顶部的距离
		let distanceToDocumentTop = this.getDistanceToDocumentTop(ele);
		//document的scrollTop
		let documentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		return distanceToDocumentTop - documentScrollTop;
	}
	//处理点击事件
	handleListItemOnClick(itemId){
		//更新activeId
		this.setState({
			activeId:itemId
		});
		//将window滚动至对应dom元素处
		let targetEle = document.getElementById(itemId);
		let distToDocumentTop = this.getDistanceToDocumentTop(targetEle);
		this.scrollWithAnimation(distToDocumentTop);

	}
	//滚动函数封装：主要是添加动画效果，平滑滚动
	scrollWithAnimation(targetPosY){
		clearInterval(this.state.intervalId)
		//如果目标元素的位置大于最大滚动距离则滚动到最大距离
		if(this.state.maxScrollHeight < targetPosY){
			this.scrollWithAnimation(this.state.maxScrollHeight);
			return
		}
		//获取当前scrollTop
		var currentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		//计算滚动步长：即每一次动画中滚动的距离
		var stepDistance = Math.abs(targetPosY - currentScrollTop) / this.props.scrollTime*40;
		//如果目标位置比当前位置大，表示往下滚动
		if(targetPosY>=currentScrollTop){
			var nextPosY = currentScrollTop +stepDistance;
			var intervalId = setInterval(()=>{
				//这里得给一个阈值20，否则会陷入死循环，不知道为啥
				if(Math.abs(nextPosY-targetPosY)<20){
					clearInterval(this.state.intervalId);
				}
				window.scrollTo(0,nextPosY);
				currentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
				nextPosY = currentScrollTop +stepDistance;

			},10);
			this.setState({
				intervalId:intervalId
			})
		}else{
			//往上滚动
			var nextPosY = currentScrollTop - stepDistance;
			var intervalId = setInterval(()=>{
				if(nextPosY<=targetPosY){
					clearInterval(this.state.intervalId)
				}
				window.scrollTo(0,nextPosY);
				currentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
				nextPosY = currentScrollTop -stepDistance;

			},10);
			this.setState({
				intervalId:intervalId
			})
		}
	}
	componentWillUnmount(){
		window.removeEventListener('scroll',this.handleWindowScroll);
		window.removeEventListener('load',this.handleOnloadInit);
	}
	render(){
		let {position,offset} = this.props;
		let wrapperStyle = position==='left'?{left:offset+'px'}:{right:offset+'px'};
		return (
			<div className="react-side-nav-wrapper" style={wrapperStyle}>
				<ul>
					{this.props.data.map((item,index)=>{
						return (
							<li key={index}
								style={this.props.customListItemStyle}
								onClick={()=>{this.handleListItemOnClick(item.id)}}
								className={`react-side-nav-wrapper-li ${this.state.activeId === item.id ? 'react-side-nav-li-acitve':''}`}
							>
								{item.content}
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}
ReactSideNav.propTypes = {
	//激活距离
	activeDistance:PropTypes.number,
	//滚动时间,单位ms
	scrollTime:PropTypes.number,
	//SideNav数据项
	data:PropTypes.arrayOf(PropTypes.shape({
		id:PropTypes.string,
		content:PropTypes.string
	})).isRequired,
	//位置
	position:PropTypes.oneOf(['left','right']),
	//距离左右边缘的距离
	offset:PropTypes.number,
	//自定义列表项样式
	customListItemStyle:PropTypes.object
};
ReactSideNav.defaultProps = {
	activeDistance:100,
	scrollTime:1000,
	position:'right',
	offset:20
};
export default ReactSideNav
