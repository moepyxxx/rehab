import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

const INITIAL_CENTER: [number, number] = [-74.0242, 40.6941];
const INITIAL_ZOOM = 15;

export default function Home() {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);

	const [center, setCenter] = useState<[number, number] | null>(null);
	const [zoom, setZoom] = useState(INITIAL_ZOOM);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(p) => setCenter([p.coords.longitude, p.coords.latitude]),
			(_e) => {
				return setCenter(INITIAL_CENTER);
			},
		);
	}, []);

	useEffect(() => {
		if (mapContainerRef.current === null) return;
		if (center === null) return;

		mapRef.current = new mapboxgl.Map({
			accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
			container: mapContainerRef.current,
			center,
			zoom,
			language: "ja",
		});
	}, [center, zoom]);

	useEffect(() => {
		if (mapRef.current === null) return;

		mapRef.current.on("move", () => {
			if (mapRef.current === null) return;
			const mapCenter = mapRef.current.getCenter();
			const mapZoom = mapRef.current.getZoom();

			setCenter([mapCenter.lng, mapCenter.lat]);
			setZoom(mapZoom);
		});

		return () => {
			if (mapRef.current === null) return;
			mapRef.current.remove();
		};
	}, []);

	const handleButtonClick = () => {
		mapRef.current?.flyTo({
			center: INITIAL_CENTER,
			zoom: INITIAL_ZOOM,
		});
	};

	const long = center ? center[0].toFixed(4) : "x";
	const lat = center ? center[1].toFixed(4) : "x";

	return (
		<div id="root">
			<div className="sidebar">
				Longitude: {long} | Latitude: {lat}| Zoom: {zoom.toFixed(2)}
			</div>
			<button
				type="button"
				className="reset-button"
				onClick={handleButtonClick}
			>
				Reset
			</button>
			<div id="map-container" ref={mapContainerRef} />
		</div>
	);
}
