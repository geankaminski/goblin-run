import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => {

    return {
        forward: false,
        backward: false,
        leftward: false,
        rightward: false,
        jump: false,
        handleTouch: (key, value) => {
            set(() => {
                return { [key]: value }
            })
        },
        handleKey: (e, value) => {
            switch (e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    set(() => {
                        return { forward: value }
                    })
                    break
                case 'KeyS':
                case 'ArrowDown':
                    set(() => {
                        return { backward: value }
                    })
                    break
                case 'KeyA':
                case 'ArrowLeft':
                    set(() => {
                        return { leftward: value }
                    })
                    break
                case 'KeyD':
                case 'ArrowRight':
                    set(() => {
                        return { rightward: value }
                    })
                    break
                case 'Space':
                    set(() => {
                        return { jump: value }
                    })
                    break
                default:
                    break
            }
        }
    }
}))