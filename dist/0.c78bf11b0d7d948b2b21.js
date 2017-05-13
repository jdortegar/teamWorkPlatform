webpackJsonp([0],{

/***/ 1222:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _teamheader = __webpack_require__(1233);

var _teamheader2 = _interopRequireDefault(_teamheader);

var _teambody = __webpack_require__(1232);

var _teambody2 = _interopRequireDefault(_teambody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Team = function Team() {
	return _react2.default.createElement(
		'div',
		{ className: 'container-fluid' },
		_react2.default.createElement(_teamheader2.default, null),
		_react2.default.createElement(_teambody2.default, null)
	);
};

exports.default = Team;

/***/ }),

/***/ 1228:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(44);

var _teamMember = __webpack_require__(1230);

var _teamMember2 = _interopRequireDefault(_teamMember);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BodyLeft = function BodyLeft() {
	return _react2.default.createElement(
		'div',
		{ className: 'col-md-3 body-left' },
		_react2.default.createElement(
			'div',
			{ className: 'mainuser' },
			_react2.default.createElement(
				'div',
				{ className: 'row' },
				_react2.default.createElement(
					'div',
					{ className: 'col-md-2 mainuser-avatar-container' },
					_react2.default.createElement('img', { src: '/resources/img/tho.jpg', className: 'mainuser-avatar' })
				),
				_react2.default.createElement(
					'div',
					{ className: 'col-md-10 mainuser-info' },
					_react2.default.createElement(
						'div',
						{ className: 'mainuser-name' },
						_react2.default.createElement(
							'p',
							null,
							'Tho Truong'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'mainuser-email' },
						'tho.truong@habla.io'
					),
					_react2.default.createElement(
						'div',
						{ className: 'mainuser-phone' },
						'408-427-2150'
					)
				)
			)
		),
		_react2.default.createElement(
			'div',
			null,
			'Relevant messages'
		),
		_react2.default.createElement('br', null),
		_react2.default.createElement(
			'div',
			{ className: 'team-members' },
			_react2.default.createElement(_teamMember2.default, null),
			_react2.default.createElement(_teamMember2.default, null),
			_react2.default.createElement(_teamMember2.default, null),
			_react2.default.createElement(_teamMember2.default, null),
			_react2.default.createElement(_teamMember2.default, null),
			_react2.default.createElement(_teamMember2.default, null),
			_react2.default.createElement(_teamMember2.default, null),
			_react2.default.createElement(_teamMember2.default, null),
			_react2.default.createElement(_teamMember2.default, null),
			_react2.default.createElement(_teamMember2.default, null),
			_react2.default.createElement(_teamMember2.default, null)
		),
		_react2.default.createElement(
			'div',
			{ className: 'team-nav-bottom' },
			_react2.default.createElement(
				'div',
				{ className: 'row' },
				_react2.default.createElement(
					'div',
					{ className: 'col-md-2 nav-horizontal' },
					_react2.default.createElement(
						'div',
						{ className: 'row' },
						_react2.default.createElement(
							'div',
							{ className: 'nav-horizontal-icon-container' },
							_react2.default.createElement('i', { className: 'fa fa-user-o' })
						),
						_react2.default.createElement(
							'div',
							{ className: 'nav-horizontal-icon-container' },
							_react2.default.createElement('i', { className: 'fa fa-bar-chart' })
						),
						_react2.default.createElement(
							'div',
							{ className: 'nav-horizontal-icon-container' },
							_react2.default.createElement('i', { className: 'fa fa-search' })
						),
						_react2.default.createElement(
							'div',
							{ className: 'nav-horizontal-icon-container' },
							_react2.default.createElement('i', { className: 'fa fa-star-o' })
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'col-md-10 thin-text' },
					_react2.default.createElement(
						'div',
						{ className: '' },
						'Teams'
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'UK Sales'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'UK Marketting'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Program Epsilon'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Weekly Standup'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Michael Stokes'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Inez Dennis'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Bertie Wade'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Jayden Fuller'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Alberta Sharp'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Robert Bridges'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Anne Douglas'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Kate Rice'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Norman Delgado'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'team-nav-links-indent-indent' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							'Lettie Steele'
						)
					)
				)
			)
		)
	);
};

exports.default = BodyLeft;

/***/ }),

/***/ 1229:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(44);

var _teamPost = __webpack_require__(1231);

var _teamPost2 = _interopRequireDefault(_teamPost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BodyMiddle = function BodyMiddle() {
	return _react2.default.createElement(
		'div',
		{ className: 'col-md-5 body-middle' },
		_react2.default.createElement(
			'div',
			{ className: 'team-middle-header' },
			_react2.default.createElement(
				'div',
				{ className: 'row' },
				_react2.default.createElement(
					'div',
					{ className: 'col-md-4' },
					_react2.default.createElement(
						'h3',
						null,
						'Team Feed'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'col-md-4 team-middle-header-middle' },
					_react2.default.createElement(
						'p',
						{ className: 'inline-block team-middle-header-middle-text' },
						'Most Recent'
					),
					_react2.default.createElement(
						'div',
						{ className: 'inline-block' },
						_react2.default.createElement('i', { className: 'fa fa-angle-down' })
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'col-md-4 team-middle-header-right' },
					_react2.default.createElement(
						'p',
						null,
						'94 Updates'
					)
				)
			)
		),
		_react2.default.createElement(_teamPost2.default, null),
		_react2.default.createElement(_teamPost2.default, null),
		_react2.default.createElement(_teamPost2.default, null),
		_react2.default.createElement(_teamPost2.default, null),
		_react2.default.createElement(_teamPost2.default, null),
		_react2.default.createElement(_teamPost2.default, null),
		_react2.default.createElement(_teamPost2.default, null),
		_react2.default.createElement(_teamPost2.default, null),
		_react2.default.createElement(_teamPost2.default, null),
		_react2.default.createElement(_teamPost2.default, null)
	);
};

exports.default = BodyMiddle;

/***/ }),

