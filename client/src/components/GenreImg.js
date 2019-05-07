function GenreImg(genre){
  const data = [
		{
			name: "Pop",
			imageUrl:
				"https://t.scdn.co/media/derived/pop-274x274_447148649685019f5e2a03a39e78ba52_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Hip-Hop",
			imageUrl:
				"https://t.scdn.co/media/original/hip-274_0a661854d61e29eace5fe63f73495e68_274x274.jpg",
			type: "genre"
		},
		{
			name: "Mood",
			imageUrl:
				"https://t.scdn.co/media/original/mood-274x274_976986a31ac8c49794cbdc7246fd5ad7_274x274.jpg",
			type: "genre"
		},
		{
			name: "Workout",
			imageUrl: "https://t.scdn.co/media/links/workout-274x274.jpg",
			type: "genre"
		},
		{
			name: "Decades",
			imageUrl:
				"https://t.scdn.co/media/derived/decades_9ad8e458242b2ac8b184e79ef336c455_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Country",
			imageUrl:
				"https://t.scdn.co/images/a2e0ebe2ebed4566ba1d8236b869241f.jpeg",
			type: "genre"
		},
		{
			name: "Focus",
			imageUrl:
				"https://t.scdn.co/media/original/genre-images-square-274x274_5e50d72b846a198fcd2ca9b3aef5f0c8_274x274.jpg",
			type: "genre"
		},
		{
			name: "Latin",
			imageUrl:
				"https://t.scdn.co/media/derived/latin-274x274_befbbd1fbb8e045491576e317cb16cdf_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Chill",
			imageUrl:
				"https://t.scdn.co/media/derived/chill-274x274_4c46374f007813dd10b37e8d8fd35b4b_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Dance/Electronic",
			imageUrl:
				"https://t.scdn.co/media/derived/edm-274x274_0ef612604200a9c14995432994455a6d_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "R&B",
			imageUrl:
				"https://t.scdn.co/media/derived/r-b-274x274_fd56efa72f4f63764b011b68121581d8_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Rock",
			imageUrl:
				"https://t.scdn.co/media/derived/rock_9ce79e0a4ef901bbd10494f5b855d3cc_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Indie",
			imageUrl:
				"https://t.scdn.co/images/fe06caf056474bc58862591cd60b57fc.jpeg",
			type: "genre"
		},
		{
			name: "Folk & Acoustic",
			imageUrl:
				"https://t.scdn.co/images/7fe0f2c9c91f45a3b6bae49d298201a4.jpeg",
			type: "genre"
		},
		{
			name: "Party",
			imageUrl: "https://t.scdn.co/media/links/partyicon_274x274.jpg",
			type: "genre"
		},
		{
			name: "Sleep",
			imageUrl:
				"https://t.scdn.co/media/derived/sleep-274x274_0d4f836af8fab7bf31526968073e671c_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Classical",
			imageUrl:
				"https://t.scdn.co/media/derived/classical-274x274_abf78251ff3d90d2ceaf029253ca7cb4_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Jazz",
			imageUrl:
				"https://t.scdn.co/media/derived/jazz-274x274_d6f407453a1f43d3163c55cca624a764_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Christian",
			imageUrl:
				"https://t.scdn.co/images/6359655809534407b31a728fe262dc3a.jpeg",
			type: "genre"
		},
		{
			name: "Gaming",
			imageUrl: "https://t.scdn.co/media/categories/gaming2_274x274.jpg",
			type: "genre"
		},
		{
			name: "Romance",
			imageUrl:
				"https://t.scdn.co/media/derived/romance-274x274_8100794c94847b6d27858bed6fa4d91b_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "K-Pop",
			imageUrl:
				"https://t.scdn.co/images/69c728f3bd9643a5ab0f4ef5a79919f1.jpeg",
			type: "genre"
		},
		{
			name: "Pop culture",
			imageUrl:
				"https://t.scdn.co/images/ac75ec857b714a118c73218bb58664e5.jpeg",
			type: "genre"
		},
		{
			name: "Arab",
			imageUrl:
				"https://t.scdn.co/images/41c540e662c0476c8729eb12c2f08995.jpeg",
			type: "genre"
		},
		{
			name: "Desi",
			imageUrl:
				"https://t.scdn.co/images/878e1eda3d084a4584465626a8f7dd26.jpeg",
			type: "genre"
		},
		{
			name: "Afro",
			imageUrl:
				"https://t.scdn.co/images/b505b01bbe0e490cbe43b07f16212892.jpeg",
			type: "genre"
		},
		{
			name: "TV & Movies",
			imageUrl:
				"https://t.scdn.co/images/3be0105e-cc31-4bf2-9958-05568b12370d.jpg",
			type: "genre"
		},
		{
			name: "Ellen",
			imageUrl:
				"https://t.scdn.co/images/97351e8a090049d2a5daa90f94f2e5e5.jpeg",
			type: "genre"
		},
		{
			name: "Metal",
			imageUrl:
				"https://t.scdn.co/media/original/metal_27c921443fd0a5ba95b1b2c2ae654b2b_274x274.jpg",
			type: "genre"
		},
		{
			name: "Reggae",
			imageUrl:
				"https://t.scdn.co/media/derived/reggae-274x274_2f11a0500528532b3bc580e3428e9610_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Soul",
			imageUrl:
				"https://t.scdn.co/media/derived/soul-274x274_266bc900b35dda8956380cffc73a4d8c_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Blues",
			imageUrl:
				"https://t.scdn.co/media/derived/icon-274x274_aeeb8eb70c80e2b701b25425390a1737_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Punk",
			imageUrl:
				"https://t.scdn.co/media/derived/punk-274x274_f3f1528ea7bbb60a625da13e3315a40b_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Funk",
			imageUrl:
				"https://t.scdn.co/images/f4f0987fcab446fcaa7173acb5e25701.jpeg",
			type: "genre"
		},
		{
			name: "Dinner",
			imageUrl:
				"https://t.scdn.co/media/original/dinner_1b6506abba0ba52c54e6d695c8571078_274x274.jpg",
			type: "genre"
		},
		{
			name: "Black history is now",
			imageUrl:
				"https://t.scdn.co/images/5d4da3850e0d46249500ad564dc4abf0.jpeg",
			type: "genre"
		},
		{
			name: "Spotify Singles",
			imageUrl:
				"https://t.scdn.co/images/986a6f23-b61b-43c5-85dd-c66cc66e0f40.jpg",
			type: "genre"
		},
		{
			name: "Commute",
			imageUrl:
				"https://t.scdn.co/media/derived/travel-274x274_1e89cd5b42cf8bd2ff8fc4fb26f2e955_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Kids & Family",
			imageUrl:
				"https://t.scdn.co/images/ab1e1dbf-1ea2-403e-8c11-5dba87c9c720.jpg",
			type: "genre"
		},
		{
			name: "Comedy",
			imageUrl:
				"https://t.scdn.co/media/derived/comedy-274x274_d07fcbc1202f00f8684f37742d0a4f2f_0_0_274_274.jpg",
			type: "genre"
		},
		{
			name: "Word",
			imageUrl:
				"https://t.scdn.co/media/derived/word-icon_5fdddc5e73436a11fc425ae94f195915_0_0_274_274.jpg",
			type: "genre"
		}
	]
	let url=[];
	for(let i = 0; i< genre.length ; i++){
		url = url.concat(data.filter(item=>item.name.toLowerCase() === genre[i]).map((item =>item.imageUrl)))
	}
	return url
}

export default GenreImg