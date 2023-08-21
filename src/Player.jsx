import { useRapier, RigidBody } from '@react-three/rapier'
import { useFrame, useLoader } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import useGame from './stores/useGame.jsx'

export default function Player() {
    const body = useRef()
    const primitive = useRef()

    const korrigan = useLoader(GLTFLoader, './korrigan-hat.gltf')
    let mixer
    let actions = []
    if (korrigan.animations.length > 0) {
        // course_chapeau & pose_chapeau
        mixer = new THREE.AnimationMixer(korrigan.scene)
        korrigan.animations.forEach((clip) => {
            actions.push(mixer.clipAction(clip))
        })
        actions[1].play()
    }

    korrigan.scene.traverse(function (node) {
        if (node.isMesh) { node.castShadow = true; }
    });

    const [subscribeKeys, getKeys] = useKeyboardControls()
    const { rapier, world } = useRapier()

    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())


    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)

    const jump = () => {
        const origin = body.current.translation()
        origin.y -= 0
        const direction = { x: 0, y: - 1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if (hit.toi < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.3, z: 0 })
        }
    }

    const reset = () => {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })
        body.current.setRotation({ x: 0, y: 1, z: 0, w: 0 })
        primitive.current.rotation.y = Math.PI
    }

    const fadeToAction = (actionIndex, duration) => {
        if (actionIndex === 0) {
            actions[1].stop()
            actions[0].play()
        }

        if (actionIndex === 1) {
            actions[0].stop()
            actions[1].play()
        }
    }

    useEffect(() => {
        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (value) => {
                if (value === 'ready')
                    reset()
            }
        )

        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) => {
                if (value)
                    jump()
            }
        )

        const unsubscribeAny = subscribeKeys(
            () => {
                start()
            }
        )

        return () => {
            unsubscribeReset()
            unsubscribeJump()
            unsubscribeAny()
        }
    }, [])

    useFrame((state, delta) => {
        mixer?.update(delta)

        /**
         * Controls
         */
        const { forward, backward, leftward, rightward } = getKeys()

        if (forward) {
            const position = body.current.translation()
            position.z -= 0.05
            body.current.setTranslation(position)

            primitive.current.rotation.y = 0

            fadeToAction(0, 0.1)
        }

        if (rightward) {
            const position = body.current.translation()
            position.x += 0.02
            body.current.setTranslation(position)

            primitive.current.rotation.y = - Math.PI / 2

            fadeToAction(0, 0.2)
        }

        if (backward) {
            const position = body.current.translation()
            position.z += 0.05
            body.current.setTranslation(position)

            primitive.current.rotation.y = Math.PI

            fadeToAction(0, 0.2)
        }

        if (leftward) {
            const position = body.current.translation()
            position.x -= 0.02
            body.current.setTranslation(position)

            primitive.current.rotation.y = Math.PI / 2

            fadeToAction(0, 0.2)
        }

        if (!forward && !backward && !leftward && !rightward) {
            fadeToAction(1, 0.2)
        }

        /**
         * Camera
         */
        const bodyPosition = body.current.translation()

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        /**
        * Phases
        */
        if (bodyPosition.z < - (blocksCount * 4 + 2))
            end()

        if (bodyPosition.y < - 4)
            restart()
    })

    return <RigidBody
        ref={body}
        canSleep={false}
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
    >
        <primitive
            object={korrigan.scene}
            ref={primitive}
        />
    </RigidBody>
}