import { z } from "zod";

export const creatTaskSchema = z.object({
  //Encuestador

  apellidoenc: z.string({
    required_error: "Apellido del encuestador es requerido",
  }),
  nombreenc: z.string({
    required_error: "Nombre del encuestador es requerido",
  }),
  organismoenc: z.string({
    required_error: "Organismo del encuestador es requerido",
  }),
  celularen: z.string({
    required_error: "Celular del encuestador es requerido",
  }),
  correoen: z.string({
    required_error: "Correo del encuestador es requerido",
  }),

  //Datos personales de las y los responsables de la unidad productiva

  //Primer responsable
  nombreresp1: z.string({
    required_error: "Nombre responsable 1 es requerido",
  }),
  apellidoresp1: z.string({
    required_error: "Apellido responsable 1 es requerido",
  }),
  dniresp1: z.string({
    required_error: "DNI responsable 1 es requerido",
  }),
  cuitresp1: z.string({
    required_error: "CUIT-CUIL responsable 1 es requerido",
  }),
  // fechanacimientoresp1:z.string({
  //     required_error: 'Fecha de nacimiento es requerido'
  // }),
  celularresp1: z.string({
    required_error: "Celular responsable 1 es requerido",
  }),
  correoresp1: z.string({
    required_error: "Correo responsable 1 es requerido",
  }),
  estudiosresp1: z.string({
    required_error: "Estudios responsable 1 es requerido",
  }),

  //Segundo responsable

  nombreresp2: z.string({
    required_error: "Nombre responsable 2 es requerido",
  }),
  apellidoresp2: z.string({
    required_error: "Apellido responsable 2 es requerido",
  }),
  dniresp2: z.string({
    required_error: "DNI responsable 2 es requerido",
  }),
  cuitresp2: z.string({
    required_error: "CUIT-CUIL responsable 2 es requerido",
  }),
  // fechanacimientoresp2:z.string({
  //     required_error: 'Fecha de nacimiento es requerido'
  // }),
  celularresp2: z.string({
    required_error: "Celular responsable 2 es requerido",
  }),
  correoresp2: z.string({
    required_error: "Correo responsable 2 es requerido",
  }),
  estudiosresp2: z.string({
    required_error: "Estudios responsable 2 es requerido",
  }),

  // Datos del grupo familiar
  tieneintegrantes: z.string({
    required_error: "Hay integrantes es requerido",
  }),
  cuantosintegrantes: z.string({}).optional(),
  cantidadhijosgrupo: z.string({}).optional(),
  convive: z.string({}).optional(),
  hijosasisten: z.string({}).optional(),

  nivelinicialfamiliar: z.string({}).optional(),

  primariafamiliar: z.string({}).optional(),

  secundariafamiliar: z.string({}).optional(),

  terciariaosuperiorfamiliar: z.string({}).optional(),

  pueblosoriginariosfamiliar: z.string({}).optional(),

  cualpueblosoriginariosfamiliar: z.string({}).optional(),

  domiciliofamiliar: z.string({
    required_error: "Vive donde produce es requerido",
  }),

  lotefamiliar: z.string({}).optional(),

  parcelafamiliar: z.string({}).optional(),

  seccionfamiliar: z.string({}).optional(),

  partidafamiliar: z.string({}).optional(),

  coloniaparajefamiliar: z.string({}).optional(),

  municipiofamiliar: z.string({}).optional(),

  departamentofamiliar: z.string({}).optional(),

  // //Datos prediales de la unidad productiva

  loteprediales:z.string({
  }).optional(),

  parcelaprediales:z.string({
  }).optional(),

  seccionprediales:z.string({
  }).optional(),

  partidaprediales:z.string({
  }).optional(),

  coloniaprediales:z.string({
  }).optional(),

  municipioprediales:z.string({
  }).optional(),

  departamentoprediales:z.string({
  }).optional(),

  propiedadproductiva: z.string({}).optional(),

  propietarioprediales:z.string({
  }).optional(),

  arrendatarioprediales:z.string({
  }).optional(),

  condominioprediales:z.string({
  }).optional(),

  ocupanteprediales:z.string({
  }).optional(),

  superficietotalprediales:z.string({
  }).optional(),

  supagricprediales:z.string({
  }).optional(),

  supgandprediales:z.string({
  }).optional(),

  monteprediales:z.string({
  }).optional(),

  suppiscicolaprediales:z.string({
  }).optional(),

  supapicolaprediales:z.string({
  }).optional(),

  supactindustrialprediales:z.string({
  }).optional(),

  sinusoprediales:z.string({
  }).optional(),

  otrosprediales:z.string({
  }).optional(),

  puntosgpsprediales:z.string({
  }).optional(),

  // //Pefil Productivo

  //required_error: "Producción Agroecológica es requerido",
  
  produccionagroecologica: z.string({}).optional(),
  
  situacionproduccionagroecologica: z.string({}).optional(),

  produccionconvencional:z.string({}).optional(),

  produccionanimal:z.string({
  }).optional(),

  produccionvegetal:z.string({
  }).optional(),

  accesoagua:z.string({}).optional(),

  modalidadaccesoagua:z.string({}).optional(),

  infraestructuraproductiva:z.string({}).optional(),

  cualesinfraestructuraproductiva:z.string({}).optional(),

  maquinariaproductiva:z.string({}).optional(),

  cualesmaquinariaproductiva:z.string({}).optional(),

  // //Datos de Comercializacion

  vendecomercializacion:z.string({}).optional(),

  cualesvendecomercializacion:z.string({}).optional(),

  feriaperteneciente:z.string({
  }).optional(),

  puesto:z.string({
  }).optional(),

  carnetmanipulacion:z.string({
  }).optional(),

  vigencia:z.string({
  }).optional(),

  monotributista:z.string({
  }).optional(),

  excedenteproduccion:z.string({
  }).optional(),

  pedido:z.string({
  }).optional(),

  compraproduccion:z.string({
  }).optional(),

  agregadovalor:z.string({
  }).optional(),

  cualesagregadovalor:z.string({
  }).optional(),

  equipamento:z.string({
  }).optional(),

  cualesequipamento:z.string({
  }).optional(),

  difusion:z.string({
  }).optional(),

  cualesdifusion:z.string({
  }).optional(),

  // //Registro asignados

  registroprovincial:z.string({
  }).optional(),

  registroproductor:z.string({
  }).optional(),

  rensapa:z.string({
  }).optional(),

  carnetsanitario:z.string({
  }).optional(),

  municipioasignados:z.string({
  }).optional(),

  renapa:z.string({
  }).optional(),

});
