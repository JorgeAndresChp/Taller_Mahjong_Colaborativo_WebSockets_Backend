# 🀄 Mahjong Collaborative - WebSockets Multiplayer

Una aplicación de **Mahjong colaborativo en tiempo real** desarrollada con **React**, **TypeScript**, **WebSockets** y **Node.js**. Múltiples jugadores pueden jugar simultáneamente sincronizados en tiempo real.

## ✨ Características

- 🎮 **Juego Mahjong completo** con 144 fichas (72 pares)
- 🔀 **Tablero 3D** con posiciones tipo tortuga clásica
- 👥 **Multiplayer en tiempo real** vía WebSockets (Socket.io)
- 📊 **Gráfico de puntajes en vivo** con Recharts
- 🎯 **Sincronización instantánea** de fichas entre jugadores
- ⏱️ **Reglas Mahjong implementadas** (bloqueos, emparejamiento)
- 🎨 **UI moderna** con TailwindCSS y gradientes

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- Socket.io Client
- Recharts
- CSS in JS

**Backend:**
- Node.js
- Express 5
- Socket.io
- TypeScript
- Nodemon (desarrollo)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Puerto 3001 (servidor) y 5173 (cliente) disponibles

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/mahjong-coop.git
cd mahjong-coop
```

### 2. Instalar servidor
```bash
cd server
npm install
```

### 3. Instalar cliente
```bash
cd ../client
npm install
```

### 4. Ejecutar en desarrollo

**Terminal 1 - Servidor:**
```bash
cd server
npm run dev
```
El servidor escuchará en `http://localhost:3001`

**Terminal 2 - Cliente:**
```bash
cd client
npm run dev
```
El cliente abrirá en `http://localhost:5173`

## 🎮 Cómo Jugar

1. Abre el navegador en `http://localhost:5173`
2. Ingresa tu nombre y únete al juego
3. **Objetivo**: Encontrar parejas de fichas con el mismo símbolo
4. **Reglas Mahjong**:
   - Solo puedes seleccionar fichas que **no tengan fichas encima**
   - Solo puedes seleccionar fichas que tengan **al menos UN lado libre**
   - Selecciona dos fichas con el mismo símbolo para hacer match
   - Ganas 10 puntos por cada pareja encontrada

## 📁 Estructura del Proyecto

```
mahjong-coop/
├── server/                    # Backend Node.js
│   ├── src/
│   │   ├── index.ts          # Servidor Express + Socket.io
│   │   ├── socket.ts         # Eventos WebSocket
│   │   ├── game.ts           # Lógica del juego
│   │   └── types.ts          # Definiciones TypeScript
│   ├── package.json
│   └── tsconfig.json
│
├── client/                    # Frontend React + Vite
│   ├── src/
│   │   ├── App.tsx           # Componente principal
│   │   ├── types.ts          # Tipos compartidos
│   │   ├── components/
│   │   │   ├── Board.tsx     # Tablero 3D
│   │   │   ├── Tile.tsx      # Fichas interactivas
│   │   │   ├── Lobby.tsx     # Pantalla de bienvenida
│   │   │   ├── Scoreboard.tsx # Tabla de puntuaciones
│   │   │   └── LiveChart.tsx # Gráfico de puntajes
│   │   └── hooks/
│   │       └── useSockets.ts # Hook WebSocket
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🎯 Componentes Principales

| Componente | Función |
|-----------|---------|
| **Board** | Renderiza el tablero 3D con todas las fichas |
| **Tile** | Ficha individual con interactividad |
| **Scoreboard** | Muestra puntuaciones y estado de jugadores |
| **LiveChart** | Gráfico en tiempo real de evolución de puntajes |
| **Lobby** | Pantalla inicial para unirse al juego |

## 🔌 Eventos WebSocket

### Cliente → Servidor
- `player:join` - Jugador se une al juego
- `tile:select` - Jugador selecciona una ficha

### Servidor → Cliente
- `game:state` - Actualización del estado completo del juego

## 🧮 Lógica del Juego

### isSelectable()
Determina si una ficha puede ser seleccionada basado en:
- ❓ No está emparejada
- 🔴 No tiene fichas en capas superiores directamente encima
- 🔵 Tiene al menos UN lado libre (izquierda o derecha)

### selectTile()
Procesa la selección de fichas:
1. **Primer click**: Bloquea la ficha
2. **Segundo click**: 
   - Si coinciden los símbolos → **Match** (+10 puntos)
   - Si no coinciden → Las fichas se voltean después de 1 segundo

## 📊 Scoring System

- ✅ **+10 puntos** por cada pareja encontrada
- 📈 Puntajes guardados en `scoreHistory`
- 🎁 El jugador con más puntos gana

## 🐛 Debugging

Si encuentras problemas:

1. **Puerto 3001 en uso**: 
   ```powershell
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

2. **Errores TypeScript**: Verifica que tienes Node.js 18+
   ```bash
   node --version
   ```

3. **WebSocket no conecta**: Asegúrate que el servidor está corriendo en puerto 3001

## 📝 Scripts Disponibles

**Servidor:**
- `npm run dev` - Inicia en modo desarrollo con nodemon
- `npm run build` - Compila TypeScript
- `npm start` - Ejecuta el código compilado

**Cliente:**
- `npm run dev` - Inicia servidor Vite
- `npm run build` - Optimiza para producción
- `npm run lint` - Ejecuta ESLint

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama con tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

## 👤 Autor

Desarrollado como proyecto colaborativo para taller WebSockets.

## 🙏 Agradecimientos

- Mahjong clásico por la inspiración
- Socket.io por la comunicación en tiempo real
- React y TypeScript por excelentes herramientas
- Recharts por los gráficos interactivos

---

**¿Preguntas?** Abre un issue en el repositorio 🎯
