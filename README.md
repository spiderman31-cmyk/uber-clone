# 🚗 Uber Clone - App de Transporte

Una aplicación tipo Uber construida con **Node.js + Express** y **Supabase**, completamente gratuita y lista para producción.

## 🎯 Características

✅ **Autenticación segura** - Login/Registro con Supabase Auth
✅ **Geolocalización en tiempo real** - Socket.io para ubicación de conductores
✅ **Búsqueda de conductores** - Encuentra conductores cercanos
✅ **Sistema de viajes** - Solicita, acepta y completa viajes
✅ **Calificaciones y reseñas** - Sistema de ratings
✅ **Historial de viajes** - Guarda todos los viajes
✅ **100% Gratuito** - Sin costos iniciales

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js + Express** - Servidor web
- **Supabase** - Base de datos PostgreSQL + Autenticación
- **Socket.io** - Comunicación en tiempo real
- **JWT** - Autenticación segura

### Frontend (Próximamente)
- React Native o Flutter
- Google Maps API

### Hosting Gratuito
- Render, Railway o Vercel - Backend
- Netlify - Frontend

---

## 📋 Prerequisitos

- Node.js v14+ instalado
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Git

---

## 🚀 Instalación Rápida

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/spiderman31-cmyk/uber-clone.git
cd uber-clone
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=3000
JWT_SECRET=tu-secreto-seguro
```

### 4️⃣ Crear tablas en Supabase

Abre la consola SQL de Supabase y ejecuta:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_type VARCHAR(20) CHECK (user_type IN ('passenger', 'driver')),
  profile_image VARCHAR(500),
  rating DECIMAL(3,2) DEFAULT 5.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de conductores
CREATE TABLE drivers (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT false,
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(11,8),
  vehicle_type VARCHAR(50),
  license_plate VARCHAR(20),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de viajes
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id UUID NOT NULL REFERENCES users(id),
  driver_id UUID REFERENCES users(id),
  pickup_lat DECIMAL(10,8) NOT NULL,
  pickup_lng DECIMAL(11,8) NOT NULL,
  dropoff_lat DECIMAL(10,8) NOT NULL,
  dropoff_lng DECIMAL(11,8) NOT NULL,
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  rating INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_rides_passenger ON rides(passenger_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_drivers_available ON drivers(is_available);
```

### 5️⃣ Ejecutar el servidor
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## 📡 API Endpoints

### 🔐 Autenticación
```
POST /api/auth/register - Registrar usuario
POST /api/auth/login - Iniciar sesión
POST /api/auth/logout - Cerrar sesión
```

### 👤 Usuarios
```
GET /api/users/:userId - Obtener perfil
PUT /api/users/:userId - Actualizar perfil
GET /api/users/:userId/history - Historial de viajes
```

### 🚖 Viajes
```
POST /api/rides/request - Solicitar viaje
GET /api/rides/active/:passengerId - Viajes activos
PUT /api/rides/accept/:rideId - Aceptar viaje
PUT /api/rides/complete/:rideId - Completar viaje
```

### 👨‍🚗 Conductores
```
POST /api/drivers/nearby - Conductores cercanos
PUT /api/drivers/location/:driverId - Actualizar ubicación
PUT /api/drivers/availability/:driverId - Cambiar disponibilidad
```

---

## 🔌 Socket.io Eventos

### Desde Cliente → Servidor
```javascript
socket.emit('driver-location', { driverId, lat, lng })
socket.emit('request-ride', { passengerId, pickupLat, pickupLng, dropoffLat, dropoffLng })
socket.emit('accept-ride', { rideId, driverId })
```

### Desde Servidor → Cliente
```javascript
socket.on('driver-location-update', (data) => {})
socket.on('new-ride-request', (data) => {})
socket.on('ride-accepted', (data) => {})
```

---

## 📝 Ejemplo de Uso - Cliente

### Registrarse
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123",
    "name": "Juan",
    "phone": "+1234567890",
    "userType": "passenger"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123"
  }'
```

### Solicitar Viaje
```bash
curl -X POST http://localhost:3000/api/rides/request \
  -H "Content-Type: application/json" \
  -d '{
    "passengerId": "uuid-del-usuario",
    "pickupLat": 40.7128,
    "pickupLng": -74.0060,
    "dropoffLat": 40.7580,
    "dropoffLng": -73.9855,
    "estimatedPrice": 15.50
  }'
```

---

## 🌍 Desplegar Gratis

### Opción 1: Render.com
1. Crea cuenta en [Render](https://render.com)
2. Conecta tu repositorio GitHub
3. Crea un nuevo Web Service
4. Agrega variables de entorno
5. Deploy automático ✅

### Opción 2: Railway.app
1. Crea cuenta en [Railway](https://railway.app)
2. Conecta GitHub
3. Agrega variables de entorno
4. Deploy automático ✅

### Opción 3: Heroku (requiere tarjeta de crédito)
```bash
heroku login
heroku create tu-app-name
git push heroku main
```

---

## 📱 Frontend Recomendado

Para crear el frontend móvil, usa:

**React Native:**
```bash
npx create-expo-app uber-clone-mobile
npm install @react-navigation/native socket.io-client axios
```

**Flutter:**
```bash
flutter create uber_clone_mobile
# Agrega dependencias en pubspec.yaml
```

---

## 🔒 Seguridad

⚠️ **Importante para Producción:**

1. Usa variables de entorno seguras
2. Activa CORS solo para tu dominio
3. Implementa rate limiting
4. Usa HTTPS en producción
5. Valida todos los inputs del servidor
6. Usa Row Level Security (RLS) en Supabase

---

## 📊 Estructura del Proyecto

```
uber-clone/
├── src/
│   ├── server.js              # Servidor principal
│   ├── config/
│   │   └── supabase.js        # Configuración de BD
│   └── routes/
│       ├── auth.js            # Autenticación
│       ├── users.js           # Usuarios
│       ├── rides.js           # Viajes
│       └── drivers.js         # Conductores
├── .env.example               # Variables de ejemplo
├── package.json               # Dependencias
└── README.md                  # Este archivo
```

---

## 🐛 Troubleshooting

**Error: "Cannot find module 'express'"**
```bash
npm install
```

**Error de conexión a Supabase**
- Verifica que SUPABASE_URL y SUPABASE_KEY sean correctas
- Asegúrate que el proyecto esté activo en Supabase

**Socket.io no conecta**
- Comprueba que el puerto 3000 esté disponible
- Verifica CORS configuration en servidor

---

## 🚀 Próximas Características

- [ ] Sistema de pagos (Stripe/Mercado Pago)
- [ ] Chat en tiempo real entre usuario y conductor
- [ ] Búsqueda de direcciones con Google Places
- [ ] Notificaciones push
- [ ] Dashboard de administrador
- [ ] Sistema de promociones
- [ ] Integración de análiticos

---

## 📄 Licencia

MIT License - Libre para usar en proyectos comerciales

---

## 💬 Soporte

¿Preguntas? Abre un issue en GitHub o contacta al equipo de desarrollo.

---

## 🙌 Contribuciones

¡Las contribuciones son bienvenidas! 

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Creado con ❤️ para desarrolladores**

⭐ Si te gustó, dale una estrella al repositorio!
