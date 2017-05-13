webpackJsonp([1],{

/***/ 1220:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactGraphVis = __webpack_require__(454);

var _reactGraphVis2 = _interopRequireDefault(_reactGraphVis);

var _components = __webpack_require__(1227);

var _components2 = __webpack_require__(112);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CCG = function CCG() {
	return _react2.default.createElement(
		'div',
		{ className: 'container-graph test1' },
		_react2.default.createElement(_components2.Header, null),
		_react2.default.createElement(_reactGraphVis2.default, { graph: (0, _components.Data)(), options: (0, _components.Options)(), events: (0, _components.Events)() }),
		_react2.default.createElement(_components2.Footer, null)
	);
};

exports.default = CCG;

/***/ }),

/***/ 1224:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Data = undefined;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Data = function Data() {
	return {
		nodes: [{ id: 1, label: 'Habla', group: 'image' }, { id: 2, label: 'Node 2' }, { id: 3, label: 'Node 3' }, { id: 4, label: 'Node 4' }, { id: 5, label: 'Node 5' }, { id: 6, label: 'Node 6' }, { id: 7, label: 'Node 7' }, { id: 8, label: 'Node 8' }, { id: 9, label: 'Node 9' }, { id: 10, label: 'Node 10' }, { id: 11, label: 'Tho', group: 'tho' }, { id: 12, label: 'Node 12' }, { id: 13, label: 'Node 13' }, { id: 14, label: 'Node 14' }, { id: 15, label: 'Node 15' }, { id: 16, label: 'Node 16' }, { id: 17, label: 'Node 17' }],
		edges: [{ from: 1, to: 3, label: 'edge' }, { from: 1, to: 2 }, { from: 2, to: 4 }, { from: 2, to: 5 }, { from: 3, to: 6 }, { from: 1, to: 7 }, { from: 7, to: 8 }, { from: 8, to: 9 }, { from: 8, to: 10 }, { from: 1, to: 11 }, { from: 1, to: 12 }, { from: 1, to: 13 }, { from: 1, to: 14 }, { from: 1, to: 15 }, { from: 1, to: 16 }, { from: 1, to: 17 }, { from: 17, to: 1 }]
	};
};

exports.Data = Data;

//try without React, export just object

/***/ }),

/***/ 1225:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Events = undefined;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Events = function Events() {
	return {};
};

exports.Events = Events;

/***/ }),

/***/ 1226:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Options = undefined;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Options = function Options() {
	return {

		width: '100%',
		height: '100%',
		nodes: {
			borderWidth: 0,
			borderWidthSelected: 0,
			color: {
				background: '#aaaaaa',
				border: '#eeeeee',
				hover: '#d8d8d8'
			},
			shape: 'circle',
			physics: true,
			font: {
				color: 'black'
			}

		},
		edges: {
			color: {
				inherit: 'from'
			},
			title: 'HELLO'
		},
		interaction: {
			hover: true,
			navigationButtons: true,
			tooltipDelay: 20,
			zoomView: false
		},
		groups: {
			image: {
				color: {
					background: 'white',
					border: '#e67e22',
					hover: '#e67e22'

				},
				font: {
					color: 'white'
				},
				shape: 'image',
				image: '/resources/img/logo.png'
			},
			tho: {
				borderWidth: 3,
				color: {
					border: 'white'
				},
				shape: 'circularImage',
				image: '/resources/img/tho.jpg',
				font: {
					color: 'white'
				}

			}
		},
		layout: {
			randomSeed: 1 }
	};
};

exports.Options = Options;

/***/ }),

/***/ 1227:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Data = __webpack_require__(1224);

Object.keys(_Data).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Data[key];
    }
  });
});

var _Events = __webpack_require__(1225);

Object.keys(_Events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Events[key];
    }
  });
});

var _Options = __webpack_require__(1226);

Object.keys(_Options).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Options[key];
    }
  });
});

/***/ })

});