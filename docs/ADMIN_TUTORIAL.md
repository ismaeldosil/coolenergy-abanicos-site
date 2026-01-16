# Tutorial del Panel de Administracion

Guia completa para usar el panel de administracion de Cool Energy Abanicos.

---

## 1. Acceder al Panel

### URL de Acceso

```
https://tu-sitio.com/admin-abanicos-abm
```

### Pantalla de Login

```mermaid
graph LR
    A[Navegar a /admin-abanicos-abm] --> B[Pantalla de Login]
    B --> C[Ingresar Password]
    C --> D{Correcto?}
    D -->|Si| E[Panel Admin]
    D -->|No| F[Error - Reintentar]
    F --> C
```

**Password actual:** `#Ab4n1co5-2024!`

> **Nota:** Despues de 5 intentos fallidos, deberas esperar 15 minutos.

---

## 2. Dashboard Principal

Una vez logueado, veras el dashboard con las siguientes secciones:

```mermaid
graph TB
    subgraph "Panel de Administracion"
        A[Analytics]
        B[Estadisticas]
        C[Subir Imagenes]
        D[Galeria]
    end

    A --> A1[Visitas Hoy]
    A --> A2[Sesiones Unicas]

    B --> B1[Total Imagenes]
    B --> B2[Por Categoria]

    C --> C1[Seleccionar Categoria]
    C --> C2[Subir Archivo]

    D --> D1[Ver Imagenes]
    D --> D2[Filtrar]
    D --> D3[Eliminar]
```

### Seccion Analytics

Muestra metricas basicas del sitio:

| Metrica | Descripcion |
|---------|-------------|
| Visitas hoy | Total de pageviews del dia |
| Sesiones unicas | Visitantes unicos |

### Seccion Estadisticas

Muestra cantidad de imagenes:

| Stat | Descripcion |
|------|-------------|
| Total | Todas las imagenes |
| RAVE XL | Imagenes en categoria RAVE XL |
| RAVE L | Imagenes en categoria RAVE L |
| MEDIUM | Imagenes en categoria MEDIUM |

---

## 3. Subir Nueva Imagen

### Flujo Completo

```mermaid
flowchart TD
    A[Inicio] --> B[1. Seleccionar Categoria]
    B --> C{Categoria seleccionada?}
    C -->|No| B
    C -->|Si| D[Area de upload habilitada]
    D --> E[2. Click en area de upload]
    E --> F[Selector de archivos]
    F --> G[3. Elegir imagen]
    G --> H{Formato valido?}
    H -->|No| I[Error: formato invalido]
    I --> F
    H -->|Si| J{Tamanio < 10MB?}
    J -->|No| K[Error: muy grande]
    K --> F
    J -->|Si| L[4. Preview de imagen]
    L --> M{Imagen correcta?}
    M -->|No| N[Click X para quitar]
    N --> E
    M -->|Si| O[5. Click Subir a Cloudinary]
    O --> P[Barra de progreso]
    P --> Q[Upload completado]
    Q --> R[Galeria actualizada]
    R --> S[Fin]
```

### Paso 1: Seleccionar Categoria

```
+------------------+  +------------------+
|    RAVE XL       |  |    RAVE L        |
|    66cm          |  |    50cm          |
+------------------+  +------------------+

+------------------+  +------------------+
|    MEDIUM        |  |  PERSONALIZADOS  |
|    40cm          |  |    A pedido      |
+------------------+  +------------------+
```

- Click en la categoria deseada
- La categoria se resaltara con borde magenta
- El area de upload se habilitara

### Paso 2: Seleccionar Imagen

```
+----------------------------------------+
|                                        |
|     [Icono de Upload]                  |
|                                        |
|   Click para seleccionar imagen        |
|   (RAVE XL)                            |
|                                        |
|   JPG, PNG, WEBP - Max 10MB            |
|                                        |
+----------------------------------------+
```

Opciones:
- **Click** en el area para abrir selector de archivos
- **Arrastrar** imagen directamente al area

### Paso 3: Verificar Preview

```
+----------------------------------------+
|  +-----------------------------+  [X]  |
|  |                             |       |
|  |    [Preview de imagen]     |       |
|  |                             |       |
|  +-----------------------------+       |
|  imagen-seleccionada.jpg               |
+----------------------------------------+
```

