import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => {

    return {
        blocksCount: 5,
        blocksSeed: 0,
        treeCount: 2,

        /**
         * Time
         */
        startTime: 0,
        endTime: 0,

        music: new Audio('/audio/music.mp3'),
        winAudio: new Audio('/audio/win.mp3'),
        hitAudio: new Audio('/audio/hit.mp3'),

        /**
         * Phases
         */
        phase: 'ready',

        start: () => {
            set((state) => {
                if (state.phase === 'ready') {
                    state.music.play()
                    return { phase: 'playing', startTime: Date.now() }
                }

                return {}
            })
        },

        restart: () => {
            set((state) => {
                if (state.phase === 'playing' || state.phase === 'ended') {
                    state.hitAudio.play()
                    return { phase: 'ready', blocksSeed: Math.random() }
                }

                return {}
            })
        },

        end: () => {
            set((state) => {
                if (state.phase === 'playing') {
                    state.music.pause()
                    state.music.currentTime = 0
                    state.winAudio.play()
                    return { phase: 'ended', endTime: Date.now() }
                }

                return {}
            })
        }
    }
}))