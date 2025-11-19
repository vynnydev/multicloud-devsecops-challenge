"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useTheme } from "@/contexts/theme-context"

interface Machine3DViewerProps {
  machineName: string
  machineType: string
}

export function Machine3DViewer({ machineName, machineType }: Machine3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    console.log("[v0] Machine3DViewer rendering:", { machineName, machineType })

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(theme === "light" ? 0xf1f5f9 : 0x0f172a)
    scene.fog = new THREE.Fog(scene.background.getHex(), 10, 50)

    const camera = new THREE.PerspectiveCamera(
      35,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(8, 6, 12)
    camera.lookAt(0, 1, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
    containerRef.current.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // Main key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
    keyLight.position.set(10, 15, 10)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 4096
    keyLight.shadow.mapSize.height = 4096
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 50
    keyLight.shadow.camera.left = -15
    keyLight.shadow.camera.right = 15
    keyLight.shadow.camera.top = 15
    keyLight.shadow.camera.bottom = -15
    keyLight.shadow.bias = -0.0001
    scene.add(keyLight)

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xadd8e6, 0.5)
    fillLight.position.set(-8, 8, -5)
    scene.add(fillLight)

    // Rim light for depth
    const rimLight = new THREE.DirectionalLight(0xffa500, 0.4)
    rimLight.position.set(-10, 5, -10)
    scene.add(rimLight)

    // Accent light from below
    const accentLight = new THREE.PointLight(0x4a90e2, 0.8, 20)
    accentLight.position.set(0, 0.5, 5)
    scene.add(accentLight)

    // Hemisphere light for realistic sky/ground
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4)
    hemiLight.position.set(0, 20, 0)
    scene.add(hemiLight)

    const machineGroup = new THREE.Group()

    if (machineType === "centrifugal-pump" || machineName.includes("Bomba") || machineName.includes("Centrífuga")) {
      console.log("[v0] Rendering Centrifugal Pump")
      
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x2874a6,
        metalness: 0.85,
        roughness: 0.2,
        envMapIntensity: 1.8,
      })

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, 0.4, 2.5),
        baseMaterial
      )
      base.position.y = 0.2
      base.castShadow = true
      base.receiveShadow = true
      machineGroup.add(base)

      const motorMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        metalness: 0.8,
        roughness: 0.25,
        envMapIntensity: 1.6,
      })

      const motorBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.7, 2.5, 32),
        motorMaterial
      )
      motorBody.rotation.z = Math.PI / 2
      motorBody.position.set(-1, 1.5, 0)
      motorBody.castShadow = true
      machineGroup.add(motorBody)

      for (let i = 0; i < 8; i++) {
        const fin = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 1.4, 2.2),
          new THREE.MeshStandardMaterial({ color: 0x2c3e50, metalness: 0.7, roughness: 0.3 })
        )
        const angle = (i * Math.PI * 2) / 8
        fin.position.set(
          -1 + Math.cos(angle) * 0.65,
          1.5 + Math.sin(angle) * 0.65,
          0
        )
        fin.rotation.y = angle
        machineGroup.add(fin)
      }

      const shaftMaterial = new THREE.MeshStandardMaterial({
        color: 0xbdc3c7,
        metalness: 0.95,
        roughness: 0.05,
        envMapIntensity: 2.5,
      })

      const motorShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32),
        shaftMaterial
      )
      motorShaft.rotation.z = Math.PI / 2
      motorShaft.position.set(0.5, 1.5, 0)
      machineGroup.add(motorShaft)

      const pumpMaterial = new THREE.MeshStandardMaterial({
        color: 0x3498db,
        metalness: 0.9,
        roughness: 0.15,
        envMapIntensity: 2,
      })

      const voluteGeometry = new THREE.TorusGeometry(1, 0.5, 16, 32, Math.PI * 1.5)
      const volute = new THREE.Mesh(voluteGeometry, pumpMaterial)
      volute.rotation.y = Math.PI / 2
      volute.position.set(1.5, 1.5, 0)
      volute.castShadow = true
      machineGroup.add(volute)

      const frontCover = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 1.3, 0.3, 32),
        pumpMaterial
      )
      frontCover.rotation.z = Math.PI / 2
      frontCover.position.set(2.2, 1.5, 0)
      frontCover.castShadow = true
      machineGroup.add(frontCover)

      const impellerMaterial = new THREE.MeshStandardMaterial({
        color: 0xf39c12,
        metalness: 0.85,
        roughness: 0.15,
      })

      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.8, 0.05),
          impellerMaterial
        )
        blade.position.set(
          1.5,
          1.5 + Math.cos(angle) * 0.5,
          Math.sin(angle) * 0.5
        )
        blade.rotation.x = angle
        machineGroup.add(blade)
      }

      const flangeMaterial = new THREE.MeshStandardMaterial({
        color: 0x7f8c8d,
        metalness: 0.8,
        roughness: 0.2,
      })

      const suctionFlange = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32),
        flangeMaterial
      )
      suctionFlange.position.set(1.5, 0.8, 0)
      suctionFlange.castShadow = true
      machineGroup.add(suctionFlange)

      const pipeMaterial = new THREE.MeshStandardMaterial({
        color: 0x95a5a6,
        metalness: 0.75,
        roughness: 0.3,
      })

      const suctionPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
        pipeMaterial
      )
      suctionPipe.position.set(1.5, 0.2, 0)
      suctionPipe.castShadow = true
      machineGroup.add(suctionPipe)

      const dischargeFlange = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32),
        flangeMaterial
      )
      dischargeFlange.rotation.z = Math.PI / 2
      dischargeFlange.position.set(1.5, 2.5, 0)
      dischargeFlange.castShadow = true
      machineGroup.add(dischargeFlange)

      const dischargePipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 1.5, 32),
        pipeMaterial
      )
      dischargePipe.rotation.z = Math.PI / 2
      dischargePipe.position.set(2.3, 2.5, 0)
      dischargePipe.castShadow = true
      machineGroup.add(dischargePipe)

      const guardMaterial = new THREE.MeshStandardMaterial({
        color: 0xe74c3c,
        metalness: 0.6,
        roughness: 0.4,
      })

      const guard = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
        guardMaterial
      )
      guard.rotation.z = Math.PI / 2
      guard.position.set(0.2, 1.5, 0)
      machineGroup.add(guard)

      const boltMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.9,
        roughness: 0.2,
      })

      const boltPositions = [
        [-1.8, 0.4, -1],
        [-1.8, 0.4, 1],
        [2, 0.4, -1],
        [2, 0.4, 1],
      ]

      boltPositions.forEach((pos) => {
        const bolt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16),
          boltMaterial
        )
        bolt.position.set(pos[0], pos[1], pos[2])
        machineGroup.add(bolt)
      })

      const gaugeBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32),
        new THREE.MeshStandardMaterial({ color: 0xecf0f1, metalness: 0.3, roughness: 0.7 })
      )
      gaugeBody.rotation.x = Math.PI / 2
      gaugeBody.position.set(2.8, 2.5, 0.5)
      machineGroup.add(gaugeBody)

      const gaugeFace = new THREE.Mesh(
        new THREE.CircleGeometry(0.13, 32),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x3498db, emissiveIntensity: 0.2 })
      )
      gaugeFace.rotation.x = Math.PI / 2
      gaugeFace.position.set(2.8, 2.5, 0.56)
      machineGroup.add(gaugeFace)

    } else if (machineType === "car-engine" || machineType.includes("motor") || machineType.includes("engine") || machineName.includes("Motor") || machineName.includes("V8")) {
      console.log("[v0] Rendering V8 Turbo Engine")
      
      const blockMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.85,
        roughness: 0.2,
        envMapIntensity: 1.8,
      })

      const engineBlock = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 2.5),
        blockMaterial
      )
      engineBlock.position.y = 1.5
      engineBlock.castShadow = true
      engineBlock.receiveShadow = true
      machineGroup.add(engineBlock)

      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        metalness: 0.8,
        roughness: 0.25,
        envMapIntensity: 1.6,
      })

      const leftHead = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.6, 0.8),
        headMaterial
      )
      leftHead.position.set(0, 2.5, -0.6)
      leftHead.rotation.x = -0.3
      leftHead.castShadow = true
      machineGroup.add(leftHead)

      const rightHead = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.6, 0.8),
        headMaterial
      )
      rightHead.position.set(0, 2.5, 0.6)
      rightHead.rotation.x = 0.3
      rightHead.castShadow = true
      machineGroup.add(rightHead)

      const chromeMaterial = new THREE.MeshStandardMaterial({
        color: 0xecf0f1,
        metalness: 0.95,
        roughness: 0.05,
        envMapIntensity: 2.5,
      })

      const leftValveCover = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.3, 0.7),
        chromeMaterial
      )
      leftValveCover.position.set(0, 2.95, -0.65)
      leftValveCover.rotation.x = -0.3
      leftValveCover.castShadow = true
      machineGroup.add(leftValveCover)

      const rightValveCover = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.3, 0.7),
        chromeMaterial
      )
      rightValveCover.position.set(0, 2.95, 0.65)
      rightValveCover.rotation.x = 0.3
      rightValveCover.castShadow = true
      machineGroup.add(rightValveCover)

      const plugMaterial = new THREE.MeshStandardMaterial({
        color: 0xe67e22,
        metalness: 0.7,
        roughness: 0.3,
      })

      for (let i = 0; i < 4; i++) {
        const leftPlug = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16),
          plugMaterial
        )
        leftPlug.position.set(-1 + i * 0.7, 3.1, -0.9)
        leftPlug.rotation.x = -0.3
        machineGroup.add(leftPlug)

        const rightPlug = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16),
          plugMaterial
        )
        rightPlug.position.set(-1 + i * 0.7, 3.1, 0.9)
        rightPlug.rotation.x = 0.3
        machineGroup.add(rightPlug)
      }

      const turboMaterial = new THREE.MeshStandardMaterial({
        color: 0x7f8c8d,
        metalness: 0.9,
        roughness: 0.15,
        envMapIntensity: 2,
      })

      const turboHousing = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI),
        turboMaterial
      )
      turboHousing.rotation.z = Math.PI / 2
      turboHousing.position.set(-1.8, 1.8, 1.2)
      turboHousing.castShadow = true
      machineGroup.add(turboHousing)

      const turboInlet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.3, 0.5, 32),
        turboMaterial
      )
      turboInlet.rotation.x = Math.PI / 2
      turboInlet.position.set(-1.8, 1.8, 1.7)
      machineGroup.add(turboInlet)

      const turboOutlet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.25, 0.6, 32),
        turboMaterial
      )
      turboOutlet.rotation.z = Math.PI / 2
      turboOutlet.position.set(-1.3, 1.8, 1.2)
      machineGroup.add(turboOutlet)

      const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0xf39c12,
        metalness: 0.9,
        roughness: 0.1,
      })

      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.4, 0.02),
          wheelMaterial
        )
        blade.position.set(
          -1.8,
          1.8 + Math.cos(angle) * 0.2,
          1.2 + Math.sin(angle) * 0.2
        )
        blade.rotation.x = angle
        machineGroup.add(blade)
      }

      const intercoolerMaterial = new THREE.MeshStandardMaterial({
        color: 0x95a5a6,
        metalness: 0.7,
        roughness: 0.4,
      })

      const intercooler = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.8, 0.4),
        intercoolerMaterial
      )
      intercooler.position.set(1.5, 1.5, 1.5)
      intercooler.castShadow = true
      machineGroup.add(intercooler)

      for (let i = 0; i < 15; i++) {
        const fin = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 0.7, 0.35),
          new THREE.MeshStandardMaterial({ color: 0x7f8c8d, metalness: 0.6, roughness: 0.5 })
        )
        fin.position.set(1.5 - 0.55 + i * 0.075, 1.5, 1.5)
        machineGroup.add(fin)
      }

      const intakeMaterial = new THREE.MeshStandardMaterial({
        color: 0xe74c3c,
        metalness: 0.8,
        roughness: 0.3,
      })

      const intakeManifold = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.5, 1.8),
        intakeMaterial
      )
      intakeManifold.position.set(0, 3.4, 0)
      intakeManifold.castShadow = true
      machineGroup.add(intakeManifold)

      const throttleBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.4, 32),
        chromeMaterial
      )
      throttleBody.position.set(0.5, 3.8, 0)
      machineGroup.add(throttleBody)

      const exhaustMaterial = new THREE.MeshStandardMaterial({
        color: 0xd35400,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0x5d2800,
        emissiveIntensity: 0.2,
      })

      for (let i = 0; i < 4; i++) {
        const leftExhaust = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16),
          exhaustMaterial
        )
        leftExhaust.position.set(-1.2 + i * 0.6, 2.2, -1)
        leftExhaust.rotation.x = Math.PI / 4
        machineGroup.add(leftExhaust)

        const rightExhaust = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16),
          exhaustMaterial
        )
        rightExhaust.position.set(-1.2 + i * 0.6, 2.2, 1)
        rightExhaust.rotation.x = -Math.PI / 4
        machineGroup.add(rightExhaust)
      }

      const oilPanMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.7,
        roughness: 0.4,
      })

      const oilPan = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.5, 2.3),
        oilPanMaterial
      )
      oilPan.position.y = 0.25
      oilPan.castShadow = true
      machineGroup.add(oilPan)

      const oilFilter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.4, 32),
        new THREE.MeshStandardMaterial({ color: 0xf39c12, metalness: 0.6, roughness: 0.4 })
      )
      oilFilter.position.set(-1.5, 1, -0.8)
      machineGroup.add(oilFilter)

      const alternatorMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        metalness: 0.8,
        roughness: 0.3,
      })

      const alternator = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.6, 32),
        alternatorMaterial
      )
      alternator.rotation.z = Math.PI / 2
      alternator.position.set(1.3, 1.2, -1)
      machineGroup.add(alternator)

      const pulleyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.5,
        roughness: 0.6,
      })

      const crankPulley = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32),
        pulleyMaterial
      )
      crankPulley.rotation.z = Math.PI / 2
      crankPulley.position.set(-1.6, 1.5, 0)
      machineGroup.add(crankPulley)

      const wireMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.2,
        roughness: 0.8,
      })

      for (let i = 0; i < 3; i++) {
        const wire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8),
          wireMaterial
        )
        wire.position.set(0.8 - i * 0.3, 3.2, -0.5)
        machineGroup.add(wire)
      }

    } else if (machineType === "cnc-lathe" || machineName.includes("Torno") || machineName.includes("CNC")) {
      console.log("[v0] Rendering CNC Lathe")
      
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 1.5,
      })

      const base = new THREE.Mesh(new THREE.BoxGeometry(7, 0.5, 2.5), baseMaterial)
      base.position.y = 0.25
      base.castShadow = true
      base.receiveShadow = true
      machineGroup.add(base)

      const bedMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        metalness: 0.85,
        roughness: 0.15,
        envMapIntensity: 2,
      })

      const bedGeometry = new THREE.BoxGeometry(6, 0.35, 1)
      const bed = new THREE.Mesh(bedGeometry, bedMaterial)
      bed.position.set(0, 0.675, 0)
      bed.castShadow = true
      machineGroup.add(bed)

      const headstockGeometry = new THREE.BoxGeometry(1.2, 1.8, 1.8)
      const headstock = new THREE.Mesh(headstockGeometry, baseMaterial)
      headstock.position.set(-3, 1.4, 0)
      headstock.castShadow = true
      machineGroup.add(headstock)

      const spindleHole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.5, 32),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.1 })
      )
      spindleHole.rotation.z = Math.PI / 2
      spindleHole.position.set(-3.25, 1.4, 0)
      machineGroup.add(spindleHole)

      const chuckMaterial = new THREE.MeshStandardMaterial({
        color: 0x95a5a6,
        metalness: 0.95,
        roughness: 0.1,
        envMapIntensity: 2,
      })

      const chuck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.3, 64),
        chuckMaterial
      )
      chuck.rotation.z = Math.PI / 2
      chuck.position.set(-3.5, 1.4, 0)
      chuck.castShadow = true
      machineGroup.add(chuck)

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2
        const jaw = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.4, 0.08),
          chuckMaterial
        )
        jaw.position.set(
          -3.5,
          1.4 + Math.cos(angle) * 0.35,
          Math.sin(angle) * 0.35
        )
        machineGroup.add(jaw)
      }

      const turretMaterial = new THREE.MeshStandardMaterial({
        color: 0x7f8c8d,
        metalness: 0.8,
        roughness: 0.25,
      })

      const turretBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.5, 0.6, 12),
        turretMaterial
      )
      turretBody.position.set(0.5, 1.5, 0)
      turretBody.castShadow = true
      machineGroup.add(turretBody)

      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        const toolHolder = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.3, 0.1),
          new THREE.MeshStandardMaterial({ color: 0x2c3e50, metalness: 0.7, roughness: 0.3 })
        )
        toolHolder.position.set(
          0.5 + Math.cos(angle) * 0.4,
          1.5,
          Math.sin(angle) * 0.4
        )
        toolHolder.rotation.y = -angle
        machineGroup.add(toolHolder)
      }

      const tailstockGeometry = new THREE.BoxGeometry(0.9, 1, 1.2)
      const tailstock = new THREE.Mesh(tailstockGeometry, baseMaterial)
      tailstock.position.set(2.5, 1, 0)
      tailstock.castShadow = true
      machineGroup.add(tailstock)

      const quill = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.8, 32),
        chuckMaterial
      )
      quill.rotation.z = Math.PI / 2
      quill.position.set(2.9, 1, 0)
      machineGroup.add(quill)

      const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.3,
        roughness: 0.7,
      })

      const panelHousing = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 2, 0.3),
        panelMaterial
      )
      panelHousing.position.set(3.5, 1.5, -1)
      panelHousing.rotation.y = Math.PI / 8
      panelHousing.castShadow = true
      machineGroup.add(panelHousing)

      const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e3a5f,
        emissive: 0x2e5c8a,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.1,
      })

      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.7, 0.05),
        screenMaterial
      )
      screen.position.set(3.56, 1.8, -1)
      screen.rotation.y = Math.PI / 8
      machineGroup.add(screen)

      for (let i = 0; i < 3; i++) {
        const button = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16),
          new THREE.MeshStandardMaterial({ color: 0xe74c3c, metalness: 0.6, roughness: 0.4, emissive: 0xe74c3c, emissiveIntensity: 0.3 })
        )
        button.rotation.z = Math.PI / 2
        button.position.set(3.57, 1.2 + i * 0.15, -1)
        machineGroup.add(button)
      }

      const guardMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        transparent: true,
        opacity: 0.3,
      })

      const guard = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2, 2.2),
        guardMaterial
      )
      guard.position.set(-0.5, 1.5, 0)
      machineGroup.add(guard)

    } else if (machineType === "milling-machine" || machineType.includes("milling") || machineName.includes("Fresa")) {
      console.log("[v0] Rendering Milling Machine")
      
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x2874a6,
        metalness: 0.85,
        roughness: 0.2,
        envMapIntensity: 1.8,
      })

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(5, 0.6, 4),
        baseMaterial
      )
      base.position.y = 0.3
      base.castShadow = true
      base.receiveShadow = true
      machineGroup.add(base)

      const tableMaterial = new THREE.MeshStandardMaterial({
        color: 0x7f8c8d,
        metalness: 0.9,
        roughness: 0.15,
        envMapIntensity: 2,
      })

      const table = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.35, 2.5),
        tableMaterial
      )
      table.position.y = 0.775
      table.castShadow = true
      machineGroup.add(table)

      for (let i = -1; i <= 1; i++) {
        const slot = new THREE.Mesh(
          new THREE.BoxGeometry(3.4, 0.05, 0.15),
          new THREE.MeshStandardMaterial({ color: 0x34495e, metalness: 0.8, roughness: 0.3 })
        )
        slot.position.set(0, 0.95, i * 0.6)
        machineGroup.add(slot)
      }

      const columnGeometry = new THREE.BoxGeometry(1, 4, 2)
      const column = new THREE.Mesh(columnGeometry, baseMaterial)
      column.position.set(0, 2.8, -0.75)
      column.castShadow = true
      machineGroup.add(column)

      const saddleGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.5)
      const saddle = new THREE.Mesh(saddleGeometry, baseMaterial)
      saddle.position.set(0, 4, 0)
      saddle.castShadow = true
      machineGroup.add(saddle)

      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        metalness: 0.8,
        roughness: 0.25,
      })

      const spindleHead = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        headMaterial
      )
      spindleHead.position.set(0, 4.4, 0.5)
      spindleHead.castShadow = true
      machineGroup.add(spindleHead)

      const spindleMaterial = new THREE.MeshStandardMaterial({
        color: 0xecf0f1,
        metalness: 0.95,
        roughness: 0.05,
        envMapIntensity: 2.5,
      })

      const spindle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 2, 32),
        spindleMaterial
      )
      spindle.position.set(0, 3, 0.5)
      spindle.castShadow = true
      machineGroup.add(spindle)

      const colletMaterial = new THREE.MeshStandardMaterial({
        color: 0xbdc3c7,
        metalness: 0.9,
        roughness: 0.15,
      })

      const collet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.12, 0.4, 32),
        colletMaterial
      )
      collet.position.set(0, 1.7, 0.5)
      machineGroup.add(collet)

      const toolMaterial = new THREE.MeshStandardMaterial({
        color: 0xf39c12,
        metalness: 0.85,
        roughness: 0.15,
      })

      const tool = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.04, 0.8, 16),
        toolMaterial
      )
      tool.position.set(0, 1.2, 0.5)
      machineGroup.add(tool)

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI * 2) / 4
        const flute = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 0.6, 0.02),
          new THREE.MeshStandardMaterial({ color: 0xd68910, metalness: 0.8, roughness: 0.2 })
        )
        flute.position.set(
          Math.cos(angle) * 0.05,
          1.2,
          0.5 + Math.sin(angle) * 0.05
        )
        machineGroup.add(flute)
      }

      const coverMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.4,
        roughness: 0.6,
      })

      for (let i = 0; i < 5; i++) {
        const cover = new THREE.Mesh(
          new THREE.BoxGeometry(3.5, 0.1, 0.3),
          coverMaterial
        )
        cover.position.set(0, 0.65 + i * 0.05, 1.5 - i * 0.1)
        machineGroup.add(cover)
      }

      const pendantMaterial = new THREE.MeshStandardMaterial({
        color: 0x95a5a6,
        metalness: 0.5,
        roughness: 0.5,
      })

      const pendant = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.5, 0.15),
        pendantMaterial
      )
      pendant.position.set(2, 1.5, 1.5)
      pendant.rotation.x = -0.3
      machineGroup.add(pendant)

    } else if (machineType === "hydraulic-press" || machineType.includes("press") || machineName.includes("Prensa")) {
      console.log("[v0] Rendering Hydraulic Press")
      
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x27ae60,
        metalness: 0.8,
        roughness: 0.25,
        envMapIntensity: 1.6,
      })

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1, 3.5),
        baseMaterial
      )
      base.position.y = 0.5
      base.castShadow = true
      base.receiveShadow = true
      machineGroup.add(base)

      const columnMaterial = new THREE.MeshStandardMaterial({
        color: 0x229954,
        metalness: 0.85,
        roughness: 0.2,
      })

      const columnPositions = [
        [-1.5, 3, -1.3],
        [1.5, 3, -1.3],
        [-1.5, 3, 1.3],
        [1.5, 3, 1.3],
      ]

      columnPositions.forEach((pos) => {
        const column = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.25, 5, 32),
          columnMaterial
        )
        column.position.set(pos[0], pos[1], pos[2])
        column.castShadow = true
        machineGroup.add(column)
      })

      const crosshead = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.8, 3.5),
        baseMaterial
      )
      crosshead.position.y = 5.6
      crosshead.castShadow = true
      machineGroup.add(crosshead)

      const cylinderMaterial = new THREE.MeshStandardMaterial({
        color: 0xf39c12,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 2,
      })

      const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 2.5, 32),
        cylinderMaterial
      )
      cylinder.position.set(0, 4.5, 0)
      cylinder.castShadow = true
      machineGroup.add(cylinder)

      const rodMaterial = new THREE.MeshStandardMaterial({
        color: 0xbdc3c7,
        metalness: 0.95,
        roughness: 0.05,
      })

      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 2, 32),
        rodMaterial
      )
      rod.position.set(0, 2.25, 0)
      machineGroup.add(rod)

      const ramMaterial = new THREE.MeshStandardMaterial({
        color: 0x7f8c8d,
        metalness: 0.85,
        roughness: 0.2,
      })

      const ram = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.6, 2.5),
        ramMaterial
      )
      ram.position.y = 1
      ram.castShadow = true
      machineGroup.add(ram)

      const gaugeMaterial = new THREE.MeshStandardMaterial({
        color: 0xecf0f1,
        metalness: 0.3,
        roughness: 0.7,
      })

      const gauge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32),
        gaugeMaterial
      )
      gauge.rotation.x = Math.PI / 2
      gauge.position.set(1.5, 5.6, 0)
      machineGroup.add(gauge)

      const gaugeFace = new THREE.Mesh(
        new THREE.CircleGeometry(0.18, 32),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x3498db, emissiveIntensity: 0.2 })
      )
      gaugeFace.rotation.x = Math.PI / 2
      gaugeFace.position.set(1.5, 5.65, 0)
      machineGroup.add(gaugeFace)

      const hoseMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495e,
        metalness: 0.3,
        roughness: 0.8,
      })

      for (let i = 0; i < 2; i++) {
        const hose = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 3, 16),
          hoseMaterial
        )
        hose.position.set(-1.8 + i * 0.3, 4, -1.3)
        machineGroup.add(hose)
      }

    } else {
      console.log("[v0] Rendering Generic Machine:", machineType)
      
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x5d6d7e,
        metalness: 0.8,
        roughness: 0.25,
        envMapIntensity: 1.5,
      })

      const enclosure = new THREE.Mesh(
        new THREE.BoxGeometry(6, 5, 4.5),
        baseMaterial
      )
      enclosure.position.y = 2.5
      enclosure.castShadow = true
      enclosure.receiveShadow = true
      machineGroup.add(enclosure)

      const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x87ceeb,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95,
        thickness: 0.5,
        transparent: true,
        opacity: 0.4,
        ior: 1.5,
      })

      const mainWindow = new THREE.Mesh(
        new THREE.BoxGeometry(4, 3.5, 0.15),
        windowMaterial
      )
      mainWindow.position.set(0, 2.5, 2.28)
      machineGroup.add(mainWindow)

      const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.6,
        roughness: 0.4,
      })

      const frameTop = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 0.15, 0.2),
        frameMaterial
      )
      frameTop.position.set(0, 4.28, 2.3)
      machineGroup.add(frameTop)

      const door = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 4, 0.2),
        baseMaterial
      )
      door.position.set(3, 2.5, 0)
      door.castShadow = true
      machineGroup.add(door)

      const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0xe74c3c,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0xe74c3c,
        emissiveIntensity: 0.2,
      })

      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16),
        handleMaterial
      )
      handle.rotation.z = Math.PI / 2
      handle.position.set(2, 2.5, 2.3)
      machineGroup.add(handle)

      const controlPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 3.5, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x34495e, metalness: 0.5, roughness: 0.5 })
      )
      controlPanel.position.set(4, 2.5, 0)
      controlPanel.castShadow = true
      machineGroup.add(controlPanel)

      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1.2, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x1e3a5f, emissive: 0x3498db, emissiveIntensity: 0.9, roughness: 0.1, metalness: 0.1 })
      )
      screen.position.set(4.61, 3.2, 0)
      machineGroup.add(screen)

      const keyboard = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.1, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x7f8c8d, metalness: 0.4, roughness: 0.6 })
      )
      keyboard.position.set(4.6, 1.5, 0.2)
      keyboard.rotation.x = -0.3
      machineGroup.add(keyboard)

      const eStop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 0.08, 32),
        new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.6, roughness: 0.4, emissive: 0xff0000, emissiveIntensity: 0.5 })
      )
      eStop.rotation.x = Math.PI / 2
      eStop.position.set(4.65, 2, -0.4)
      machineGroup.add(eStop)

      const lightColors = [0x00ff00, 0xffff00, 0xff0000]
      lightColors.forEach((color, i) => {
        const light = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16),
          new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.8, metalness: 0.5, roughness: 0.3 })
        )
        light.rotation.x = Math.PI / 2
        light.position.set(4.65, 4.5, -0.3 + i * 0.15)
        machineGroup.add(light)
      })

      const nozzleMaterial = new THREE.MeshStandardMaterial({
        color: 0x95a5a6,
        metalness: 0.8,
        roughness: 0.2,
      })

      const nozzle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.03, 0.4, 16),
        nozzleMaterial
      )
      nozzle.position.set(-1.5, 3, 2)
      nozzle.rotation.z = Math.PI / 4
      machineGroup.add(nozzle)
    }

    const spotLight = new THREE.SpotLight(0xffffff, 1)
    spotLight.position.set(0, 8, 5)
    spotLight.target.position.set(0, 0, 0)
    spotLight.angle = Math.PI / 6
    spotLight.penumbra = 0.5
    spotLight.castShadow = true
    scene.add(spotLight)
    scene.add(spotLight.target)

    const machineLight = new THREE.PointLight(0x4a90e2, 0.6, 15)
    machineLight.position.set(0, 3, 3)
    machineGroup.add(machineLight)

    machineGroup.position.y = -0.5
    scene.add(machineGroup)

    const groundGeometry = new THREE.CircleGeometry(15, 64)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0xe2e8f0 : 0x0a0f1a,
      roughness: 0.6,
      metalness: 0.3,
      envMapIntensity: 0.5,
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.5
    ground.receiveShadow = true
    scene.add(ground)

    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x444444)
    gridHelper.position.y = -0.49
    gridHelper.material.opacity = theme === "light" ? 0.2 : 0.1
    gridHelper.material.transparent = true
    scene.add(gridHelper)

    let mouseX = 0
    let mouseY = 0
    let targetRotationX = 0
    let targetRotationY = 0
    let isDragging = false

    const handleMouseDown = () => {
      isDragging = true
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging) {
        targetRotationY += event.movementX * 0.01
        targetRotationX += event.movementY * 0.005
        targetRotationX = Math.max(-0.5, Math.min(0.5, targetRotationX))
      }
    }

    let zoom = 1
    const minZoom = 0.5
    const maxZoom = 3

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const delta = event.deltaY * -0.001
      zoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta))
      
      const baseDistance = 15
      const targetDistance = baseDistance / zoom
      const currentDistance = camera.position.length()
      const direction = camera.position.clone().normalize()
      
      camera.position.lerp(direction.multiplyScalar(targetDistance), 0.1)
      camera.lookAt(0, 1, 0)
    }

    const currentContainer = containerRef.current
    if (currentContainer) {
      currentContainer.addEventListener("mousedown", handleMouseDown)
      currentContainer.addEventListener("mouseup", handleMouseUp)
      currentContainer.addEventListener("mouseleave", handleMouseUp)
      currentContainer.addEventListener("mousemove", handleMouseMove)
      currentContainer.addEventListener("wheel", handleWheel, { passive: false })
    }

    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      machineGroup.rotation.y += (targetRotationY - machineGroup.rotation.y) * 0.1
      machineGroup.rotation.x += (targetRotationX - machineGroup.rotation.x) * 0.1

      if (!isDragging) {
        targetRotationY += delta * 0.2
      }

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (currentContainer) {
        currentContainer.removeEventListener("mousedown", handleMouseDown)
        currentContainer.removeEventListener("mouseup", handleMouseUp)
        currentContainer.removeEventListener("mouseleave", handleMouseUp)
        currentContainer.removeEventListener("mousemove", handleMouseMove)
        currentContainer.removeEventListener("wheel", handleWheel)
      }
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [machineName, machineType, theme])

  return <div ref={containerRef} className="w-full h-full" />
}