/***/ 1230:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TeamMember = function TeamMember() {
	return _react2.default.createElement(
		"div",
		{ className: "row team-member" },
		_react2.default.createElement(
			"div",
			{ className: "col-md-2 team-member-avatar-container" },
			_react2.default.createElement("img", { src: "/resources/img/tho.jpg", className: "team-member-avatar" })
		),
		_react2.default.createElement(
			"div",
			{ className: "col-md-10 member-message-time" },
			_react2.default.createElement(
				"div",
				{ className: "message-time" },
				"05:16AM"
			),
			_react2.default.createElement(
				"div",
				{ className: "member-message" },
				"Freelance Design Tricks How To Get Away With Murder In The Workplace"
			)
		)
	);
};

exports.default = TeamMember;

/***/ }),

/***/ 1231:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(44);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TeamPost = function TeamPost(_ref) {
	var src = _ref.src,
	    name = _ref.name,
	    email = _ref.email,
	    title = _ref.title,
	    content = _ref.content;

	return _react2.default.createElement(
		'div',
		{ className: 'team-middle-post' },
		_react2.default.createElement(
			'div',
			{ className: 'row' },
			_react2.default.createElement(
				'div',
				{ className: 'col-md-1' },
				_react2.default.createElement('img', { src: '/resources/img/tho.jpg', className: 'team-member-avatar' })
			),
			_react2.default.createElement(
				'div',
				{ className: 'col-md-11' },
				_react2.default.createElement(
					'div',
					{ className: 'team-user-name' },
					'Tho Truong'
				),
				_react2.default.createElement(
					'div',
					{ className: 'team-user-email' },
					'tho.truong@habla.io'
				),
				_react2.default.createElement(
					'div',
					{ className: 'team-user-message-title' },
					_react2.default.createElement(
						'p',
						null,
						' Why Use External It Support'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'team-user-message-content' },
					_react2.default.createElement(
						'p',
						null,
						'Accessories Here you can find the best computer accessorty for your laptop, monitor, printer, scanner, speaker, projector, hardware and more. Accessories Here you can find the best computer accessorty for your laptop, monitor, printer, scanner, speaker, projector, hardware and more.'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					_react2.default.createElement(
						'div',
						{ className: 'col-md-4' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							_react2.default.createElement(
								'i',
								{ className: 'fa fa-thumbs-o-up' },
								'\xA0Like'
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'col-md-4' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							_react2.default.createElement(
								'i',
								{ className: 'fa fa-comment-o' },
								'\xA0Comment'
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'col-md-4' },
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/' },
							_react2.default.createElement(
								'i',
								{ className: 'fa fa-share-square-o' },
								'\xA0Share'
							)
						)
					)
				)
			)
		)
	);
};

exports.default = TeamPost;

/***/ }),

/***/ 1232:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _bodyLeft = __webpack_require__(1228);

var _bodyLeft2 = _interopRequireDefault(_bodyLeft);

var _bodyMiddle = __webpack_require__(1229);

var _bodyMiddle2 = _interopRequireDefault(_bodyMiddle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TeamBody = function TeamBody() {
	return _react2.default.createElement(
		'div',
		{ className: 'row' },
		_react2.default.createElement(_bodyLeft2.default, null),
		_react2.default.createElement(_bodyMiddle2.default, null)
	);
};

exports.default = TeamBody;

/***/ }),

/***/ 1233:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(44);

var _lib = __webpack_require__(168);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TeamHeader = function TeamHeader() {
	return _react2.default.createElement(
		'div',
		{ className: 'row header-login' },
		_react2.default.createElement(
			'div',
			{ className: 'col-md-1' },
			_react2.default.createElement(
				_reactRouter.Link,
				{ to: '/' },
				_react2.default.createElement('img', { className: 'logo-login', src: '/resources/img/logo.png' })
			)
		),
		_react2.default.createElement(
			'div',
			{ className: 'col-md-6 col-md-offset-2 team-search' },
			_react2.default.createElement(
				_lib.FormGroup,
				null,
				_react2.default.createElement(
					_lib.InputGroup,
					null,
					_react2.default.createElement(
						_lib.DropdownButton,
						{
							componentClass: _lib.InputGroup.Button,
							id: 'search-type',
							title: 'Contextual'
						},
						_react2.default.createElement(
							_lib.MenuItem,
							{ key: '1' },
							'Type 1'
						),
						_react2.default.createElement(
							_lib.MenuItem,
							{ key: '2' },
							'Type 2'
						)
					),
					_react2.default.createElement(_lib.FormControl, {
						type: 'text',
						placeholder: 'Search'
					}),
					_react2.default.createElement(
						_lib.InputGroup.Button,
						null,
						_react2.default.createElement(
							_lib.Button,
							{
								type: 'submit',
								className: 'search-button'
							},
							_react2.default.createElement('i', { className: 'ion-ios-search-strong' })
						)
					)
				)
			)
		),
		_react2.default.createElement(
			'div',
			{ className: 'col-md-3 team-header-icons' },
			_react2.default.createElement('i', { className: 'ion-chatbubbles' }),
			_react2.default.createElement('i', { className: 'ion-ios-calendar-outline' }),
			_react2.default.createElement('i', { className: 'ion-earth' }),
			_react2.default.createElement('i', { className: 'ion-ios-gear' }),
			_react2.default.createElement('i', { className: 'ion-help-circled team-question-icon' })
		)
	);
};

exports.default = TeamHeader;

/***/ })

});