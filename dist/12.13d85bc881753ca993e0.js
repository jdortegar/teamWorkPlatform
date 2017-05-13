webpackJsonp([12],{

/***/ 1210:
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

var OrgInvite = function (_Component) {
	_inherits(OrgInvite, _Component);

	function OrgInvite(props) {
		_classCallCheck(this, OrgInvite);

		var _this = _possibleConstructorReturn(this, (OrgInvite.__proto__ || Object.getPrototypeOf(OrgInvite)).call(this, props));

		_this.state = { term: '' };
		return _this;
	}

	_createClass(OrgInvite, [{
		key: 'handleChange',
		value: function handleChange(term) {
			this.setState({ term: term });

			// Todo: Implement Autocomplete function
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

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
									' Invite Users '
								)
							),
							_react2.default.createElement(
								'div',
								{ className: 'clearpadding' },
								_react2.default.createElement(
									'p',
									{ className: 'normal-size clearpadding' },
									'Invite Users by email address and manage invited users below.'
								)
							),
							_react2.default.createElement('br', null),
							_react2.default.createElement(
								'form',
								null,
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(_components.FieldGroup, {
										type: 'text',
										onChange: function onChange(event) {
											return _this2.handleChange(event.target.value);
										},
										value: 'JamesArnold@GeneralPurposeOrganization.org',
										placeholder: 'User Email',
										className: 'col-md-12 placeholder_search'
									})
								),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(_components.FieldGroup, {
										type: 'text',
										onChange: function onChange(event) {
											return _this2.handleChange(event.target.value);
										},
										value: 'PeterParker@GeneralPurposeOrganization.org',
										placeholder: 'User Email',
										className: 'col-md-12 placeholder_search'
									})
								),
								_react2.default.createElement(
									'div',
									{ className: 'center' },
									_react2.default.createElement(
										_Button2.default,
										{ className: 'overwrite-button' },
										_react2.default.createElement('i', { className: 'fa fa-plus-circle clearpadding' })
									)
								),
								_react2.default.createElement('br', null),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(
										_reactRouter.Link,
										{ to: '/resetpass' },
										_react2.default.createElement(
											_Button2.default,
											{
												type: 'submit',
												bsStyle: 'success',
												className: 'col-md-12' },
											'SEND 2 INVITES'
										)
									)
								),
								_react2.default.createElement('br', null),
								_react2.default.createElement(
									'div',
									{ className: 'clearpadding' },
									_react2.default.createElement('hr', null),
									_react2.default.createElement(
										'div',
										{ className: 'selected' },
										'JamesArnold@GeneralPurposeOrganization.org'
									),
									_react2.default.createElement('hr', null),
									_react2.default.createElement(
										'div',
										{ className: 'selected' },
										'PeterParker@GeneralPurposeOrganization.org'
									),
									_react2.default.createElement('hr', null),
									_react2.default.createElement(
										'div',
										null,
										'Osboume_Computing_Org'
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

	return OrgInvite;
}(_react.Component);

exports.default = OrgInvite;

/***/ })

});