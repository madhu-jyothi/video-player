import React, { useEffect, useState } from "react";

import "./Playlist.scss";
import { ReactComponent as Magnify } from "../../assets/magnify.svg";

const Playlist = ({ videoList, currentPlayingVideo, updateCurrentVideo }) => {
  const [searchPlaylist, setSearchPlaylist] = useState("");
  const [playlistArray, setPlaylistArray] = useState(videoList || []);

  useEffect(() => {
    setPlaylistArray(videoList);
  }, [videoList]);

  const searchHandler = (event) => {
    setSearchPlaylist(event.target.value);

    const filteredVideos = videoList.filter((item) =>
      item.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setPlaylistArray(filteredVideos);
  };

  const onPlaylistCardClick = (video) => {
    updateCurrentVideo(video)

    debugger

    console.log('in playlist component', JSON.stringify(video))
    localStorage.setItem('videoData', JSON.stringify(video))
  }




  return (
    <div className="playlist-component">
      <div className="search-bar">
        <input
          value={searchPlaylist}
          onChange={searchHandler}
          placeholder="Search your playlist"
          type="search"

        />
        <Magnify />
      </div>

      {playlistArray?.map((video) => {
        return (
          <div onClick={() => onPlaylistCardClick(video)} className={`playlist-card ${currentPlayingVideo.title === video.title && 'current-playing'}`} key={video?.title}>
            <img src={"https://picsum.photos/150"} alt="" />
            <div className="playlist-detail">
              <div className="title"> {video.title} </div>
              <div title={video.description} className="description">
                {video.description.slice(0, 100)}
                {video.description.length > 100 ? "..." : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Playlist;
