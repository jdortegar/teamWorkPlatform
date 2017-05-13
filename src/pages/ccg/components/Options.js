import React from 'react';

const Options = () => {
	return {

		width: '100%',
		height: '100%',
		nodes: {
			borderWidth: 0,
			borderWidthSelected: 0,
			color: {
				background: '#aaaaaa',
				border: '#eeeeee',
				hover: '#d8d8d8',
			},
			shape: 'circle',
			physics: true,
			font: {
				color: 'black',
			},


		},
		edges: {
			color: {
				inherit: 'from',
				// color: '#999999',
				// highlight: 'black',
			},
			title: 'HELLO',
		},
		interaction: {
			hover: true,
			navigationButtons: true,
			tooltipDelay: 20,
			zoomView: false
		},
		groups: {
			habla: {
				color: {
					background: 'white',
					border: '#e67e22',
					hover: '#e67e22',
					
				},
				font: {
					color: 'white',
				},
				shape: 'image',
				image: 'https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png'
			},
			tho: {
				borderWidth: 3,
				color: {
					border: 'white',
				},
				shape: 'circularImage',
				image: 'https://c1.staticflickr.com/3/2879/33536822200_8d22e524c0_o.jpg',
				font: {
					color: 'white',
				}
			},
			thomas: {
				borderWidth: 3,
				color: {
					border: 'white',
				},
				shape: 'circularImage',
				image: 'https://c1.staticflickr.com/3/2944/33915831691_17761ff603_o.jpg',
				font: {
					color: 'white',
				}
			},
			rob: {
				borderWidth: 3,
				color: {
					border: 'white',
				},
				shape: 'circularImage',
				image: 'https://c1.staticflickr.com/3/2940/34004793326_ca26953439_o.png',
				font: {
					color: 'white',
				}
			},
			son: {
				borderWidth: 3,
				color: {
					border: 'white',
				},
				shape: 'circularImage',
				image: 'https://c1.staticflickr.com/3/2881/33915831861_e2af7ae641_o.jpg',
				font: {
					color: 'white',
				}
			},
			saul: {
				borderWidth: 3,
				color: {
					border: 'white',
				},
				shape: 'circularImage',
				image: '',
				font: {
					color: 'white',
				}
			},
			camilo: {
				borderWidth: 3,
				color: {
					border: 'white',
				},
				shape: 'circularImage',
				image: 'https://c1.staticflickr.com/3/2911/33915832051_7b9f8cf703_o.jpg',
				font: {
					color: 'white',
				}
			},
			mike: {
				borderWidth: 3,
				color: {
					border: 'white',
				},
				shape: 'circularImage',
				image: 'https://c1.staticflickr.com/3/2892/33915831951_6c680d197f_o.jpg',
				font: {
					color: 'white',
				}
			},
			anthony: {
				borderWidth: 3,
				color: {
					border: 'white',
				},
				shape: 'circularImage',
				image: 'https://c1.staticflickr.com/4/3936/33915832131_5b2bf16f64_o.jpg',
				font: {
					color: 'white',
				}
			},
			caroline: {
				borderWidth: 3,
				color: {
					border: 'white',
				},
				shape: 'circularImage',
				image: 'https://c1.staticflickr.com/3/2843/34004793336_6bfb17454a_o.jpg',
				font: {
					color: 'white',
				}
			},
			shreya: {
				borderWidth: 3,
				color: {
					border: 'white',
				},
				shape: 'circularImage',
				image: 'https://c1.staticflickr.com/3/2938/34004793726_1d3f3ba742_o.jpg',
				font: {
					color: 'white',
				}
			},
			team: {
				color: {
					background: '#3498db',
					border: '#3498db'
				}
			},
			file: {
				color: {
					background: '#f1c40f',
					border: '#f1c40f'
				}
			},
			chat: {
				color: {
					background: '#2ecc71',
					border: '#2ecc71'
				}
			},
			homepage: {
				color: {
					background: '#f1c40f'
				}
			},

		},
		layout: {
			randomSeed: 1, //TODO: create scroll bar for user define and save this number
		}
	};
};

export { Options };