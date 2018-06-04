'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactSideNav = function (_React$Component) {
	_inherits(ReactSideNav, _React$Component);

	function ReactSideNav(props) {
		_classCallCheck(this, ReactSideNav);

		var _this = _possibleConstructorReturn(this, (ReactSideNav.__proto__ || Object.getPrototypeOf(ReactSideNav)).call(this, props));

		_this.state = {
			//当前激活的列表项id，对应滚动到的dom元素
			activeId: null,
			//计时器id
			intervalId: null,
			//窗口最大滚动距离
			maxScrollHeight: 0
		};
		return _this;
	}
	//节流函数


	_createClass(ReactSideNav, [{
		key: 'throttle',
		value: function throttle(fn, waitTime) {
			var lastTime = 0;
			return function () {
				var currentTime = Date.now();
				if (currentTime - lastTime > waitTime) {
					fn.apply(this, arguments);
					lastTime = currentTime;
				}
			};
		}
		//获取最大滚动距离,这里body和documentElement有区别，注意了

	}, {
		key: 'getMaxScrollHeightAvaliable',
		value: function getMaxScrollHeightAvaliable() {
			//获取网页总高度
			var pageTotalHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			//获取窗口高度
			var windowHeight = window.innerHeight || document.documentElement.clientHeight;
			//计算出窗口可滚动的最大距离
			return pageTotalHeight > windowHeight ? pageTotalHeight - windowHeight : 0;
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			//获取props里面data中对应的dom元素,必须加这个事件，否则可能无法获取dom
			window.addEventListener('load', this.handleOnloadInit.bind(this));
			//获取最大滚动距离
			this.setState({
				maxScrollHeight: this.getMaxScrollHeightAvaliable()
			});
		}
	}, {
		key: 'handleWindowScroll',
		value: function handleWindowScroll(e) {
			var _this2 = this;

			//计算各个id对应的dom的距离视口顶部的距离
			this.props.data.map(function (item) {
				var domEle = document.getElementById(item.id);
				var distToViewtop = _this2.getDistanceToViewportTop(domEle);
				//这里计算规则是各个id对应的div的顶部距离视口顶部的距离的绝对值小于阈值则更新activeId
				if (Math.abs(distToViewtop) < _this2.props.activeDistance) {
					_this2.setState({
						activeId: item.id
					});
				}
			});
		}
		//对对应的dom元素进行offset计算

	}, {
		key: 'handleOnloadInit',
		value: function handleOnloadInit(e) {
			//需要节流,注意这里的节流阈值不能太大，否则快速滚动滚动条会导致对应div未激活
			window.addEventListener('scroll', this.throttle(this.handleWindowScroll.bind(this), 20));
		}
		//获取元素到文档顶部的距离

	}, {
		key: 'getDistanceToDocumentTop',
		value: function getDistanceToDocumentTop(ele) {
			var dist = 0;
			while (ele) {
				dist += ele.offsetTop;
				ele = ele.offsetParent;
			}
			return dist;
		}
		//获取元素到视口顶部的距离

	}, {
		key: 'getDistanceToViewportTop',
		value: function getDistanceToViewportTop(ele) {
			//获取元素到文档顶部的距离
			var distanceToDocumentTop = this.getDistanceToDocumentTop(ele);
			//document的scrollTop
			var documentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			return distanceToDocumentTop - documentScrollTop;
		}
		//处理点击事件

	}, {
		key: 'handleListItemOnClick',
		value: function handleListItemOnClick(itemId) {
			//更新activeId
			this.setState({
				activeId: itemId
			});
			//将window滚动至对应dom元素处
			var targetEle = document.getElementById(itemId);
			var distToDocumentTop = this.getDistanceToDocumentTop(targetEle);
			this.scrollWithAnimation(distToDocumentTop);
		}
		//滚动函数封装：主要是添加动画效果，平滑滚动

	}, {
		key: 'scrollWithAnimation',
		value: function scrollWithAnimation(targetPosY) {
			var _this3 = this;

			clearInterval(this.state.intervalId);
			//如果目标元素的位置大于最大滚动距离则滚动到最大距离
			if (this.state.maxScrollHeight < targetPosY) {
				this.scrollWithAnimation(this.state.maxScrollHeight);
				return;
			}
			//获取当前scrollTop
			var currentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			//计算滚动步长：即每一次动画中滚动的距离
			var stepDistance = Math.abs(targetPosY - currentScrollTop) / this.props.scrollTime * 40;
			//如果目标位置比当前位置大，表示往下滚动
			if (targetPosY >= currentScrollTop) {
				var nextPosY = currentScrollTop + stepDistance;
				var intervalId = setInterval(function () {
					//这里得给一个阈值20，否则会陷入死循环，不知道为啥
					if (Math.abs(nextPosY - targetPosY) < 20) {
						clearInterval(_this3.state.intervalId);
					}
					window.scrollTo(0, nextPosY);
					currentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
					nextPosY = currentScrollTop + stepDistance;
				}, 10);
				this.setState({
					intervalId: intervalId
				});
			} else {
				//往上滚动
				var nextPosY = currentScrollTop - stepDistance;
				var intervalId = setInterval(function () {
					if (nextPosY <= targetPosY) {
						clearInterval(_this3.state.intervalId);
					}
					window.scrollTo(0, nextPosY);
					currentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
					nextPosY = currentScrollTop - stepDistance;
				}, 10);
				this.setState({
					intervalId: intervalId
				});
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			window.removeEventListener('scroll', this.handleWindowScroll);
			window.removeEventListener('load', this.handleOnloadInit);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this4 = this;

			var _props = this.props,
			    position = _props.position,
			    offset = _props.offset;

			var wrapperStyle = position === 'left' ? { left: offset + 'px' } : { right: offset + 'px' };
			return _react2.default.createElement(
				'div',
				{ className: 'react-side-nav-wrapper', style: wrapperStyle },
				_react2.default.createElement(
					'ul',
					null,
					this.props.data.map(function (item, index) {
						return _react2.default.createElement(
							'li',
							{ key: index,
								style: _this4.props.customListItemStyle,
								onClick: function onClick() {
									_this4.handleListItemOnClick(item.id);
								},
								className: 'react-side-nav-wrapper-li ' + (_this4.state.activeId === item.id ? 'react-side-nav-li-acitve' : '')
							},
							item.content
						);
					})
				)
			);
		}
	}]);

	return ReactSideNav;
}(_react2.default.Component);

ReactSideNav.propTypes = {
	//激活距离
	activeDistance: _propTypes2.default.number,
	//滚动时间,单位ms
	scrollTime: _propTypes2.default.number,
	//SideNav数据项
	data: _propTypes2.default.arrayOf(_propTypes2.default.shape({
		id: _propTypes2.default.string,
		content: _propTypes2.default.string
	})).isRequired,
	//位置
	position: _propTypes2.default.oneOf(['left', 'right']),
	//距离左右边缘的距离
	offset: _propTypes2.default.number,
	//自定义列表项样式
	customListItemStyle: _propTypes2.default.object
};
ReactSideNav.defaultProps = {
	activeDistance: 100,
	scrollTime: 1000,
	position: 'right',
	offset: 20
};
exports.default = ReactSideNav;