import { useMemo, useState, useRef } from 'react'
import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF, useTexture } from '@react-three/drei'
import useGame from '../stores/useGame.jsx'

function useGrassTexture() {
    const [colorMap, roughnessMap, aoMap] = useTexture([
        'grass/Grass001_1K_Color.jpg',
        'grass/Grass001_1K_Roughness.jpg',
        'grass/Grass001_1K_AmbientOcclusion.jpg',
    ]);

    return [
        colorMap,
        roughnessMap,
        aoMap,
    ];
}

function useRockTexture() {
    const [colorMap] = useTexture([
        'rock/Rock020_1K_Color.jpg',
    ]);

    colorMap.wrapS = THREE.RepeatWrapping
    colorMap.wrapT = THREE.RepeatWrapping
    colorMap.repeat.set(3, 1)

    return [
        colorMap
    ];
}

export default function Arrow(props) {
    const { nodes, materials } = useGLTF('/models/arrow.gltf')
    const [arrowX] = useState(() => Math.random() * 4 - 2)
    const [arrowZ] = useState(() => Math.random() * 3 - 1)
    const [arrowYRotation] = useState(() => Math.random() * Math.PI * 2)

    return (
        <group {...props} position={[arrowX, -0.24, arrowZ]} scale={[0.3, 0.3, 0.3]} rotation={[-26, arrowYRotation, Math.PI / 2]} >
            <group rotation={[Math.PI / 2, 0, 0,]} >
                <mesh geometry={nodes.Cylinder001.geometry} material={materials['Metal.004']} />
                <mesh geometry={nodes.Cylinder001_1.geometry} material={materials['BrownDark.006']} castShadow />
                <mesh geometry={nodes.Cylinder001_2.geometry} material={materials['Blue.003']} castShadow />
            </group>
        </group>
    )
}

