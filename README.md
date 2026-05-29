# REASONS — Sistema de Gestión de Investigación

Sistema web para la gestión de investigadores, proyectos y publicaciones científicas de la Universidad Técnica de Ambato.

---

## 🗂️ Estructura del Proyecto

```
ape-3/
├── reasons-backend/    ← API REST (Node.js + Express + TypeScript + PostgreSQL)
└── reasons-frontend/   ← Aplicación web (Angular + TailwindCSS)
```

---

## ⚙️ Backend — `reasons-backend`

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) corriendo localmente (puerto 5432 por defecto)
- Base de datos `reasons_db` creada previamente

### 1. Instalar dependencias

```bash
cd reasons-backend
npm install
```

### 2. Crear el archivo `.env`

En la carpeta `reasons-backend/`, crea un archivo llamado **`.env`** (sin extensión) con el siguiente contenido. **Este archivo NO está en el repositorio por seguridad — debes crearlo tú.**

```env
# Configuración de la Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reasons_db
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA_AQUI

# Puerto del servidor
PORT=3000

# Clave secreta para JWT (puedes poner cualquier cadena larga)
JWT_SECRET=una_clave_secreta_muy_larga_y_segura
```

> ⚠️ **Importante:** Reemplaza `TU_CONTRASEÑA_AQUI` con la contraseña de tu usuario de PostgreSQL. Asegúrate de que la base de datos `reasons_db` exista antes de arrancar.

### 3. Levantar el servidor

```bash
npm run dev
```

Si todo está correcto, verás en la terminal:

```
Server is running on port 3000
Successfully connected to the database.
```

La API estará disponible en: **http://localhost:3000**

---

## 🌐 Frontend — `reasons-frontend`

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- Angular CLI (opcional, el proyecto usa `npm run start` directamente)

### 1. Instalar dependencias

```bash
cd reasons-frontend
npm install
```

### 2. Levantar la aplicación

```bash
npm run start
```

La aplicación estará disponible en: **http://localhost:4200**

> 📌 **Nota:** El backend debe estar corriendo en `http://localhost:3000` para que el frontend funcione correctamente.

---

## 🚀 Orden recomendado para correr el proyecto

Abre **dos terminales** y ejecuta:

**Terminal 1 — Backend:**
```bash
cd reasons-backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd reasons-frontend
npm run start
```

Luego abre tu navegador en **http://localhost:4200**

---

## 🔑 Acceso al Panel de Administración

El panel de admin se encuentra en: **http://localhost:4200/admin**

Para ingresar necesitas las credenciales de administrador registradas en la base de datos.

---

## 🛠️ Endpoints principales de la API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/api/auth/login` | Iniciar sesión | ❌ |
| `GET` | `/api/researchers` | Listar investigadores | ❌ |
| `POST` | `/api/researchers` | Crear investigador | ✅ |
| `PUT` | `/api/researchers/:id` | Editar investigador | ✅ |
| `DELETE` | `/api/researchers/:id` | Eliminar investigador | ✅ |
| `GET` | `/api/projects` | Listar proyectos | ❌ |
| `POST` | `/api/projects` | Crear proyecto | ✅ |
| `PUT` | `/api/projects/:id` | Editar proyecto | ✅ |
| `DELETE` | `/api/projects/:id` | Eliminar proyecto | ✅ |
| `GET` | `/api/publications` | Listar publicaciones | ❌ |
| `POST` | `/api/publications` | Crear publicación | ✅ |
| `PUT` | `/api/publications/:id` | Editar publicación | ✅ |
| `DELETE` | `/api/publications/:id` | Eliminar publicación | ✅ |

> ✅ = Requiere token JWT en el header: `Authorization: Bearer <token>`

---

## 🧰 Tecnologías utilizadas

### Backend
- **Node.js** + **Express** — Servidor HTTP
- **TypeScript** — Tipado estático
- **PostgreSQL** — Base de datos relacional
- **JWT** — Autenticación con tokens
- **dotenv** — Variables de entorno
- **nodemon** — Hot reload en desarrollo

### Frontend
- **Angular 19** — Framework SPA
- **TailwindCSS v4** — Estilos utilitarios
- **Material Icons** — Iconografía
- **Google Fonts (Merriweather)** — Tipografía

---

*Proyecto académico — Universidad Técnica de Ambato · 6to Semestre Software*
