const initialState = {
	members:[
	{
		id: 1,
		first: "Bucky",
		last: "Roberts",
		age: 71,
		description: "Bucky is a React developer and YouTuber",
		thumbnail: "http://i.imgur.com/7yUvePI.jpg"
	},
	{
		id: 2,
		first: "Joby",
		last: "Wasilenko",
		age: 27,
		description: "Joby loves the Packers, cheese, and turtles.",
		thumbnail: "http://i.imgur.com/52xRlm8.png"
	},
	{
		id: 3,
		first: "Madison",
		last: "Williams",
		age: 24,
		description: "Madi likes her dog but it is really annoying.",
		thumbnail: "http://i.imgur.com/4EMtxHB.png"
	}
],
user: {}}

export default function UserReducer(state = initialState, action){
	// return 
	switch (action.type) {
		case 'GET_ME':
			return {
				members: [...state.members],
				user: action.payload
		}

		default:
			// throw new Error(`Unhandled action type: ${action.type}`);
			return {...state}	
	}
}