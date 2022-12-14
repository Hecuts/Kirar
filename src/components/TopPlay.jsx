import { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetTopChartsQuery } from "../redux/services/shazamCore";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import { Link } from "react-router-dom";
import { SwiperSlide, Swiper } from "swiper/react";
import { FreeMode } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import PlayPause from "./PlayPause";
import { FaPlus, FaCheckCircle } from "react-icons/fa";

const TopChartCard = ({
	song,
	i,
	isPlaying,
	activeSong,
	handlePauseClick,
	handlePlayClick,
}) => {
	const [added, setAdded] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const addtoPlaylist = (song, i) => {
		//Add to playlist functionality
		setAdded(true);
		setShowAlert(true);
		setTimeout(() => {
			setShowAlert(false);
		}, 4000);
	};

	return (
		<div className="w-full flex flex-row items-center hover:bg-[#4c426e] py-2 p-4 rounded-lg cursor-pointer mb-2">
			<h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
			<div className="flex-1 flex flex-row justify-between items-center">
				<img
					src={song?.images?.coverart}
					alt={song?.title}
					className="h-20 w-20 rounded-lg"
				/>
				<div className="flex-1 flex flex-col justify-center mx-3">
					<Link to={`/songs/${song.key}`}>
						<p className="text-xl font-bold text-white">{song?.title}</p>
					</Link>
					<Link to={`/artists/${song?.artists[0].adamid}`}>
						<p className="text-base font-bold text-gray-300 mt-1">
							{song?.subtitle}
						</p>
					</Link>
				</div>
			</div>
			<PlayPause
				isPlaying={isPlaying}
				activeSong={activeSong}
				song={song}
				handlePause={handlePauseClick}
				handlePlay={handlePlayClick}
			/>
			{!added ? (
				<FaPlus
					size={25}
					className="ml-3 text-gray-300 hover:scale-150 "
					onClick={addtoPlaylist}
				/>
			) : (
				<>
					<FaCheckCircle className="ml-3 text-green-500 hover:scale-150 " />
				</>
			)}
			{showAlert && (
				<span className="text-green-500 absolute right-0 font-black animate-slowfade mt-12">
					song added to playlist
				</span>
			)}
		</div>
	);
};

const TopPlay = () => {
	const dispatch = useDispatch();
	const divRef = useRef(null);
	const { activeSong, isPlaying } = useSelector((state) => state.player);
	const { data } = useGetTopChartsQuery();

	useEffect(() => {
		divRef.current.scrollIntoView({ behavior: "smooth" });
	});

	const topPlays = data?.slice(0, 5);

	const handlePauseClick = () => {
		dispatch(playPause(false));
	};

	const handlePlayClick = (song, i) => {
		dispatch(setActiveSong({ song, data, i }));
		dispatch(playPause(true));
	};

	return (
		<div
			ref={divRef}
			className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[500px] max-w-full flex flex-col"
		>
			<div className="w-full flex flex-col">
				<div className="flex flex-row justify-between items-center mt-6 xl:mt-0">
					<h2 className="text-white font-bold text-2xl">Top Charts</h2>
					<Link to="/top-charts">
						<p className="text-gray-300 cursor-pointer text-base">See more</p>
					</Link>
				</div>
				<div className="flex flex-col">
					{topPlays?.map((song, i) => (
						<TopChartCard
							key={song.key}
							song={song}
							i={i}
							isPlaying={isPlaying}
							activeSong={activeSong}
							handlePauseClick={handlePauseClick}
							handlePlayClick={() => handlePlayClick(song, i)}
						/>
					))}
				</div>
				<div>
					<div className="flex flex-row justify-between items-center">
						<h2 className="text-white font-bold text-2xl">Top Artists</h2>
						<Link to="/top-charts">
							<p className="text-gray-300 cursor-pointer text-base">See more</p>
						</Link>
					</div>
				</div>
				<Swiper
					slidesPerView="auto"
					spaceBetween={15}
					freeMode
					centeredSlides
					centeredSlidesBounds
					modules={[FreeMode]}
					className="mt-4"
				>
					{topPlays?.map((song, i) => (
						<SwiperSlide
							key={song?.key}
							style={{ width: "25%", height: "auto" }}
							className="shadow-lg rounded-full animate-slideright"
						>
							<Link to={`/artists/${song?.artists[0].adamid}`}>
								<img
									src={song?.images.background}
									alt="name"
									className="rounded-full w-full object-cover"
								/>
							</Link>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
};

export default TopPlay;
