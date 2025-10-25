# 🛍️ Tutti Shop — E-commerce Demo

> **Aplicación de tienda online completa y funcional, desarrollada 100% en React sin necesidad de backend.**  
> Perfecta para demostraciones de portfolio, incluye gestión de productos, filtros avanzados, carrito de compras y modo administrador.

[![React](https://img.shields.io/badge/React-17.0.2-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🌐 Ver Demo en Vivo](https://tuttishop-demo.netlify.app) | [📖 Documentación](#tabla-de-contenidos)

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#sobre-el-proyecto)
- [Características Principales](#características-principales)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación y Configuración](#instalación-y-configuración)
- [Guía de Uso](#guía-de-uso)
- [Modo Administrador](#modo-administrador)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Despliegue](#despliegue)
- [Troubleshooting](#troubleshooting)
- [Contacto](#contacto)

---

## 🎯 Sobre el Proyecto

**Tutti Shop** es una aplicación e-commerce completa desarrollada como proyecto de portfolio, que demuestra capacidades avanzadas de desarrollo frontend moderno sin necesidad de servidor backend. 

### ¿Qué hace especial a este proyecto?

- **🔄 Persistencia Local**: Todos los datos se gestionan mediante LocalStorage, permitiendo una experiencia completa sin servidor.
- **⚡ Rendimiento Optimizado**: Catálogo pre-cargado con fallback embebido para carga instantánea en producción.
- **🎨 UI/UX Profesional**: Diseño responsive con React-Bootstrap, filtros avanzados y animaciones fluidas.
- **🛠️ Modo Administrador**: Sistema completo de ABM (Alta, Baja, Modificación) de productos con validaciones en tiempo real.
- **📱 100% Responsive**: Optimizado para dispositivos móviles, tablets y desktop.
- **🔍 Filtros Avanzados**: Búsqueda en tiempo real, filtros por categoría, rango de precios con doble slider, ordenamiento múltiple.

### Casos de Uso

- ✅ Proyecto de portfolio para desarrolladores frontend
- ✅ Prototipo funcional para e-commerce
- ✅ Base para aplicaciones React con gestión de estado local
- ✅ Ejemplo educativo de arquitectura frontend moderna

---

## ✨ Características Principales

- Catálogo demo precargado desde `public/products.json` con los campos: `_id`, `nombre`, `description`, `disponible`, `imagen`, `price`, `categoria`.
- Listado con:
	- Búsqueda en vivo estilo “pill” full‑bleed.
	- Chips de categoría (dinámicas por `categoria` y heurísticas).
	- Filtro “Solo en stock”.
	- Orden por precio (↑/↓) y nombre (A‑Z/Z‑A).
	- Rango de precio con barra doble (rc-slider), límites dinámicos por catálogo.
	- Paginación.
- Carrito:
	- Overlay Offcanvas con totales “sticky”.
	- Sumar/restar, eliminar, vaciar.
	- Toast al agregar.
- Modo Admin (demo, clave “admin”):
	- Dropdown “Probar modo admin” en la navbar.
	- Alta de productos con validaciones básicas (nombre, imagen, precio>0) y toasts.
	- Edición/eliminación inline en las tarjetas, con toasts.
	- Select de categorías existentes + opción “Otra…” para crear nuevas.
	- Resetear catálogo a `products.json` (con toast).
- Persistencia en el navegador:
	- Catálogo y estado admin en LocalStorage.
	- Filtros en URL + LocalStorage (permite compartir enlaces con filtros aplicados).

---

## Stack

- React 17 + Create React App
- React‑Bootstrap 5 + Bootstrap 5
- rc-slider para barra de precio dual
- Font Awesome (free) para íconos

Scripts (package.json):

- `npm start`: desarrollo en `http://localhost:3000`
- `npm run build`: build de producción en `build/`

---

## Cómo correr localmente

1. Instalar dependencias
	 - npm install
2. Arrancar en desarrollo
	 - npm start
3. Abrir `http://localhost:3000`

Requisitos: Node 16+ recomendado.

---

## Modo demo y catálogo

- La app inicializa el catálogo desde `public/products.json` y lo copia a LocalStorage (`catalog.products`).
- El hook `src/hooks/UseGetItems.jsx` escucha `catalog:updated` para refrescar el listado en vivo.
- Podés resetear el catálogo desde el menú admin (resetea a `products.json`).

URL de datos: `public/products.json` es servido como `/products.json` por CRA.

---

## Modo Admin (demo)

- Abrí el dropdown “Probar modo admin” (navbar) y usá la clave: `admin`.
- Acciones disponibles:
	- Nuevo producto (modal con validaciones y toasts).
	- Resetear catálogo a `products.json`.
	- Salir (cierra modo admin y recarga).
- Edición inline en tarjetas (si estás en admin): lápiz para editar, tacho para eliminar.
- Categorías: el campo usa un select con categorías existentes y opción “Otra…” para crear una nueva. Los filtros se actualizan automáticamente.

---

## Filtros y orden

- Búsqueda: campo grande en la parte superior del listado (píldora).
- Categorías: chips (Electrónica, Audio, Gaming, Oficina) + dinámicas por dato.
- Precio: doble slider rc‑slider (rango) con `allowCross=false` para evitar solape.
- Orden: precio asc/desc y nombre A‑Z/Z‑A.
- Paginación: configurable (12 por página por defecto).
- Persistencia: filtros -> URL y LocalStorage (clave `filters`).

---

## Carrito

- Botón en navbar con badge de cantidad.
- Offcanvas lateral con lista, sumas parciales y total.
- Controles de cantidad, eliminar y vaciar.
- Toast de confirmación al agregar desde las tarjetas.

---

## Arquitectura rápida

- `src/hooks/UseGetItems.jsx`: fuente de catálogo (LocalStorage + `/products.json`).
- `src/utils/catalog.js`: helpers de LocalStorage y eventos (`catalog:updated`).
- `src/Conteiners/Productos.jsx`: filtros, slider, grilla y paginado.
- `src/Components/Producto.jsx`: tarjeta de producto + admin inline.
- `src/Components/AdminBar.jsx`: menú admin, login demo y alta con validaciones/toasts.
- `src/Components/Header.jsx`: navbar, botón carrito y overlay Offcanvas con toast al agregar.

---

## Despliegue (portfolio)

Opción 1 — Netlify

1. `npm run build`
2. Subí la carpeta `build/` o conectá el repo y configurá:
	 - Build command: `npm run build`
	 - Publish directory: `build`

Opción 2 — Vercel

1. Conectá el repo.
2. Framework preset: Create React App.
3. Build Command: `npm run build` — Output: `build`.

Opción 3 — GitHub Pages

1. `npm run build`
2. Publicá el contenido de `build/` en una rama `gh-pages` o activá GitHub Pages desde Settings > Pages apuntando a `/ (root)` si usás GitHub Actions.

Notas de ruta: la app asume rutas relativas estándar de CRA, sirviendo `/products.json`. En GH Pages con subruta, asegurate de usar `homepage` en package.json o configurar rutas relativas.

---

## Volver a backend (opcional)

Si tenés un API (por ej.: `http://localhost:4000/API/ver`):

1. En `src/hooks/UseGetItems.jsx` descomentá axios y el bloque “Modo backend”.
2. Ajustá la URL.
3. Desactivá la inicialización por `ensureInitialized`.

---

## Troubleshooting

- No aparecen íconos: confirmá dependencia `@fortawesome/fontawesome-free` y que los estilos se importen (Bootstrap incluido).
- Slider no se ve: `rc-slider` debe estar instalado y con `import 'rc-slider/assets/index.css'` en `Productos.jsx`.
- `products.json` 404 en producción: recordá incluir `public/products.json` en el deploy; en plataformas de hosting suele copiarse automáticamente.
- GH Pages en subruta: configurá `homepage` en package.json para rutas correctas.
