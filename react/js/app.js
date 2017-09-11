'use strict';

(function () {
	var BANNER_NUM = 2;
	var ITEM_NUM = 33;
	/***定义加载库***/
	var textDOM = $(".install span");
	var DATABASE = [];

	var TypeAction = Reflux.createActions(['changeType']);
	var TypeStore = Reflux.createStore({
		listenables: [TypeAction],
		onChangeType: function onChangeType(id) {
			var result = [];
			DATABASE.forEach(function (obj, index) {
				if (obj.type === id) {
					result.push(obj);
				}
			});
			this.trigger(result);
		}
	});
	var SearchAction = Reflux.createActions(['changeSearch']);
	var SearchStore = Reflux.createStore({
		listenables: [SearchAction],
		onChangeSearch: function onChangeSearch(query) {
			var result = [];
			DATABASE.forEach(function (obj, index) {
				for (var i in obj) {
					if (obj[i].indexOf(query) >= 0) {
						result.push(obj);
						return;
					}
				}
			});
			console.log(query);
			console.log(result);
			this.trigger(result);
		}
	});

	// 定义混合
	var RenderObj = {
		getBackgroundUrl: function getBackgroundUrl() {
			return 'url(img/item/item' + parseInt(Math.random() * ITEM_NUM) + '.jpg)';
		},
		createList: function createList() {
			// console.log(this.state.list)
			return this.state.list.map((function (obj, index) {
				var styleObj = {
					backgroundImage: this.getBackgroundUrl()
				};
				return React.createElement(
					'li',
					{ key: index, style: styleObj },
					React.createElement(
						'a',
						{ href: obj.size },
						React.createElement(
							'div',
							{ className: 'content' },
							React.createElement(
								'h2',
								null,
								obj.name
							)
						),
						React.createElement(
							'div',
							{ className: 'layer' },
							React.createElement(
								'p',
								null,
								'公司：' + obj.company
							),
							React.createElement(
								'p',
								null,
								'类型：' + obj.type
							),
							React.createElement(
								'p',
								null,
								'描述：' + obj.description
							)
						)
					)
				);
			}).bind(this));
		}
	};

	var Home = React.createClass({
		displayName: 'Home',

		mixins: [RenderObj],
		getInitialState: function getInitialState() {
			return {
				list: DATABASE
			};
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'section' },
				React.createElement(
					'div',
					{ className: 'container' },
					React.createElement(
						'ul',
						{ className: 'clearfixed' },
						this.createList()
					)
				)
			);
		}
	});
	var Type = React.createClass({
		displayName: 'Type',

		mixins: [RenderObj, Reflux.connect(TypeStore, 'list')],
		getInitialState: function getInitialState() {
			return {
				list: []
			};
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'section' },
				React.createElement(
					'div',
					{ className: 'container' },
					React.createElement(
						'ul',
						{ className: 'clearfixed' },
						this.createList()
					)
				)
			);
		}
	});
	var Search = React.createClass({
		displayName: 'Search',

		mixins: [RenderObj, Reflux.connect(SearchStore, 'list')],

		getInitialState: function getInitialState() {
			return {
				list: []
			};
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'section' },
				React.createElement(
					'div',
					{ className: 'container' },
					React.createElement(
						'ul',
						{ className: 'clearfix' },
						this.createList()
					)
				)
			);
		}
	});
	var Link = ReactRouter.Link;
	var Banner = React.createClass({
		displayName: 'Banner',

		getInitialState: function getInitialState() {
			return {
				searchValue: ''
			};
		},
		goHome: function goHome() {
			ReactRouter.hashHistory.replace('/');
		},
		changeValue: function changeValue(e) {
			var val = e.target.value;
			this.setState({
				searchValue: val
			});
		},
		goSearch: function goSearch(e) {
			if (e.keyCode === 13) {

				if (/^\s*$/.test(this.state.searchValue)) {
					alert("请输入内容");
					return;
				} else {
					ReactRouter.hashHistory.replace('/search/' + this.state.searchValue);
					this.setState({
						searchValue: ''
					});
				}
			}
		},
		render: function render() {

			return React.createElement(
				'div',
				{ className: 'header' },
				React.createElement(
					'div',
					{ className: 'header-top' },
					React.createElement(
						'div',
						{ className: 'container' },
						React.createElement('img', { onClick: this.goHome, src: 'img/logo.png', alt: '', className: 'logo pull-left' }),
						React.createElement(
							'div',
							{ className: 'search pull-right' },
							React.createElement('input', { onKeyDown: this.goSearch, onChange: this.changeValue, value: this.state.searchValue, type: 'text', className: 'form-control' })
						),
						React.createElement(
							'ul',
							{ className: 'nav nav-pills nav-justified' },
							React.createElement(
								'li',
								null,
								React.createElement(
									Link,
									{ to: '/type/movie' },
									'视频'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									Link,
									{ to: '/type/games' },
									'游戏'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									Link,
									{ to: '/type/news' },
									'新闻'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									Link,
									{ to: '/type/sports' },
									'体育'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									Link,
									{ to: '/type/buy' },
									'购物'
								)
							),
							React.createElement(
								'li',
								null,
								React.createElement(
									Link,
									{ to: '/type/friends' },
									'社交'
								)
							)
						)
					)
				),
				React.createElement('div', { className: 'banner banner-1' })
			);
		}
	});
	var App = React.createClass({
		displayName: 'App',

		render: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(Banner, null),
				this.props.children
			);
		},
		checkRoute: function checkRoute() {
			if (this.props.location.pathname.indexOf('/type/') === 0) {
				TypeAction.changeType(this.props.params.id);
			} else if (this.props.location.pathname.indexOf('/search/') === 0) {
				SearchAction.changeSearch(this.props.params.query);
			}
		},
		componentDidMount: function componentDidMount() {
			this.checkRoute();
		},
		componentDidUpdate: function componentDidUpdate() {
			this.checkRoute();
		}
	});
	// 第二步定义路由规则
	// 缓存路由组件
	var Router = ReactRouter.Router;
	var Route = ReactRouter.Route;
	var IndexRoute = ReactRouter.IndexRoute;
	var Redirect = ReactRouter.Redirect;
	// 定义路由规则
	var routes = React.createElement(
		Router,
		null,
		React.createElement(
			Route,
			{ path: '/', component: App },
			React.createElement(Route, { path: 'type/:id', component: Type }),
			React.createElement(Route, { path: 'search/:query', component: Search }),
			React.createElement(IndexRoute, { component: Home })
		),
		React.createElement(Redirect, { path: '*', to: '/' })
	);

	function ImageLoader(done, success, fail) {
		this.done = done || function () {};
		this.success = success || function () {};
		this.fail = fail || function () {};
		this.init();
	}
	ImageLoader.prototype = {
		init: function init() {
			this.itemNum = ITEM_NUM;
			this.bannerNum = BANNER_NUM;
			this.total = this.itemNum + this.bannerNum;
			this.loaderImage();
		},
		loaderImage: function loaderImage() {
			var num = this.bannerNum;
			while (--num >= 0) {
				this.loadImageItem(num, true);
			}
			var num = this.itemNum;
			while (--num >= 0) {
				this.loadImageItem(num);
			}
		},
		loadImageItem: function loadImageItem(num, isBanner) {
			var img = new Image();
			img.onload = (function () {
				this.total--;
				this.success(this.total, this.itemNum + this.bannerNum);
				if (this.total === 0) {
					this.done(this.total, this.itemNum + this.bannerNum);
				}
			}).bind(this);
			img.onerror = (function () {
				this.total--;
				this.fail(this.total, this.itemNum + this.bannerNum);
				if (this.total === 0) {
					this.done(this.total, this.itemNum + this.bannerNum);
				}
			}).bind(this);
			img.src = this.getImageUrl(num, isBanner);
		},
		getImageUrl: function getImageUrl(num, isBanner) {
			if (isBanner) {
				return 'img/banner/banner' + num + '.jpg';
			} else {
				return 'img/item/item' + num + '.jpg';
			}
		}
	};
	new ImageLoader(function (current, total) {
		// console.log('done', arguments)
		textDOM.html(((1 - current / total) * 100).toFixed(2));
		$.get('data/sites.json').success(function (res) {
			// console.log('success', res)
			// 请求成功，将数据存储
			if (res && res.errno === 0) {
				DATABASE = res.data;
				// console.log(DATABASE)
				// // 渲染组件
				// // 第三步 渲染路由
				ReactDOM.render(routes, jQuery('#app').get(0));
			}
		});
	}, function (current, total) {
		// console.log('success', arguments)
		textDOM.html(((1 - current / total) * 100).toFixed(2));
	}, function (current, total) {
		// console.log('fail', arguments)
		textDOM.html(((1 - current / total) * 100).toFixed(2));
	});
})(React, ReactRouter, jQuery, Reflux.ReactDOM);