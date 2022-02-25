Server Store

El script npm run build:ui construye el frontend y copia la versión de producción en el repositorio backend. npm run deploy libera el backend actual a heroku.

npm run deploy:full: full combina estos dos y contiene los comandos git necesarios para actualizar el repositorio de backend.

También hay un script npm run logs:prod para mostrar los logs de heroku.

NB En Windows, los scripts npm se ejecutan en cmd.exe como el shell predeterminado que no admite comandos bash. Para que los comandos de bash anteriores funcionen, puede cambiar el shell predeterminado a Bash (en la instalación predeterminada de Git para Windows) de la siguiente manera:

npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"