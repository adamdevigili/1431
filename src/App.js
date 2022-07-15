import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import {
	MantineProvider,
	Container,
	Center,
	Title,
	Stack,
	Space,
} from "@mantine/core";

const Lohman = "30.474128, -97.974426";
const Nameless = "30.511118, -97.911683";
const Bell = "30.520692, -97.830074";

export default function App() {
	const [statusText, setStatusText] = useState("...");
	const [statusTextColor, setStatusTextColor] = useState();

	const [lohmanToBellTravelTimeSeconds, setLohmanToBellTravelTimeSeconds] =
		useState();
	const [lohmanToBellTravelTimeText, setLohmanToBellTravelTimeText] =
		useState(0);

	// let travelTime = 0;
	const defaultProps = {
		center: {
			lat: 30.4924206,
			lng: -97.9034953,
		},
		zoom: 13.75,
	};

	const handleApiLoaded = (map, maps) => {
		const trafficLayer = new maps.TrafficLayer();
		trafficLayer.setMap(map);

		const directionsRenderer = new maps.DirectionsRenderer();
		const directionsService = new maps.DirectionsService();

		directionsRenderer.setMap(map);

		directionsService
			.route({
				origin: {
					query: Lohman,
				},
				destination: {
					query: Bell,
				},
				travelMode: maps.TravelMode.DRIVING,
			})
			.then((response) => {
				directionsRenderer.setDirections(response);
				// console.log(response);

				const duration = response.routes[0].legs[0].duration;

				console.log("API duration", duration);
				setLohmanToBellTravelTimeSeconds(duration.value);
				setLohmanToBellTravelTimeText(duration.text);

				// console.log(response.routes);
			})
			.catch((e) => window.alert("Directions request failed", e));
	};

	useEffect(() => {
		if (lohmanToBellTravelTimeSeconds === undefined) {
			setStatusText("...");
			return;
		}

		if (lohmanToBellTravelTimeSeconds < 1000) {
			setStatusText("OPEN");
			setStatusTextColor("#87cb54");
			return;
		} else if (lohmanToBellTravelTimeSeconds < 1200) {
			setStatusText("SLOW");
			setStatusTextColor("#f07d02");
			return;
		} else if (lohmanToBellTravelTimeSeconds < 1500) {
			setStatusText("VERY SLOW");
			setStatusTextColor("#e60000");
			return;
		} else {
			setStatusText("CLOSED");
			setStatusTextColor("#9e1313");
			return;
		}
	}, [lohmanToBellTravelTimeSeconds]);

	// const getStatusText = (duration) => {
	// 	console.log(duration);
	// 	if (duration === undefined) {
	// 		console.log("returning dots");
	// 		return <Title>...</Title>;
	// 	}
	// 	if (duration < 1000) {
	// 		return <Title sx={{ color: "#87cb54" }}>OPEN</Title>;
	// 	} else if (duration < 1200) {
	// 		return <Title sx={{ color: "#f07d02" }}>SLOW</Title>;
	// 	} else if (duration < 1500) {
	// 		return <Title sx={{ color: "#e60000" }}>VERY SLOW</Title>;
	// 	} else {
	// 		return <Title sx={{ color: "#9e1313" }}>CLOSED</Title>;
	// 	}
	// };

	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: "dark",
				colors: {
					// override dark colors to change them for all components
					dark: [
						"#d5d7e0",
						"#acaebf",
						"#8c8fa3",
						"#666980",
						"#4d4f66",
						"#34354a",
						"#2b2c3d",
						"#1d1e30",
						"#0c0d21",
						"#01010a",
					],
				},
			}}
		>
			<Container>
				<Center>
					<Stack>
						<Title>1431 is currently</Title>
						<Center>
							<Title sx={{ fontSize: "75px", color: statusTextColor }}>
								{statusText}
							</Title>
						</Center>
						{/* <Center>
							<Title sx={{ color: { statusTextColor } }}>
								{lohmanToBellTravelTimeText}
							</Title>
						</Center> */}
					</Stack>
				</Center>
			</Container>
			<Space h="xl" />
			<Container>
				<div style={{ height: "50vh", width: "100%" }}>
					<GoogleMapReact
						bootstrapURLKeys={{
							key: process.env.REACT_APP_GOOGLE_API_KEY,
						}}
						defaultCenter={defaultProps.center}
						defaultZoom={defaultProps.zoom}
						yesIWantToUseGoogleMapApiInternals
						onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
					></GoogleMapReact>
				</div>
			</Container>
			<Space h="xl" />
			<Container>
				<Center>
					<Title>Lohman Ford to 183: {lohmanToBellTravelTimeText}</Title>
				</Center>
			</Container>
		</MantineProvider>
	);
}
