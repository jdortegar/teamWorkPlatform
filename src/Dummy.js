import React from 'react';

const Dummy = () => {
	return {
		user : {
			teams : {
				Lobby: {
					members: [
						{
							name: "Rob Abbott",
							userId: 1,
							icon: null,
							color: ''
						},
						{
							name: "Son Dao",
							userId: 2,
							icon: '',
							color: '#2ecc71'
						},

					],
					active: [
						{
							userId: 1,
						},
						{
							userId: 2,
						}
					],
					posts: [
						{
							userId: 1,
							time: '11:28am',
							date: 'April 4th, 2017',
							content:'Hello',
							like: 3,
							vote: '',
							level: 1,
							marked: 'no',
							fileShared: [
								{
									id: 1,
									icon:'',
									name: '2017 Sales Deck'
								},
								{
									id: 2,
									icon:'',
									name: '2016 Sales Script',
								},

							],
							comments: [
								{
									userId: 2,
									time: '11:30am',
									date: 'April 4th, 2017',
									content: 'Hi',
									like: 1,
									vote: 'up',
									level: 2,
									marked: 'yes',
									fileShared: [],
									comments: [
										{
											userId: 1,
											time: '11:40am',
											date: 'April 4th, 2017',
											content:'I am doing level testing',
											like: 10,
											vote: 'down',
											level: 3,
											marked: 'no',
											fileShared: [],
											comments: []
										}
									],
								},
								{
									userId: 1,
									time: '11:31am',
									date: 'April 4th, 2017',
									content:'I am at level 2 of threaded chat',
									like: 26,
									vote: '',
									level: 1,
									marked: 'no',
									fileShared: [],
									comments: []
								}
							],

						},
						{
							userId: 2,
							time: '11:30am',
							date: 'April 4th, 2017',
							content: 'I am at lvl 1 right now',
							like: 1,
							vote: 'up',
							level: 2,
							marked: 'yes',
							fileShared: [],
							comments: []
						},
					],
				},
				Design: {
				},


			}
		},
		posts : [

			// {
		 //         "messageId": "9dec8947-0381-4809-a053-b56777f782f4",//
		 //         "created": "2017-04-12T23:20:50.52Z",
		 //         "createdBy": "9dec8947-0381-4809-a053-b56777f782f4",
		 //         "messageType": "text",//
		 //         "text": "Alright."//
		 //      },
			
			{
				"messageType": "text",//
				"text": "How are you?",//
				"messageId": 1,//
				"from": "SD", //x
				"name": "Son Dao"
				"time": "4:20 PM", //x
				"depth": 0,//x
				"color":"#e67e22",//x
				"child":[] //x
			},
			{
				"messageType": "text",
				"text": "Good?",
				"messageId": 2,
				"from": "RA",
				"time": "4:40 PM",
				"depth":0,
				"color":"#795548",
				"child":[]
			},
			{
				"messageType": "text",
				"text": "I am good",
				"messageId": 3,
				"from": "SD",
				"time": "4:43 PM",
				"depth":1,
				"color":"#e67e22",
				"replyTo": 2,
				"child":[]
			},
			{
				"messageType": "text",
				"text": "2",
				"messageId": 4,
				"from": "SD",
				"time": "4:43 PM",
				"depth":2,
				"color":"#e67e22",
				"replyTo": 3,
				"child":[]
			},
			{
				"messageType": "text",
				"text": "3",
				"messageId": 5,
				"from": "SD",
				"time": "4:43 PM",
				"depth":1,
				"color":"#e67e22",
				"replyTo": 2,
				"child":[]
			},

		],

		responses : [

			{
			   "messageId": "9dec8947-0381-4809-a053-b56777f782f4",
			   "created": "2017-04-12T23:20:50.52Z",
			   "createdBy": "9dec8947-0381-4809-a053-b56777f782f4",
			   "messageType": "text",
			   "text": "Alright.",
			   "replyTo": "9dec8947-0381-4809-a053-b56777f782f5"
			}
		]

	};
}

export default Dummy;

