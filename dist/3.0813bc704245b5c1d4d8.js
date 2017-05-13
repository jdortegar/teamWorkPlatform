webpackJsonp([3],{

/***/ 1217:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(46);

var _reactRouter = __webpack_require__(44);

var _axios = __webpack_require__(167);

var _axios2 = _interopRequireDefault(_axios);

var _reduxForm = __webpack_require__(279);

var _lib = __webpack_require__(168);

var _components = __webpack_require__(112);

var _index = __webpack_require__(1223);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Register = function (_Component) {
	_inherits(Register, _Component);

	function Register() {
		_classCallCheck(this, Register);

		return _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).apply(this, arguments));
	}

	_createClass(Register, [{
		key: 'whenPressSubmit',
		value: function whenPressSubmit(event) {
			var _this2 = this;

			event.preventDefault();
			if (validateEmail(this.props.email_in)) {
				this.props.submitEmail(this.props.email_in).then(function () {
					_this2.context.router.push('/successful');
				});
			}
		}
	}, {
		key: 'type_email',
		value: function type_email(input) {
			this.props.email_changed(input);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			// const { fields: emailcheck, handleSubmit } = this.props;
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
							{ className: 'col-md-4 col-md-offset-4' },
							_react2.default.createElement(
								'div',
								{ className: 'header' },
								_react2.default.createElement(
									'h1',
									null,
									'Signup'
								)
							),
							_react2.default.createElement(
								'form',
								{ onSubmit: this.whenPressSubmit.bind(this) },
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(_components.FieldGroup, {
										type: 'email',
										placeholder: 'bob.jones@corporation.com',
										label: 'Email',
										classn: 'col-md-12 clearpadding',
										onChange: function onChange(event) {
											return _this3.type_email(event.target.value);
										},
										value: this.props.email_in

									})
								),
								_react2.default.createElement('div', null),
								_react2.default.createElement(
									'div',
									{ className: 'row' },
									_react2.default.createElement(
										_lib.Button,
										{
											type: 'submit',
											bsStyle: 'primary',
											className: 'col-md-12 signup-submit' },
										'REGISTER FOR HABLA'
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

	return Register;
}(_react.Component);

Register.contextTypes = {
	router: _react.PropTypes.object
};


function validateEmail(email) {
	var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

function mapStateToProps(state) {
	return {
		email_in: state.email_auth.email
	};
}

// export default reduxForm({
// 	form: 'Register',
// 	fields: 'emailcheck',

// },mapStateToProps, {email_changed})(Register)

exports.default = (0, _reactRedux.connect)(mapStateToProps, { email_changed: _index.email_changed, submitEmail: _index.submitEmail })(Register);

/***/ }),

/***/ 1223:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.token = exports.submitEmail = exports.email_changed = undefined;

var _axios = __webpack_require__(167);

var _axios2 = _interopRequireDefault(_axios);

var _env = __webpack_require__(498);

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = _env2.default.hablaApiBaseUri + '/users/registerUser';
var url_type = 'application/x-www-form-urlencoded';

var email_changed = exports.email_changed = function email_changed(input) {
	return {
		type: 'email_changed',
		payload: input
	};
};

var submitEmail = exports.submitEmail = function submitEmail(email) {
	var request = (0, _axios2.default)({
		method: 'post',
		url: url,
		body: {
			'content-type': url_type
		},
		data: {
			email: email
		}
	});

	return {
		type: 'submitEmail',
		payload: request
	};
};

var token = exports.token = function token(_token) {
	return {
		type: 'save-token',
		payload: _token
	};
};

/***/ })

});