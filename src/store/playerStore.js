import { create } from 'zustand'

export const usePlayerStore = create((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  queue: [],
  queueIndex: 0,
  repeat: 'off',
  shuffle: false,
  audio: null,

  setAudio: (audio) => set({ audio }),
  
  setQueue: (queue) => {
    const state = get()
    let newIndex = 0
    if (state.currentTrack && queue.length > 0) {
      newIndex = queue.findIndex(t => t.id === state.currentTrack.id)
      if (newIndex === -1) newIndex = 0
    }
    set({ queue, queueIndex: newIndex })
  },

  playTrack: (track, queue = []) => {
    const state = get()
    if (state.audio) {
      state.audio.pause()
      state.audio.currentTime = 0
    }
    set({ 
      currentTrack: track, 
      queue: queue.length > 0 ? queue : [track],
      queueIndex: queue.length > 0 ? queue.findIndex(t => t.id === track.id) : 0,
      isPlaying: true 
    })
  },

  togglePlay: () => {
    const state = get()
    if (state.audio) {
      if (state.isPlaying) {
        state.audio.pause()
      } else {
        state.audio.play()
      }
    }
    set({ isPlaying: !state.isPlaying })
  },

  setVolume: (volume) => {
    const state = get()
    if (state.audio) {
      state.audio.volume = volume
    }
    set({ volume })
  },

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),

  seekTo: (time) => {
    const state = get()
    if (state.audio) {
      state.audio.currentTime = time
      set({ currentTime: time })
    }
  },

  nextTrack: () => {
    const state = get()
    let nextIndex = state.queueIndex + 1

    if (state.shuffle) {
      nextIndex = Math.floor(Math.random() * state.queue.length)
    } else if (nextIndex >= state.queue.length) {
      if (state.repeat === 'all') {
        nextIndex = 0
      } else {
        return
      }
    }

    const nextTrack = state.queue[nextIndex]
    if (nextTrack) {
      set({ currentTrack: nextTrack, queueIndex: nextIndex, isPlaying: true })
    }
  },

  previousTrack: () => {
    const state = get()
    if (state.currentTime > 3) {
      state.audio.currentTime = 0
      set({ currentTime: 0 })
      return
    }

    let prevIndex = state.queueIndex - 1
    if (prevIndex < 0) {
      prevIndex = state.queue.length - 1
    }

    const prevTrack = state.queue[prevIndex]
    if (prevTrack) {
      set({ currentTrack: prevTrack, queueIndex: prevIndex, isPlaying: true })
    }
  },

  toggleRepeat: () => {
    const state = get()
    const modes = ['off', 'all', 'one']
    const currentIndex = modes.indexOf(state.repeat)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    set({ repeat: nextMode })
  },

  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
}))
