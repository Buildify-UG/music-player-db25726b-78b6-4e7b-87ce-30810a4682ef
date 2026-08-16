import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number;
}

const SAMPLE_SONGS: Song[] = [
  { id: 1, title: "Midnight Dreams", artist: "Luna Echo", duration: 243 },
  { id: 2, title: "Electric Pulse", artist: "Neon Waves", duration: 218 },
  { id: 3, title: "Ocean Breeze", artist: "Coastal Vibes", duration: 256 },
  { id: 4, title: "Urban Jungle", artist: "City Lights", duration: 195 },
  { id: 5, title: "Starlight", artist: "Cosmic Dreams", duration: 287 },
];

export default function Index() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = SAMPLE_SONGS[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSongEnd = () => {
    if (currentSongIndex < SAMPLE_SONGS.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
      setCurrentTime(0);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentSongIndex < SAMPLE_SONGS.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnd}
        src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
      />

      <div className="w-full max-w-md">
        {/* Album Art */}
        <div className="mb-8 flex justify-center">
          <div className="w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg shadow-2xl flex items-center justify-center">
            <Music className="w-32 h-32 text-white opacity-80" />
          </div>
        </div>

        {/* Song Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h2>
          <p className="text-purple-200 text-lg">{currentSong.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={currentSong.duration}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-purple-300 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentSongIndex === 0}
            className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentSongIndex === SAMPLE_SONGS.length - 1}
            className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 mb-8 px-4">
          <Volume2 className="w-5 h-5 text-purple-300" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            className="flex-1"
          />
          <span className="text-sm text-purple-300 w-8">{volume}%</span>
        </div>

        {/* Playlist */}
        <div className="bg-purple-900/40 backdrop-blur rounded-lg p-4 border border-purple-700/50">
          <h3 className="text-white font-semibold mb-3">Playlist</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {SAMPLE_SONGS.map((song, index) => (
              <button
                key={song.id}
                onClick={() => {
                  setCurrentSongIndex(index);
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
                className={`w-full text-left p-3 rounded transition ${
                  index === currentSongIndex
                    ? "bg-purple-600 text-white"
                    : "bg-purple-800/30 text-purple-100 hover:bg-purple-800/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm opacity-75">{song.artist}</p>
                  </div>
                  <span className="text-sm">{formatTime(song.duration)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
