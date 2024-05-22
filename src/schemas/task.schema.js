import { z } from "zod";

export const creatTaskSchema = z.object({
  //Encuestador

  // apellidoenc: z.string({
  //     // required_error: 'Apellido del encuestador es requerido'
  // }),
  // nombreenc: z.string({
  //     // required_error: 'Nombre del encuestador es requerido'
  // }),
  // organismoenc: z.string({
  //     // required_error: 'Organismo del encuestador es requerido'
  // }),
  // celularen: z.string({
  //     // required_error: 'Celular del encuestador es requerido'
  // }),
  // correoen: z.string({
  //     // required_error: 'Correo del encuestador es requerido'
  // }),

  // //Datos personales de las y los responsables de la unidad productiva

  // //Primer responsable
  // nombreresp1:z.string({
  //     // required_error: 'Nombre responsable 1 es requerido'
  // }),
  // apellidoresp1:z.string({
  //     // required_error: 'Apellido responsable 1 es requerido'
  // }),
  // dniresp1: z.string({
  //     // required_error: 'DNI responsable 1 es requerido'
  // }),
  // cuitresp1:z.string({
  //     // required_error: 'CUIT-CUIL responsable 1 es requerido'
  // }),
  // // fechanacimientoresp1:z.string({
  // //     required_error: 'Fecha de nacimiento es requerido'
  // // }),
  // celularresp1:z.string({
  //     // required_error: 'Celular responsable 1 es requerido'
  // }),
  // correoresp1:z.string({
  //     // required_error: 'Correo responsable 1 es requerido'
  // }),
  // estudiosresp1:z.string({
  //     // required_error: 'Estudios responsable 1 es requerido'
  // }),

  // //Segundo responsable

  // nombreresp2:z.string({
  //     // required_error: 'Nombre responsable 2 es requerido'
  // }),
  // apellidoresp2:z.string({
  //     // required_error: 'Apellido responsable 2 es requerido'
  // }),
  // dniresp2: z.string({
  //     // required_error: 'DNI responsable 2 es requerido'
  // }),
  // cuitresp2:z.string({
  //     // required_error: 'CUIT-CUIL responsable 2 es requerido'
  // }),
  // // fechanacimientoresp2:z.string({
  // //     required_error: 'Fecha de nacimiento es requerido'
  // // }),
  // celularresp2:z.string({
  //     // required_error: 'Celular responsable 2 es requerido'
  // }),
  // correoresp2:z.string({
  //     // required_error: 'Correo responsable 2 es requerido'
  // }),
  // estudiosresp2:z.string({
  //     // required_error: 'Estudios responsable 2 es requerido'
  // }),

  // //Datos del grupo familiar
  tieneintegrantes: z.string({}),
  cuantosintegrantes: z.string({}),
  cantidadhijosgrupo:z.string({}),
  convive:z.string({}),
  hijosasisten:z.string({}),

  // integrantesTrabajando: z.object({
  //     tieneIntegrantes: z.enum(["Si", "No"]),
  //     cantidad: z.number().optional()
  // }),

  // hijosfamiliar:z.string({
  // }),
  // convivefamiliar: z.string({
  // }),
  // escuelafamiliar:z.string({
  // }),

  // nivelinicialfamiliar: z.array(z.string()),

  // primariafamiliar: z.array(z.string()),

  // secundariafamiliar: z.array(z.string()),

  // terciariaosuperiorfamiliar: z.array(z.string()),

  // domiciliofamiliar: z.string({
  // }),

  // lotefamiliar:z.string({
  // }),

  // parcelafamiliar:z.string({
  // }),

  // seccionfamiliar:z.string({
  // }),

  // partidafamiliar:z.string({
  // }),

  // coloniaparajefamiliar:z.string({
  // }),

  // localidadfamiliar:z.string({
  // }),

  // departamentofamiliar:z.string({
  // }),

  // pueblosoriginariosfamiliar:z.string({
  // }),

  // //Datos prediales de la unidad productiva

  // loteprediales:z.string({
  // }),

  // parcelaprediales:z.string({
  // }),

  // seccionprediales:z.string({
  // }),

  // partidaprediales:z.string({
  // }),

  // coloniaprediales:z.string({
  // }),

  // localidadprediales:z.string({
  // }),

  // departamentoprediales:z.string({
  // }),

  // propietarioprediales:z.string({
  // }),

  // arrendatarioprediales:z.string({
  // }),

  // condominioprediales:z.string({
  // }),

  // ocupanteprediales:z.string({
  // }),

  // superficietotalprediales:z.string({
  // }),

  // supagricprediales:z.string({
  // }),

  // supgandprediales:z.string({
  // }),

  // monteprediales:z.string({
  // }),

  // suppiscicolaprediales:z.string({
  // }),

  // supapicolaprediales:z.string({
  // }),

  // supactindustrialprediales:z.string({
  // }),

  // sinusoprediales:z.string({
  // }),

  // otrosprediales:z.string({
  // }),

  // puntosgpsprediales:z.string({
  // }),

  // //Pefil Productivo

  // produccionagroecologica:z.string({
  // }),

  // produccionconvencional:z.string({
  // }),

  // produccionanimal:z.string({
  // }),

  // produccionvegetal:z.string({
  // }),

  // accesoagua:z.string({
  // }),

  // infraestructuraproductiva:z.string({
  // }),

  // maquinariaproductiva:z.string({
  // }),

  // //Datos de Comercializacion

  // vendecomercializacion:z.string({
  // }),

  // feriaperteneciente:z.string({
  // }),

  // puesto:z.string({
  // }),

  // carnetmanipulacion:z.string({
  // }),

  // monotributista:z.string({
  // }),

  // excedenteproduccion:z.string({
  // }),

  // pedido:z.string({
  // }),

  // compraproduccion:z.string({
  // }),

  // agregadovalor:z.string({
  // }),

  // equipamento:z.string({
  // }),

  // difusion:z.string({
  // }),

  // //Registro asignados

  // registroprovincial:z.string({
  // }),

  // registroproductor:z.string({
  // }),

  // rensapa:z.string({
  // }),

  // carnetsanitario:z.string({
  // }),

  // municipio:z.string({
  // }),

  // renapa:z.string({
  // }),

  // fechanacimiento: z.string({
  //     required_error: 'Fecha de nacimiento es requerida'
  // }),
  // genero: z.string({
  //     required_error: 'Género is required'
  // }),
  // nacimiento: z.string({
  //     required_error: 'Lugar de Nacimiento is required'
  // }),

  // municipio: z.string({
  //     required_error: 'Municipio is required'
  // }),

  // postal: z.string({
  //     required_error: 'Dirección Postal is required'
  // }),

  // direccion: z.string({
  //     required_error: 'Dirección is required'
  // }),

  // residencia: z.string({
  //     required_error: 'Residencia es requerida'
  // }),

  // nacionalidad: z.string({
  //     required_error: 'Nacionalidad is required'
  // }),
  // correo: z.string({
  //     required_error: 'Correo is required'
  // }),

  // telefono: z.string({
  //     required_error: 'Teléfono is required'
  // }),

  // roldirecto: z.array(z.string()),

  // disciplinadirecta: z.array(z.string()),

  // rolindirecto: z.array(z.string()),

  // disciplinaindirecta: z.array(z.string()),

  // publico: z.string(),

  // formacionpublica: z.array(z.string()),

  // disciplinapublica: z.array(z.string()),

  // privada: z.string(),

  // formacionprivada: z.array(z.string()),

  // disciplinaprivada: z.array(z.string()),

  // observaciones: z.string({
  // }),
});