- La imagen aparece como preview
- El nombre del archivo se muestra debajo
- Boton X para quitar y seleccionar otra

### Paso 4: Subir a Cloudinary

```
+----------------------------------------+
|  [===========================    ] 75% |
|           Subiendo... 75%              |
+----------------------------------------+
```

- Click en "Subir a Cloudinary"
- La barra de progreso muestra el avance
- Esperar hasta que llegue al 100%

### Paso 5: Confirmacion

```
+----------------------------------------+
|  [check] Imagen subida correctamente!  |
+----------------------------------------+
```

- Mensaje de exito aparece
- La galeria se actualiza automaticamente
- Los stats se actualizan

---

## 4. Gestionar Galeria

### Filtrar por Categoria

```mermaid
graph LR
    A[Todas las categorias] --> B[Dropdown]
    B --> C[RAVE XL]
    B --> D[RAVE L]
    B --> E[MEDIUM]
    B --> F[Personalizados]
```

Usar el selector para ver solo imagenes de una categoria.

### Eliminar Imagen

```mermaid
sequenceDiagram
    participant U as Usuario
    participant G as Galeria
    participant S as Server
    participant C as Cloudinary

    U->>G: Hover sobre imagen
    G->>G: Mostrar boton X
    U->>G: Click en X
    G->>U: Confirmar eliminacion?
    U->>G: Confirmar
    G->>G: Animacion de salida
    G->>S: DELETE /api/images/:id
    S->>C: Eliminar de Cloudinary
    C->>S: OK
    S->>G: Exito
    G->>G: Actualizar stats
```

**Pasos:**

1. Pasar el mouse sobre la imagen
2. Aparece boton X rojo en la esquina
3. Click en el boton X
4. Confirmar en el dialogo
5. La imagen desaparece con animacion

---

## 5. Cerrar Sesion

Click en el boton "Salir" en la esquina superior derecha.

```mermaid
graph LR
    A[Click Salir] --> B[Token eliminado]
    B --> C[Redirigir a Login]
```

La sesion expira automaticamente despues de 24 horas.

---

## 6. Tips y Mejores Practicas

### Optimizacion de Imagenes

| Recomendacion | Detalle |
|---------------|---------|
| Formato | Preferir WEBP o JPG |
| Resolucion | 1200x1200 px maximo |
| Tamanio | Menos de 2MB ideal |
| Aspecto | Cuadrado funciona mejor |

### Organizacion

- Subir imagenes a la categoria correcta
- Eliminar imagenes duplicadas
- Mantener galeria actualizada

### Seguridad

- No compartir la contrasena
- Cerrar sesion al terminar
- Usar desde conexion segura

---

## 7. Solucion de Problemas

### Imagen no sube

```mermaid
graph TD
    A[Imagen no sube] --> B{Formato correcto?}
    B -->|No| C[Usar JPG/PNG/WEBP]
    B -->|Si| D{Tamanio < 10MB?}
    D -->|No| E[Reducir tamanio]
    D -->|Si| F{Conexion estable?}
    F -->|No| G[Reintentar]
    F -->|Si| H[Contactar soporte]
```

### No puedo hacer login

1. Verificar que la contrasena es correcta
2. Esperar 15 minutos si hubo muchos intentos
3. Verificar URL correcta (`/admin-abanicos-abm`)

### Galeria no actualiza

1. Refrescar la pagina (F5)
2. Verificar conexion a internet
3. Intentar cerrar y abrir sesion

---

## 8. Resumen Visual

```mermaid
journey
    title Un dia usando el Admin Panel
    section Login
      Ir a /admin-abanicos-abm: 5: Admin
      Ingresar password: 5: Admin
    section Revisar
      Ver analytics: 3: Admin
      Ver stats: 3: Admin
    section Subir
      Seleccionar categoria: 5: Admin
      Elegir imagen: 5: Admin
      Verificar preview: 4: Admin
      Subir a Cloudinary: 5: Admin
    section Gestionar
      Filtrar galeria: 3: Admin
      Eliminar imagen vieja: 4: Admin
    section Salir
      Cerrar sesion: 5: Admin
```

---

*Tutorial creado para Cool Energy Abanicos - Enero 2026*