export function BlockStart({ position = [0, 0, 0] }) {
    const treeSpruce = useGLTF('/models/tree-spruce.gltf')

    treeSpruce.scene.traverse(function (node) {
        if (node.isMesh) { node.castShadow = true; }
    });

    const [colorMap, roughnessMap, aoMap] = useGrassTexture()

    return <group position={position}>
        <Float floatIntensity={0.25} rotationIntensity={0.25}>
            <Text
                font="/fonts/bebas-neue-v9-latin-regular.woff"
                scale={0.4}
                maxWidth={0.25}
                lineHeight={0.75}
                textAlign="right"
                position={[0.75, 0.65, 0]}
                rotation-y={- 0.25}
            >
                Goblin Run
                <meshBasicMaterial toneMapped={false} />
            </Text>
        </Float>

        <primitive object={treeSpruce.scene} scale={0.05} position={[-1, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

        <mesh position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow>
            <boxGeometry />
            <meshStandardMaterial
                map={colorMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
            />
        </mesh>
    </group>
}

export function BlockEnd({ position = [0, 0, 0] }) {
    const chest = useGLTF('/models/chest.gltf')

    const [colorMap] = useRockTexture()

    chest.scene.traverse(function (node) {
        if (node.isMesh) { node.castShadow = true; }
    });

    return <group position={position}>
        <Text
            font="/fonts/bebas-neue-v9-latin-regular.woff"
            scale={0.4}
            position={[0, 2.25, 2]}
        >
            FINISH
            <meshBasicMaterial toneMapped={false} color={'#ff00ff'} />
        </Text>

        <RigidBody type="fixed" colliders="hull" position={[0, 0, 0]} restitution={0.2} friction={0}>
            <mesh position={[0, 0, 0]} scale={[4, 0.2, 4]} receiveShadow>
                <boxGeometry />
                <meshStandardMaterial
                    map={colorMap}
                />
            </mesh>
        </RigidBody>

        <RigidBody colliders="hull" position={[0, 0, 0]} restitution={1} friction={50}>
            <primitive object={chest.scene} scale={0.5} position={[0, 0, 0]} />
        </RigidBody>
    </group>
}

export function BlockSpinner({ position = [0, 0, 0] }) {
    const { nodes, materials } = useGLTF('/models/axe.gltf')

    const [colorMap, roughnessMap, aoMap] = useGrassTexture()

    const obstacle = useRef()
    const dead = useGame((state) => state.dead)
    const [speed] = useState(() => (2.2 * (Math.random() + 1)) * (Math.random() < 0.5 ? - 1 : 1))

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    return <group position={position}>
        <mesh position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow>
            <boxGeometry />
            <meshStandardMaterial
                map={colorMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
            />
        </mesh>

        <RigidBody onContactForce={() => dead()} ref={obstacle} type="kinematicPosition" position={[0, 0.2, 0]} restitution={0.2} friction={0}>
            <group rotation={[0, 0, 0]} scale={[2.4, 2.4, 2.4]}>
                <mesh geometry={nodes.Cube014.geometry} castShadow material={materials['Metal.074']} />
                <mesh geometry={nodes.Cube014_1.geometry} castShadow material={materials['BrownDark.039']} />
                <mesh geometry={nodes.Cube014_2.geometry} castShadow material={materials['Stone.012']} />
            </group>
        </RigidBody >
    </group >
}

export function BlockLimbo({ position = [0, 0, 0] }) {
    const { nodes, materials } = useGLTF('/models/dagger.gltf')

    const [colorMap, roughnessMap, aoMap] = useGrassTexture()

    const obstacle = useRef()
    const dead = useGame((state) => state.dead)
    const blocksCount = useGame((state) => state.blocksCount)
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const y = Math.sin(3.5 * time + timeOffset) + 1.15
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
    })

    return <group position={position}>
        <mesh position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow>
            <boxGeometry />
            <meshStandardMaterial
                map={colorMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
            />
        </mesh>

        {
            [...Array(blocksCount * 3)].map((_, index) => <RigidBody key={`arrow-dagger-${index}`} colliders="hull" onContactForce={() => dead()} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
                <Arrow />
            </RigidBody>)
        }

        <RigidBody colliders="hull" onContactForce={() => dead()} ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <group rotation={[0, Math.PI / 2, Math.PI / 2,]} scale={[2.9, 2.9, 2.9]} position={[1, 0.4, 0]}>
                <mesh geometry={nodes.Cube4152.geometry} castShadow material={materials['Metal.092']} />
                <mesh geometry={nodes.Cube4152_1.geometry} castShadow material={materials['BrownDark.059']} />
                <mesh geometry={nodes.Cube4152_2.geometry} castShadow material={materials['Stone.025']} />
            </group>
        </RigidBody>
    </group>
}

export function BlockAxe({ position = [0, 0, 0] }) {
    const { nodes, materials } = useGLTF('/models/shield.gltf')

    const [colorMap, roughnessMap, aoMap] = useGrassTexture()

    const obstacle = useRef()
    const dead = useGame((state) => state.dead)
    const phase = useGame((state) => state.phase)
    const blocksCount = useGame((state) => state.blocksCount)
    const [timeOffset] = useState(() => Math.random() * Math.PI * 5)

    useFrame((state) => {
        const time = state.clock.getElapsedTime() * 3
        const x = Math.sin(time + timeOffset) * 1.25
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })
    })

    return <group position={position}>
        <mesh position={[0, - 0.1, 0]} scale={[4, 0.2, 4]} receiveShadow>
            <boxGeometry />
            <meshStandardMaterial
                map={colorMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
            />
        </mesh>

        {
            [...Array(blocksCount * 2)].map((_, index) => <RigidBody key={`arrow-shield-${index}`} colliders="hull" onContactForce={() => dead()} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
                <Arrow />
            </RigidBody>)
        }

        <RigidBody onContactForce={() => dead()} ref={obstacle} type="kinematicPosition" position={[0, 0, 0]} restitution={0.2} friction={0}>
            <group>
                <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]} scale={[2, 2, 2]}>
                    <mesh geometry={nodes.Cube4204.geometry} castShadow material={materials['Metal.099']} />
                    <mesh geometry={nodes.Cube4204_1.geometry} castShadow material={materials['BrownDark.069']} />
                </group>
            </group>
        </RigidBody>
    </group>
}

function Bounds({ length = 1 }) {
    const [colorMap] = useRockTexture()

    return <>
        <RigidBody type="fixed" restitution={0.2} friction={0}>
            <mesh
                position={[2.15, 0.8, - (length * 2) + 2]}
                scale={[0.3, 2, 4 * length]}
                castShadow
                receiveShadow
            >
                <boxGeometry />
                <meshStandardMaterial
                    map={colorMap}
                />
            </mesh>

            <mesh
                position={[- 2.15, 0.8, - (length * 2) + 2]}
                scale={[0.3, 2, 4 * length]}
                receiveShadow
            >
                <boxGeometry />
                <meshStandardMaterial
                    map={colorMap}
                />
            </mesh>

            <mesh
                position={[0, 0.8, - (length * 4) + 2]}
                scale={[4, 2, 0.3]}
                receiveShadow
            >
                <boxGeometry />
                <meshStandardMaterial
                    map={colorMap}
                />
            </mesh>

            <CuboidCollider
                type="fixed"
                args={[2, 0.1, 2 * length]}
                position={[0, -0.1, - (length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />
        </RigidBody>
    </>
}

export function Level({
    count = 5,
    types = [BlockSpinner, BlockAxe, BlockLimbo],
}) {

    const blocks = useMemo(() => {
        const blocks = []

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)
        }

        return blocks
    }, [count, types])

    return <>
        <BlockStart position={[0, 0, 0]} />

        {blocks.map((Block, index) => <Block key={index} position={[0, 0, - (index + 1) * 4]} />)}

        <BlockEnd position={[0, 0, - (count + 1) * 4]} />

        <Bounds length={count + 2} />
    </>
}