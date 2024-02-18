import React, { useEffect, useRef, useState } from "react";

import "./VideoPlayer.scss";

import { ReactComponent as SeekForward } from "../../assets/forwardlogo.svg";
import { ReactComponent as SeekBackward } from "../../assets/backwardlogo.svg";
import { ReactComponent as Play } from "../../assets/play.svg";
import { ReactComponent as Pause } from "../../assets/pause.svg";
import { ReactComponent as Maximize } from "../../assets/maximizelogo.svg";
import { ReactComponent as Minimize } from "../../assets/minimizelogo.svg";
import { ReactComponent as Volume } from "../../assets/volumelogo.svg";

const VideoPlayer = ({ currentPlayingVideo, }) => {
  const [settings, setSettings] = useState(defaultSettings);

  const videoTagRef = useRef()

  const handlePausePlayClick = () => {
    if (settings.playing) {
      videoTagRef.current.pause()
    } else {
      videoTagRef.current.play()
    }
    setSettings(prev => ({ ...prev, playing: !prev.playing }))
  }

  const seekForwardClick = (event) => {
    event.stopPropagation()
    if (videoTagRef.current) {
      videoTagRef.current.currentTime += 10;
    }
  };

  const seekBackwardClick = (event) => {
    event.stopPropagation()
    if (videoTagRef.current) {
      videoTagRef.current.currentTime -= 10;
    }
  };


  const [videoProgress, setVideoProgress] = useState(0)
  const handleSeek = (event) => {
    setVideoProgress(event.target.value)
    videoTagRef.current.currentTime = event.target.value;
  }

  useEffect(() => {
    const handleMetadataLoaded = () => {
      const durationInSeconds = videoTagRef?.current?.duration;
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);
      setSettings(prev => ({ ...prev, videoDuration: `${minutes}:${seconds}` }));

      const videoSettings = JSON.parse(localStorage.getItem('videoSettings'))


      if (videoSettings) {
        videoTagRef.current.currentTime = videoSettings.currentDurationRaw
      }

    };

    videoTagRef.current.addEventListener('loadedmetadata', handleMetadataLoaded);

    return () => {
      videoTagRef.current.removeEventListener('loadedmetadata', handleMetadataLoaded);
    };
  }, [videoTagRef.current]);


  useEffect(() => {
    const updateCurrentDuration = () => {
      const durationInSeconds = videoTagRef?.current?.currentTime;
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);
      setVideoProgress(durationInSeconds)
      setSettings(prev => ({ ...prev, currentDuration: `${minutes}:${seconds}` }));



      localStorage.setItem('videoSettings', JSON.stringify({ ...settings, currentDurationRaw: durationInSeconds }))

    };

    const updateTimeListener = () => {
      videoTagRef.current.addEventListener('timeupdate', updateCurrentDuration);
    };

    updateTimeListener();


    return () => {
      videoTagRef?.current?.removeEventListener('timeupdate', updateCurrentDuration);
    };
  }, [videoTagRef]);



  const setVideoFullScreen = () => {
    if (!document.fullscreenElement) {
      videoTagRef.current.requestFullscreen().then(() => setSettings(prev => ({ ...prev, fullScreen: !prev.fullScreen })));
    } else {
      document.exitFullscreen().then(() => setSettings(prev => ({ ...prev, fullScreen: !prev.fullScreen })));
    }
  }

  const [volumeToggled, setVolumeToggled] = useState(false)
  const volumeDragHandler = (event) => {
    const newVolume = parseFloat(event.target.value);
    videoTagRef.current.volume = newVolume;
    setSettings(prev => ({ ...prev, volume: `${newVolume}` }));
  }

  const playbackSpeeds = ['1', '1.5', '2', '0.5',]
  const [selectedPlaybackSpeed, setSelectedPlaybackSpeed] = useState(0)

  const togglePlaybackSpeed = () => {

    let newPlaybackSpeed
    if (selectedPlaybackSpeed < playbackSpeeds.length - 1) {
      newPlaybackSpeed = parseFloat(Number(playbackSpeeds[selectedPlaybackSpeed + 1]))
    } else {
      newPlaybackSpeed = 1;
    }

    videoTagRef.current.playbackRate = newPlaybackSpeed;
    setSettings(prev => ({ ...prev, playbackSpeed: newPlaybackSpeed }));

    setSelectedPlaybackSpeed(prev => {
      if (prev < playbackSpeeds.length - 1) {
        return prev + 1
      } else {
        return 0
      }
    })
  }

  const [showControllScreen, setControllScreen] = useState(true)

  return (
    <div className="video-player-component">
      <div className="video-player-container">
        <video
          tabIndex={0}
          onMouseEnter={() => setControllScreen(true)}
          onMouseLeave={() => setControllScreen(false)}
          autoFocus
          ref={videoTagRef}
          className="video-player"
          src={currentPlayingVideo?.sources?.[0]}

        ></video>

        {
          (showControllScreen || videoTagRef.current.paused) &&
          <div className="controls-screen" onClick={handlePausePlayClick}
            onMouseEnter={() => setControllScreen(true)}
            onMouseLeave={() => setControllScreen(false)}
          >
            <div className="playback-icons">
              <SeekBackward className="icons seek" onClick={seekBackwardClick} />
              {settings.playing ?
                <Pause className="icons seek" onClick={handlePausePlayClick} />
                :
                <Play className="icons seek" onClick={handlePausePlayClick} />
              }
              <SeekForward className="icons seek" onClick={seekForwardClick} />
            </div>
            <div className="progress-sound-icons" onClick={event => event.stopPropagation()}>
              <div className="progress-tracker">
                <div className="time">
                  <span className="current-time">{settings?.currentDuration} </span>
                  <span className="max-time">{settings?.videoDuration}</span>
                </div>
                <input htmlFor='progress-bar' min={0} max={videoTagRef?.current?.duration} onChange={handleSeek} value={videoProgress} type="range" className="video-player-range" />
                <label htmlFor="progress-bar"></label>
              </div>

              <div className="other-ctrls">
                <span onClick={togglePlaybackSpeed}>{playbackSpeeds[selectedPlaybackSpeed]}X</span>
                <div className="volume-icon">
                  <Volume className="icons" onClick={() => setVolumeToggled(prev => !prev)} />
                  {volumeToggled && <input htmlFor='volume-bar' step={0.1} onChange={volumeDragHandler} value={Number(settings.volume)} className="vol-input" type="range" min={0} max={1} />}
                  <label htmlFor="volume-bar"></label>
                </div>
                {settings.fullScreen ? (
                  <Minimize className="icons" onClick={setVideoFullScreen} />
                ) : (
                  <Maximize className="icons" onClick={setVideoFullScreen} />
                )}
              </div>
            </div>
          </div>
        }
      </div>

      <div className="video-details">
        <div className="title">{currentPlayingVideo?.title}</div>
        <div className="description">
          {currentPlayingVideo?.description}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;


const defaultSettings = {
  playing: false,
  volume: '0.5',
  fullScreen: false,
  playbackSpeed: 1,
  videoDuration: '00:00',
  currentDuration: '00:00',
};

