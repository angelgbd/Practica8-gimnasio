<img width="811" height="802" alt="image" src="https://github.com/user-attachments/assets/19eb858b-faa9-4a80-8d21-8ea32618a221" />
Responder: ¿qué línea del Service o del Controller tuvo que cambiar para que Clases hablara con MySQL?
Para conectar Clases con MySQL no cambió ninguna línea del Service ni del Controller. El import del DTO en el Controller ahora es de valor para permitir su validación en ejecución.
Responder: ¿por qué InscripcionesService no tuvo que cambiar ni una línea de las reglas de cupo y duplicados?
InscripcionesService conservó sus reglas porque sigue usando el mismo contrato de repositorio, cambió dónde se leen y guardan los datos.
Responder: ¿por qué una interfaz no puede validar nada en tiempo de ejecución?
TypeScript elimina las interfaces al compilar
Responder: ¿qué código de estado responde y qué trae en el cuerpo?
Los dos casos de validación responden 400. El cuerpo mal formado produjo {"message":["horarioId must be an integer number","miembroId must be an integer number"],"error":"Bad Request","statusCode":400}. La propiedad extra produjo {"message":["property campoSorpresa should not exist"],"error":"Bad Request","statusCode":400}. Para rechazar campos desconocidos, forbidNonWhitelisted debe acompañarse de whitelist.
Responder: ¿cuántas líneas quedó más corto el controlador?
El controlador de Inscripciones tiene 26 líneas menos.
Responder: si la respuesta llega en los dos casos, ¿quién bloquea realmente y a quién protege?
Las peticiones desde ambos orígenes permitidos devolvieron 200 y expusieron Location y X-Request-Id.
