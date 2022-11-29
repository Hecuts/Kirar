import { Error, SongCard, Loader } from "../components";
import { genres } from "../assets/constants";
import {
	useGetSongsByGenreQuery,
	useGetTopChartsQuery,
} from "../redux/services/shazamCore";
import { useDispatch, useSelector } from "react-redux";
import { selectGenreListId } from "../redux/features/playerSlice";

const Discover = () => {
	const dispatch = useDispatch();
	const { activeSong, isPlaying, genreListId } = useSelector(
		(state) => state.player
	);
	const { data, isFetching, error } = useGetSongsByGenreQuery(
		genreListId || "POP"
	);

	//checks and loading states using redux toolkit
	if (isFetching) return <Loader title="Loading ..." />;
	if (error) return <Error />;

	const genreTitle = genres.find(({ value }) => value === genreListId?.title);
	console.log(genreTitle);

	return (
		<div className="flex flex-col">
			<div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
				<h2 className="font-bold text-white text-3xl text-left">
					Discover {genreTitle}
				</h2>
				<select
					value={genreListId || "pop"}
					onChange={(e) => dispatch(selectGenreListId(e.target.value))}
					className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5"
				>
					{genres.map((genre) => (
						<option key={genre.value} value={genre.value}>
							{genre.title}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-wrap sm:justify-start justify-center gap-8">
				{data?.map((song, i) => (
					<SongCard
						key={song.key}
						data={data}
						song={song}
						isPlaying={isPlaying}
						activeSong={activeSong}
						i={i}
					/>
				))}
			</div>
		</div>
	);
};

export default Discover;
