import bpy
import bmesh
from mathutils import Vector
import math

# Limpiar escena inicial
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# -----------------------------------------------
# 1. CONFIGURACIÓN DE ANIMACIÓN
# -----------------------------------------------
frames_per_second = 24
duracion_total = 10  # segundos
total_frames = frames_per_second * duracion_total

# Configurar timeline
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = total_frames
bpy.context.scene.render.fps = frames_per_second

# -----------------------------------------------
# 2. CREAR ESTRUCTURA DE LA MÁQUINA
# -----------------------------------------------
def crear_maquina():
    # Base principal
    bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0.1))
    base = bpy.context.object
    base.scale = (3, 1.5, 0.1)
    base.name = "Base_Maquina"
    base.data.materials.append(crear_material("Gris", (0.3, 0.3, 0.3, 1)))
    
    # Paredes laterales
    bpy.ops.mesh.primitive_cube_add(size=2, location=(-2.7, 0, 1))
    pared_izq = bpy.context.object
    pared_izq.scale = (0.1, 1.5, 1)
    pared_izq.name = "Pared_Izquierda"
    
    bpy.ops.mesh.primitive_cube_add(size=2, location=(2.7, 0, 1))
    pared_der = bpy.context.object
    pared_der.scale = (0.1, 1.5, 1)
    pared_der.name = "Pared_Derecha"

# -----------------------------------------------
# 3. CREAR ROLLO DE PAPEL CON ANIMACIÓN
# -----------------------------------------------
def crear_rollo_papel():
    # Eje del rollo
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.1, depth=1.2, location=(-2, 0, 1.5))
    eje = bpy.context.object
    eje.name = "Eje_Rollo"
    eje.data.materials.append(crear_material("Metal", (0.7, 0.7, 0.8, 1)))
    
    # Papel enrollado
    bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=0.8, depth=1.0, location=(-2, 0, 1.5))
    rollo = bpy.context.object
    rollo.name = "Rollo_Papel"
    rollo.data.materials.append(crear_material("Papel", (0.95, 0.95, 0.9, 1)))
    
    # Extremo del papel (inicialmente enrollado)
    bpy.ops.mesh.primitive_plane_add(size=0.5, location=(-1.2, 0, 1.5))
    papel = bpy.context.object
    papel.name = "Papel_Extremo"
    papel.rotation_euler = (0, 0, math.radians(90))
    papel.data.materials.append(crear_material("Papel_Amarillo", (1, 1, 0.7, 1)))
    
    return papel, rollo

# -----------------------------------------------
# 4. CREAR MECANISMOS DE TRACCIÓN, DOBLADO Y CORTE
# -----------------------------------------------
def crear_mecanismos():
    # Rodillos de tracción
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.2, depth=1.0, location=(0, 0, 0.8))
    rodillo_inf = bpy.context.object
    rodillo_inf.name = "Rodillo_Inferior"
    
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.2, depth=1.0, location=(0, 0, 1.2))
    rodillo_sup = bpy.context.object
    rodillo_sup.name = "Rodillo_Superior"
    rodillo_sup.data.materials.append(crear_material("Goma", (0.2, 0.2, 0.2, 1)))
    
    # Mecanismo de doblado
    bpy.ops.mesh.primitive_cube_add(size=0.3, location=(1.5, 0, 0.9))
    placa_doblado = bpy.context.object
    placa_doblado.scale = (0.1, 1.3, 0.8)
    placa_doblado.name = "Placa_Doblado"
    placa_doblado.data.materials.append(crear_material("Azul", (0.2, 0.4, 0.8, 1)))
    
    # Paleta de doblado
    bpy.ops.mesh.primitive_cube_add(size=0.3, location=(1.2, 0, 0.9))
    paleta = bpy.context.object
    paleta.scale = (0.5, 1.0, 0.1)
    paleta.name = "Paleta_Doblado"
    paleta.data.materials.append(crear_material("Rojo", (0.8, 0.2, 0.2, 1)))
    
    # Cuchilla de corte
    bpy.ops.mesh.primitive_cube_add(size=0.1, location=(1.6, 0, 0.7))
    cuchilla = bpy.context.object
    cuchilla.scale = (0.05, 1.4, 0.3)
    cuchilla.name = "Cuchilla_Corte"
    cuchilla.data.materials.append(crear_material("Plateado", (0.9, 0.9, 0.9, 1)))
    
    return paleta, cuchilla, rodillo_inf

