webpackJsonp([8],{

/***/ 1214:
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

var _Checkbox = __webpack_require__(285);

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _components = __webpack_require__(112);

var _reactCountryRegionSelector = __webpack_require__(246);

var _reactBootstrapTimezonePicker = __webpack_require__(234);

var _reactBootstrapTimezonePicker2 = _interopRequireDefault(_reactBootstrapTimezonePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProfileEdit = function (_Component) {
	_inherits(ProfileEdit, _Component);

	function ProfileEdit(props) {
		_classCallCheck(this, ProfileEdit);

		var _this = _possibleConstructorReturn(this, (ProfileEdit.__proto__ || Object.getPrototypeOf(ProfileEdit)).call(this, props));

		_this.handleChange = function (value) {
			return _this.setState({ timezone: value });
		};

		_this.state = { country: 'United States', timezone: '' };
		return _this;
	}

	_createClass(ProfileEdit, [{
		key: 'selectCountry',
		value: function selectCountry(val) {
			this.setState({ country: val });
		}
	}, {
		key: 'whenSubmit',
		value: function whenSubmit(event) {}
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
									' Your Profile '
								)
							),
							_react2.default.createElement(
								'div',
								{ className: 'clearpadding' },
								_react2.default.createElement(
									'p',
									{ className: 'normal-size clearpadding' },
									'Your profile is viewable by members of your team'
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
										placeholder: 'Robert J.Jones',
										label: 'Full Name',
										classn: 'col-md-12 clearpadding'
									})
								),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(_components.FieldGroup, {

										type: 'text',
										placeholder: 'Bob Jones',
										label: 'Display Name',
										classn: 'col-md-12 clearpadding'
									})
								),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(_components.FieldGroup, {

										type: 'email',
										placeholder: 'bob.jones@corporation.com',
										label: 'Email',
										classn: 'col-md-12 clearpadding'
									})
								),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(_components.FieldGroup, {

										type: 'text',
										placeholder: 'Accounting',
										label: 'Department',
										classn: 'col-md-12 clearpadding'
									})
								),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(
										'div',
										null,
										_react2.default.createElement(
											'label',
											null,
											'Timezone'
										)
									),
									_react2.default.createElement(_reactBootstrapTimezonePicker2.default, {
										defaultValue: '(GMT-08:00) Pacific Time',
										placeholder: 'Select Timezone...',
										onChange: this.handleChange,
										value: this.state.timezone,
										className: 'col-md-12 clearpadding'
									})
								),
								_react2.default.createElement(
									'div',
									{ className: 'row form-group' },
									_react2.default.createElement(
										'div',
										{ className: 'country-selector' },
										_react2.default.createElement(
											'label',
											null,
											'Country'
										)
									),
									_react2.default.createElement(_reactCountryRegionSelector.CountryDropdown, {
										value: country,
										onChange: function onChange(val) {
											return _this2.selectCountry(val);
										},

										defaultOptionLabel: 'Select Country',
										classes: 'form-control col-md-12 clearpadding'
									})
								),
								_react2.default.createElement('br', null),
								_react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'div',
										{ className: 'preview-image' },
										_react2.default.createElement('i', { className: 'fa fa-user' })
									),
									_react2.default.createElement(
										'span',
										null,
										_react2.default.createElement('input', { className: 'file-input',
											type: 'file'
										}),
										_react2.default.createElement(
											'button',
											{ className: 'btn btn-large',
												type: 'button'
											},
											'Upload'
										)
									)
								),
								_react2.default.createElement('br', null),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(
										_reactRouter.Link,
										{ to: '/profile-notify' },
										_react2.default.createElement(
											_Button2.default,
											{
												type: 'submit',
												bsStyle: 'primary',
												className: 'col-md-12' },
											'UPDATE PROFILE'
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
											'MANAGE YOUR ORGS'
										)
									)
								)
							)
						)
					)
				),
				_react2.default.createElement(_components.Footer, null)
			);
		}
	}]);

	return ProfileEdit;
}(_react.Component);

exports.default = ProfileEdit;

/***/ })

});