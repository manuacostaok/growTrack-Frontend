# GrowTrack Pro — Frontend

React + Vite + Tailwind + React Query, conectado a la API real (`../backend`). Reemplaza al prototipo estático: Login/registro con JWT, Dashboard, Cultivos y Seguimiento diario funcionan contra la base de datos.

## Puesta en marcha

```bash
cd frontend
cp .env.example .env      # VITE_API_URL debe apuntar a tu backend
npm install
npm run dev                 # http://localhost:5173
```

Necesitás el backend (`../backend`) corriendo en paralelo — sin él, el login y las páginas de datos no van a funcionar. `CLIENT_URL` en el `.env` del backend debe ser `http://localhost:5173` para que las cookies de refresh funcionen.

## Qué falta

- Persistir el access token en memoria del `AuthContext` está bien para desarrollo; en producción conviene revisar la estrategia de refresh silencioso en el primer render.
- Páginas de Calendario, Galería, Estadísticas, IA y Admin (ver `growtrack-pro-arquitectura.md` para lo que falta en el backend antes de construirlas).
- Animaciones con Framer Motion (ya está en las dependencias, todavía no se usó) para transiciones de página y micro-interacciones.
- Manejo de subida de fotos (Multer + Cloudinary en el backend, `<input type="file">` + preview acá).
