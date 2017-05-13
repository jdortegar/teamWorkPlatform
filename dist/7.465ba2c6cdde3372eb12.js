webpackJsonp([7],{

/***/ 1215:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Button = __webpack_require__(72);

var _Button2 = _interopRequireDefault(_Button);

var _reactRouter = __webpack_require__(44);

var _components = __webpack_require__(112);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProfileNotify = function (_Component) {
	_inherits(ProfileNotify, _Component);

	function ProfileNotify(props) {
		_classCallCheck(this, ProfileNotify);

		var _this = _possibleConstructorReturn(this, (ProfileNotify.__proto__ || Object.getPrototypeOf(ProfileNotify)).call(this, props));

		_this.state = { term: '' };
		return _this;
	}

	_createClass(ProfileNotify, [{
		key: 'handleChange',
		value: function handleChange(term) {
			this.setState({ term: term });

			// Todo: Implement Autocomplete function
		}
	}, {
		key: 'render',
		value: function render() {
			var country = this.state.country;
			return _react2.default.createElement(
				'div',
				{ className: 'container-fluid' },
				_react2.default.createElement(_components.Header, null),
				_react2.default.createElement(
					'section',
					null,
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'col-md-4 col-md-offset-4 ' },
							_react2.default.createElement(
								'div',
								{ className: 'header' },
								_react2.default.createElement(
									'h1',
									null,
									' Your Profile is Updated! '
								)
							),
							_react2.default.createElement(
								'p',
								null,
								'Your profile is viewable by members of your team'
							),
							_react2.default.createElement(
								'form',
								null,
								_react2.default.createElement('br', null),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(
										_reactRouter.Link,
										{ to: '/org-notify' },
										_react2.default.createElement(
											_Button2.default,
											{
												type: 'submit',
												bsStyle: 'primary',
												className: 'col-md-12' },
											'I AM DONE'
										)
									)
								),
								_react2.default.createElement('br', null),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(
										_reactRouter.Link,
										{ to: '/org-profile' },
										_react2.default.createElement(
											_Button2.default,
											{
												type: 'submit',
												className: 'col-md-12' },
											'CONTINUE EDITING'
										)
									)
								),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(
										_reactRouter.Link,
										{ to: '/org-profile' },
										_react2.default.createElement(
											'p',
											{ className: 'notify-link' },
											'VIEW YOUR PROFILE AS OTHERS SEEE IT'
										)
									)
								)
							),
							_react2.default.createElement('div', { className: 'fill-vertical' })
						)
					)
				),
				_react2.default.createElement(_components.Footer, null)
			);
		}
	}]);

	return ProfileNotify;
}(_react.Component);

exports.default = ProfileNotify;

/***/ })

});