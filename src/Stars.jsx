/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import {
    useGLTF,

} from '@react-three/drei'


export default function Model(props) {
    const group = useRef()
    const { nodes, materials } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/star/model.gltf')
    return (
        <group ref={group} {...props} dispose={null}>
            <mesh geometry={nodes.star.geometry} material={materials['Yellow.030']} rotation={[Math.PI / 2, 0, 0,]} />

        </group>
    )
}

useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/star/model.gltf')