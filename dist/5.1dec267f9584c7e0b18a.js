webpackJsonp([5],{

/***/ 1218:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Button = __webpack_require__(72);

var _Button2 = _interopRequireDefault(_Button);

var _components = __webpack_require__(112);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResetPass = function ResetPass() {
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
							'Reset Password'
						)
					),
					_react2.default.createElement(
						'form',
						null,
						_react2.default.createElement(
							'div',
							{ className: 'row' },
							_react2.default.createElement(_components.FieldGroup, {
								id: 'reset-password',
								type: 'password',
								placeholder: 'Enter new password',
								help: '',
								classn: 'col-md-12 clearpadding'
							}),
							_react2.default.createElement(_components.FieldGroup, {
								id: 'reset-password-re',
								type: 'password',
								placeholder: 'Re-enter password',
								help: '',
								classn: 'col-md-12 clearpadding'
							})
						),
						_react2.default.createElement(
							'div',
							{ className: 'row' },
							_react2.default.createElement(
								_Button2.default,
								{
									type: 'submit',
									bsStyle: 'primary',
									className: 'col-md-12 signup-submit' },
								'Reset Password'
							)
						)
					),
					_react2.default.createElement('div', { className: 'fill-vertical' })
				)
			)
		),
		_react2.default.createElement(_components.Footer, null)
	);
};

exports.default = ResetPass;

/***/ })

});