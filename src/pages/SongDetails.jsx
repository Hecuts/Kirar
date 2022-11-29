import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DetailsHeader, Loader, RelatedSongs } from "../components";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
	useGetSongDetailsQuery,
	useGetSongRelatedQuery,
} from "../redux/services/shazamCore";

const SongDetails = () => {
	const dispatch = useDispatch();
	const { songid, id: artistId } = useParams();
	const { activeSong, isPlaying } = useSelector((state) => state.player);
	const { data: songData, isFetching: isFetchingSongDetails } =
		useGetSongDetailsQuery({ songid });
	const {
		data: relatedSongData,
		isFetching: isFetchingRelatedSongs,
		error,
	} = useGetSongRelatedQuery({ songid });

	//play and pause functions
	const handlePauseClick = () => {
		dispatch(playPause(false));
	};

	const handlePlayClick = (song, i) => {
		dispatch(setActiveSong({ song, relatedSongData, i }));
		dispatch(playPause(true));
	};

	//configuring the loader
	if (isFetchingSongDetails || isFetchingRelatedSongs) {
		<Loader title="Searching song details..." />;
	}
	if (error) return <Error />;

	return (
		<div className="flex flex-col">
			<DetailsHeader artistId={artistId} songData={songData} />
			<div className="mb-10">
				<h2 className="text-white text-3xl font-bold">Lyrics:</h2>
				<div className="mt-5">
					{songData?.sections[1].type === "LYRICS" ? (
						songData?.sections[1].text.map((line, i) => (
							<p key={i} className="text-gray-400 text-base my-1">
								{line}
							</p>
						))
					) : (
						<p className="text-gray-400 text-base my-1">
							Sorry, lyrics is not availble!
						</p>
					)}
				</div>
			</div>
			<RelatedSongs
				data={relatedSongData}
				artistId={artistId}
				isPlaying={isPlaying}
				activeSong={activeSong}
				handlePauseClick={handlePauseClick}
				handlePlayClick={handlePlayClick}
			/>
		</div>
	);
};

export default SongDetails;
