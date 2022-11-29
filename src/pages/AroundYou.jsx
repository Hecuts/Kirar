import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetSongsByCountryQuery } from "../redux/services/shazamCore";
import { Loader, SongCard } from "../components";
import { countries } from "../assets/constants";

const AroundYou = () => {
	const [country, setCountry] = useState("");
	const [loading, setLoading] = useState(true);
	const { activeSong, isPlaying } = useSelector((state) => state.player);
	const {
		data: countryData,
		isFetching: isFetchingCountryData,
		error,
	} = useGetSongsByCountryQuery(country);
	const geoBaseUrl = "https://geo.ipify.org/api/v2/country";

	useEffect(() => {
		axios
			.get(`${geoBaseUrl}?apiKey=${process.env.VITE_GEO_API_KEY}`)
			.then((res) => {
				const countryCode = res?.data?.location?.country;
				countries.includes(countryCode)
					? setCountry(countryCode)
					: setCountry("RU");
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}, [country]);

	if (isFetchingCountryData && loading)
		return <Loader title="Loading songs around you..." />;

	if (error && country) return <Error />;

	return (
		<div className="flex flex-col">
			<h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
				Around you <span className="font-black">({country})</span>
			</h2>

			<div className="flex flex-wrap sm:justify-start justify-center gap-8">
				{countryData?.map((song, i) => (
					<SongCard
						key={song.key}
						song={song}
						isPlaying={isPlaying}
						activeSong={activeSong}
						data={countryData}
						i={i}
					/>
				))}
			</div>
		</div>
	);
};

export default AroundYou;
