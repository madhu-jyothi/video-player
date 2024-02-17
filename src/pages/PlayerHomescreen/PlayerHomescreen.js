import React, { useEffect, useState } from "react";
import "./PlayerHomescreen.scss";
import VideoPlayer from "../../components/Player/VideoPlayer";
import Playlist from "../../components/Playlist/Playlist";

const PlayerHomescreen = () => {
  const [videoList, SetVideoList] = useState([]);

  const [selectedVideo, setSelectedVideo] = useState({});

  useEffect(() => {
    fetch(videoUrl, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    })
      .then((res) => res.text())
      .then((videos) => {
        var jsonString = videos.match(/\{(.|\n)*\}/)[0];
        SetVideoList(JSON.parse(jsonString).categories[0].videos);
        setSelectedVideo(JSON.parse(jsonString).categories[0].videos[0]);
      });
  }, []);


  return (
    <div className="player-homescreen-component">
      <div className="header">Rigi Video</div>
      <div className="content-area">
        <div className="player-container">
          {videoList.length > 0 && <VideoPlayer currentPlayingVideo={selectedVideo} />}
        </div>
        <div className="playlist">
          <Playlist
            updateCurrentVideo={setSelectedVideo}
            videoList={videoList}
            currentPlayingVideo={selectedVideo}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerHomescreen;

const videoUrl =
  "https://gist.githubusercontent.com/jsturgis/3b19447b304616f18657/raw/a8c1f60074542d28fa8da4fe58c3788610803a65/gistfile1.txt";
