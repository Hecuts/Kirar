import React from "react";
import { useSelector } from "react-redux";
import { useGetTopChartsQuery } from "../redux/services/shazamCore";
import { Loader, SongCard, Error } from "../components";

const TopCharts = () => {
	const { activeSong, isPlaying } = useSelector((state) => state.player);
	const {
		data: topChartsData,
		isFetching: isFetchingTopCharts,
		error,
	} = useGetTopChartsQuery();

	if (isFetchingTopCharts) return <Loader title="Loading Top chart songs..." />;

	if (error) return <Error />;

	return (
		<div className="flex flex-col">
			<h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
				Discover Top Charts
			</h2>

			<div className="flex flex-wrap sm:justify-start justify-center gap-8">
				{topChartsData?.map((song, i) => (
					<SongCard
						key={song.key}
						song={song}
						isPlaying={isPlaying}
						activeSong={activeSong}
						data={topChartsData}
						i={i}
					/>
				))}
			</div>
		</div>
	);
};

export default TopCharts;
