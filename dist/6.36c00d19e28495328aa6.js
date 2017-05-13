webpackJsonp([6],{

/***/ 1216:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _components = __webpack_require__(112);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RegNotify = function RegNotify() {
	return _react2.default.createElement(
		'div',
		{ className: 'container-fluid' },
		_react2.default.createElement(_components.Header, null),
		_react2.default.createElement(
			'h2',
			null,
			' Registration Successful!'
		),
		_react2.default.createElement(
			'p',
			{ className: 'center' },
			' Check your email and click on the validation link to complete your registration '
		),
		_react2.default.createElement('div', { className: 'fill-vertical' }),
		_react2.default.createElement(_components.Footer, null)
	);
};

exports.default = RegNotify;

/***/ })

});