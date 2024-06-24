import dotenv from 'dotenv';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { truncateWithEllipses } from '../../utils/index.js';

dotenv.config();

const fetchAccessToken = async () => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const authHeader = btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`);

  const headers = new Headers({
    'Authorization': `Basic ${authHeader}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  const data = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: headers,
    body: data.toString()
  })

  const json = await res.json();
  return json.access_token;
}

const getCurrentlyPlayingTrack = async () => {
  try {
    const access_token = await fetchAccessToken();
    const api = SpotifyApi.withAccessToken(
      process.env.SPOTIFY_CLIENT_ID, { access_token }
    );
    const track = await api.player.getCurrentlyPlayingTrack()
    if (track && track.item) {
      return {
        image: track.item.album.images[2].url,
        title: truncateWithEllipses(track.item.artists[0].name, 20),
        description: truncateWithEllipses(track.item.name, 20),
        elapsed: track.progress_ms,
        duration: track.item.duration_ms,
        is_playing: track.is_playing
      }
    }
  } catch (e) {
    console.warn(e)
  }
}

export { getCurrentlyPlayingTrack }


