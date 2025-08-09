import { View, Text } from 'react-native';
import { Link } from 'expo-router';
const about = () => {
	return(
		<View>
			<Text>About Page</Text>
			<Link href={"/"}>Go to Home</Link>
		</View>
	)
}
export default about;