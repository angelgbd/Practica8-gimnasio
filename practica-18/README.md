# Práctica 18 · carga por ruta y store de Zustand

Cliente React + Vite para la API del gimnasio (`http://localhost:3000`). Zustand conserva en memoria las inscripciones compartidas entre el encabezado, el catálogo y la página protegida.

## Ejecutar

Desde la raíz del repositorio inicia la API con `npm run start:dev`. En `practica-18/`, instala las dependencias con `npm install` y usa `npm run dev` para trabajar. Para revisar el build, ejecuta `npm run build` y después `npm run preview`; la configuración sirve el preview en `http://localhost:5173/`.

La API permite CORS desde `http://localhost:5173`. Vite Preview suele usar `4173` por defecto; el navegador enviaría el origen `http://localhost:4173`, que la lista de CORS de esta API no autoriza. Por eso las peticiones del preview fallarían aunque la API esté encendida. Esta práctica fija el puerto del preview en `5173`.

## Resultado de las compilaciones

La referencia se compiló con las mismas dependencias y componentes, pero con importaciones estáticas. Vite generó un archivo JavaScript de `324.65 kB` (`104.85 kB` gzip).

Después de aplicar `React.lazy` a las cuatro rutas, el núcleo compartido pesa `316.52 kB` (`103.14 kB` gzip). Para abrir Horarios se descargan además `Inicio` (`4.09 kB`, `1.70 kB` gzip) y `diaLegible` (`0.49 kB`, `0.33 kB` gzip). El JavaScript inicial suma `321.10 kB` sin comprimir: ahorra `3.55 kB` (aprox. `1.1%`) frente al build estático. Comprimido, suma `105.17 kB`, `0.32 kB` más que la referencia por la sobrecarga de dividir y comprimir archivos pequeños.

Los módulos de Entrar (`2.19 kB`), Registro (`2.08 kB`) y Mis inscripciones (`2.35 kB`) se solicitan al visitar esas rutas. En total se difieren `6.62 kB` (`2.91 kB` gzip) hasta que alguien las necesita. El ahorro inicial es modesto porque React, React Router, Axios, el store y el encabezado se comparten entre páginas; dividir rutas aplaza código, no lo elimina.

Los archivos principales generados en `dist/` son:

- `index.html` (`0.56 kB`) y `assets/index-Br3fEG3N.css` (`14.62 kB`, `4.04 kB` gzip).
- `assets/index-DQZD0DXg.js` (`316.52 kB`, `103.14 kB` gzip), el núcleo compartido.
- Chunks de ruta: `assets/Inicio-CvStB4jt.js` (`4.09 kB`), `assets/Entrar-BcLOLhSt.js` (`2.19 kB`), `assets/Registro-CdLhcG1I.js` (`2.08 kB`) y `assets/MisInscripciones-D3TEKrxS.js` (`2.35 kB`).
- `assets/diaLegible-D0JyozDb.js` (`0.49 kB`), cinco archivos de fuente WOFF2 y las imágenes SVG copiadas a `dist/images/`.

Las imágenes del catálogo llevan `loading="lazy"` y `decoding="async"`. Las dos ilustraciones usadas por el seeder suman `1,775` bytes. En la vista comprobada, Chrome las descargó de inmediato porque las tres filas están dentro de su zona de carga diferida; el ahorro inicial medido en esa vista fue `0` bytes. En un catálogo largo, las imágenes que queden lejos de la pantalla se descargarán al acercarse. La carga diferida reduce las solicitudes iniciales solo cuando hay imágenes fuera de esa zona y no cambia el tamaño del build.

## Store y sesión

- `src/stores/inscripcionesStore.ts` guarda las inscripciones, el estado de carga, el error y las acciones para cargar, agregar una inscripción confirmada y vaciar el store.
- Al iniciar o restaurar una sesión, `SesionProvider` carga las inscripciones. Al salir o expirar la sesión, las limpia.
- El encabezado cuenta las inscripciones confirmadas. El catálogo marca los horarios ya inscritos y Mis inscripciones lee las filas del store; esta página solo consulta los detalles de los horarios.

Conviene usar Context para valores asociados a una rama de componentes, como la sesión que distribuye `SesionProvider`. Un store como Zustand conviene para estado compartido y cambiante que varias rutas consultan o actualizan mediante acciones. Aquí la sesión sigue en Context y las inscripciones viven en Zustand.

En la pestaña **Red**, abre primero `/` y luego navega a Entrar, Registro y Mis inscripciones. El build solicita los archivos `Inicio-*.js`, `Entrar-*.js`, `Registro-*.js` y `MisInscripciones-*.js` al visitar cada página. En el catálogo, `yoga.svg` y `spinning.svg` son las imágenes con carga diferida.
