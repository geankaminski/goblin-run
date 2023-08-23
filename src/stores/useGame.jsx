import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => {

    return {
        blocksCount: 1,
        maxBlocks: 2,
        lifes: 3,

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
                    return { phase: 'playing' }
                }

                return {}
            })
        },

        dead: () => {
            set((state) => {
                if (state.phase === 'playing') {
                    state.hitAudio.play()
                    if (state.lifes > 1) {
                        return { phase: 'ready', lifes: state.lifes - 1 }
                    } else {
                        return { phase: 'ready', lifes: 3, blocksCount: 1 }
                    }
                }

                return {}
            })
        },

        restart: () => {
            set((state) => {
                if (state.phase === 'playing' || state.phase === 'ended') {
                    state.hitAudio.play()
                    return { phase: 'ready' }
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
                    return { phase: 'ended' }
                }

                return {}
            })
        }
    }
}))