# -----------------------------------------------
# 5. MATERIALES
# -----------------------------------------------
def crear_material(nombre, color):
    material = bpy.data.materials.new(name=nombre)
    material.use_nodes = True
    bsdf = material.node_tree.nodes["Principled BSDF"]
    bsdf.inputs[0].default_value = color  # Base Color
    bsdf.inputs[4].default_value = 0.5    # Metallic
    bsdf.inputs[7].default_value = 0.2    # Roughness
    return material

# -----------------------------------------------
# 6. ANIMACIÓN COMPLETA
# -----------------------------------------------
def animar_maquina(papel, paleta, cuchilla, rodillo):
    # Frame 1-30: Papel sale del rollo hacia rodillos
    papel.location = (-1.2, 0, 1.5)
    papel.keyframe_insert(data_path="location", frame=1)
    
    papel.location = (-0.5, 0, 1.0)
    papel.keyframe_insert(data_path="location", frame=30)
    
    # Frame 30-60: Papel pasa por rodillos
    papel.location = (0.5, 0, 0.9)
    papel.keyframe_insert(data_path="location", frame=60)
    
    # Frame 60-90: Papel avanza a estación de doblado
    papel.location = (1.0, 0, 0.9)
    papel.keyframe_insert(data_path="location", frame=90)
    
    # Frame 90-105: PALETA DOBLA EL PAPEL
    paleta.location = (1.2, 0, 0.9)
    paleta.keyframe_insert(data_path="location", frame=90)
    
    paleta.location = (1.4, 0, 0.9)
    paleta.rotation_euler = (0, 0, math.radians(45))
    paleta.keyframe_insert(data_path="location", frame=105)
    paleta.keyframe_insert(data_path="rotation_euler", frame=105)
    
    # El papel se dobla con la paleta
    papel.location = (1.3, 0, 0.7)
    papel.rotation_euler = (math.radians(90), 0, 0)
    papel.keyframe_insert(data_path="location", frame=105)
    papel.keyframe_insert(data_path="rotation_euler", frame=105)
    
    # Frame 105-120: CORTE DEL PAPEL
    cuchilla.location = (1.6, 0, 0.7)
    cuchilla.keyframe_insert(data_path="location", frame=105)
    
    cuchilla.location = (1.6, 0, 0.9)
    cuchilla.keyframe_insert(data_path="location", frame=120)
    
    # Frame 120-150: Papel doblado cae y nuevo ciclo comienza
    papel.location = (1.3, 0, 0.2)
    papel.keyframe_insert(data_path="location", frame=150)
    
    # Rotación de rodillos durante todo el proceso
    rodillo.rotation_euler = (0, 0, 0)
    rodillo.keyframe_insert(data_path="rotation_euler", frame=1)
    
    rodillo.rotation_euler = (0, 0, math.radians(360*3))
    rodillo.keyframe_insert(data_path="rotation_euler", frame=150)

# -----------------------------------------------
# 7. CONFIGURAR CÁMARA Y ILUMINACIÓN
# -----------------------------------------------
def configurar_escena():
    # Cámara
    bpy.ops.object.camera_add(location=(5, -5, 3))
    camara = bpy.context.object
    camara.rotation_euler = (math.radians(60), 0, math.radians(45))
    bpy.context.scene.camera = camara
    
    # Iluminación
    bpy.ops.object.light_add(type='SUN', location=(5, -5, 10))
    luz = bpy.context.object
    luz.data.energy = 5

# -----------------------------------------------
# 8. EJECUCIÓN PRINCIPAL
# -----------------------------------------------
def main():
    # Configurar escena
    configurar_escena()
    
    # Construir máquina
    crear_maquina()
    papel, rollo = crear_rollo_papel()
    paleta, cuchilla, rodillo = crear_mecanismos()
    
    # Crear animación
    animar_maquina(papel, paleta, cuchilla, rodillo)
    
    print("¡Animación creada exitosamente!")
    print("Presiona Space para reproducir la animación")
    print("Para renderizar: F12")

# Ejecutar
if __name__ == "__main__":
    main()