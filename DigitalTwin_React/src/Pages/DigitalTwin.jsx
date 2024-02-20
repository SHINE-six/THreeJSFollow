import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MeshStandardMaterial, BoxGeometry, PlaneGeometry, CylinderGeometry, SphereGeometry } from 'three';
import { PerspectiveCamera } from '@react-three/drei';

function Floor() {
    const floorMaterial = new MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMapIntensity: 0.5
    })

    return (
        <mesh material={floorMaterial} geometry={new PlaneGeometry(10, 10)} rotation={[-Math.PI * 0.5, 0, 0]} receiveShadow />
    );
}

function Machinery1({ name, position, isActive, handleComponentClick }) {
    const machineryMaterial = new MeshStandardMaterial({
        color: isActive ? '#ff0000' : '#bbbbbb',
        metalness: 0.3,
        roughness: 0.4,
        envMapIntensity: 0.5
    });
    

    return (
        <group name={name} position={position} onClick={handleComponentClick}>
            <mesh material={machineryMaterial} geometry={new BoxGeometry(0.7, 2, 0.4)} position={[0, 0, 0]} />
            <mesh material={machineryMaterial} geometry={new BoxGeometry(0.3, 1, 0.4)} position={[0.5, 0, 0]} />
        </group>
    );
}

function Machinery2({ name, position, isActive, handleComponentClick }) {
    const machineryMaterial = new MeshStandardMaterial({
        color: isActive ? '#ff0000' : '#bbbbbb',
        metalness: 0.3,
        roughness: 0.4,
        envMapIntensity: 0.5
    });

    return (
        <group name={name} position={position} onClick={handleComponentClick}>
            <mesh material={machineryMaterial} position={[0, 0, 0]} geometry={new BoxGeometry(1.5, 0.5, 0.8)} />
            <mesh material={machineryMaterial} position={[0, 0.3, 0]} geometry={new BoxGeometry(1, 0.3, 0.6)} />
            <mesh material={machineryMaterial} position={[0, 0.6, 0]} geometry={new SphereGeometry(0.3, 20, 20)} />
            <mesh material={machineryMaterial} position={[0, 0.9, 0.2]} rotation={[Math.PI / 2 * 0.4, 0, 0]} geometry={new CylinderGeometry(0.15, 0.15, 0.6, 20)} />
            <mesh material={machineryMaterial} position={[0, 1.2, 0.4]} geometry={new SphereGeometry(0.2, 20, 20)} />
            <mesh material={machineryMaterial} position={[0, 1, 0.57]} rotation={[Math.PI / 2 * -0.4, 0, 0]} geometry={new CylinderGeometry(0.1, 0.1, 0.4, 20)} />
        </group>
    );
}

function Machinery3({ name, position, isActive, handleComponentClick }) {
    const machineryMaterial = new MeshStandardMaterial({
        color: isActive ? '#ff0000' : '#bbbbbb',
        metalness: 0.3,
        roughness: 0.4,
        envMapIntensity: 0.5
    });

    return (
        <group name={name} position={position} onClick={handleComponentClick}>
            <mesh material={machineryMaterial} position={[0, 0, 0]} geometry={new BoxGeometry(1.3, 0.6, 1)} />
            <mesh material={machineryMaterial} position={[0.6, 0.5, 0.5]} geometry={new BoxGeometry(0.1, 0.5, 0.1)} />
            <mesh material={machineryMaterial} position={[0.6, 0.5, -0.5]} geometry={new BoxGeometry(0.1, 0.5, 0.1)} />
            <mesh material={machineryMaterial} position={[-0.6, 0.5, 0.5]} geometry={new BoxGeometry(0.1, 0.5, 0.1)} />
            <mesh material={machineryMaterial} position={[-0.6, 0.5, -0.5]} geometry={new BoxGeometry(0.1, 0.5, 0.1)} />
        </group>
    );
}


const DigitalTwin = () => {
    const angleFromHorizontal = 25; 
    const polarAngle = Math.PI / 2 - angleFromHorizontal * (Math.PI / 180);
    const [activeComponent, setActiveComponent] = useState(null);

    const handleComponentClick = (component) => {
        setActiveComponent(component);
        console.log('clicked', component);
    };

    return (
        <Canvas className='bg-yellow-100 h-max'>
            <PerspectiveCamera makeDefault position={[0, 5, 5]}/>
            <ambientLight intensity={2}/>
            <directionalLight position={[0, 0, 5]} intensity={1} />
            <OrbitControls minPolarAngle={polarAngle} maxPolarAngle={polarAngle} enablePan={false} maxDistance={10}/>

            <Floor />
            <Machinery1 name={'1'} position={[3,0,0]} isActive={activeComponent?.eventObject?.name === '1'} handleComponentClick={handleComponentClick}/>
            <Machinery2 name={'2'} position={[0,0,0]} isActive={activeComponent?.eventObject?.name === '2'} handleComponentClick={handleComponentClick}/>
            <Machinery3 name={'3'} position={[-2,0,0]} isActive={activeComponent?.eventObject?.name === '3'} handleComponentClick={handleComponentClick}/>
            <Machinery3 name={'4'} position={[-2,0,2]} isActive={activeComponent?.eventObject?.name === '4'} handleComponentClick={handleComponentClick}/>
        </Canvas>
    )
}

export default DigitalTwin;