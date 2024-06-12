import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema(
  {
    //Encuestador
    apellidoenc: {
      type: String,
      trim: true,
    },
    nombreenc: {
      type: String,
      trim: true,
    },
    organismoenc: {
      type: String,
      trim: true,
    },
    celularen: {
      type: String,
      trim: true,
    },
    correoen: {
      type: String,
      trim: true,
    },

    //Datos personales de las y los responsables de la unidad productiva
    //Primer responsable
    nombreresp1: {
      type: String,
      trim: true,
    },
    apellidoresp1: {
      type: String,
      trim: true,
    },
    dniresp1: {
      type: String,
      trim: true,
    },
    genero1: {
      type: String,
      trim: true,
    },
    cuitresp1: {
      type: String,
      trim: true,
    },
    celularresp1: {
      type: String,
      trim: true,
    },
    correoresp1: {
      type: String,
      trim: true,
    },
    estudiosresp1: {
      type: String,
      trim: true,
    },

    //Segundo responsable
    nombreresp2: {
      type: String,
      trim: true,
    },
    apellidoresp2: {
      type: String,
      trim: true,
    },
    dniresp2: {
      type: String,
      trim: true,
    },
    genero2: {
      type: String,
      trim: true,
    },
    cuitresp2: {
      type: String,
      trim: true,
    },
    celularresp2: {
      type: String,
      trim: true,
    },
    correoresp2: {
      type: String,
      trim: true,
    },
    estudiosresp2: {
      type: String,
      trim: true,
    },

    // Datos del grupo familiar
    tieneintegrantes: {
      type: String, // Cambiar a String
      enum: ["SI", "NO"], // Validación para aceptar solo "SI" o "NO"
      trim: true,
    },
    cuantosintegrantes: {
      type: String,
      trim: true,
    },
    cantidadhijosgrupo: {
      type: String,
      trim: true,
    },
    convive: {
      type: String, // Cambiar a String
      enum: ["SI", "NO"], // Validación para aceptar solo "SI" o "NO"
      trim: true,
    },
    hijosasisten: {
      type: String,
      trim: true,
    },

    nivelinicialfamiliar: {
      type: String,
      trim: true,
    },
    primariafamiliar: {
      type: String,
      trim: true,
    },
    secundariafamiliar: {
      type: String,
      trim: true,
    },
    terciariaosuperiorfamiliar: {
      type: String,
      trim: true,
    },
    pueblosoriginariosfamiliar: {
      type: String,
      trim: true,
    },
    cualpueblosoriginariosfamiliar: {
      type: String,
      trim: true,
    },
    domiciliofamiliar: {
      type: String,
      trim: true,
    },
    lotefamiliar: {
      type: String,
      trim: true,
    },
    parcelafamiliar: {
      type: String,
      trim: true,
    },
    seccionfamiliar: {
      type: String,
      trim: true,
    },
    partidafamiliar: {
      type: String,
      trim: true,
    },
    coloniaparajefamiliar: {
      type: String,
      trim: true,
    },
    municipiofamiliar: {
      type: String,
      trim: true,
    },
    departamentofamiliar: {
      type: String,
      trim: true,
    },
    loteprediales: {
      type: String,
      trim: true,
    },
    parcelaprediales: {
      type: String,
      trim: true,
    },
    seccionprediales: {
      type: String,
      trim: true,
    },
    partidaprediales: {
      type: String,
      trim: true,
    },
    coloniaprediales: {
      type: String,
      trim: true,
    },
    municipioprediales: {
      type: String,
      trim: true,
    },
    departamentoprediales: {
      type: String,
      trim: true,
    },
    propiedadproductiva: {
      type: String,
      trim: true,
    },
    propietarioprediales: {
      type: String,
      trim: true,
    },
    condominioprediales: {
      type: String,
      trim: true,
    },
    arrendatarioprediales: {
      type: String,
      trim: true,
    },
    ocupanteprediales: {
      type: String,
      trim: true,
    },
    superficietotalprediales: {
      type: String,
      trim: true,
    },
    supagricprediales: {
      type: String,
      trim: true,
    },
    supgandprediales: {
      type: String,
      trim: true,
    },
    monteprediales: {
      type: String,
      trim: true,
    },
    suppiscicolaprediales: {
      type: String,
      trim: true,
    },
    supapicolaprediales: {
      type: String,
      trim: true,
    },
    supactindustrialprediales: {
      type: String,
      trim: true,
    },
    sinusoprediales: {
      type: String,
      trim: true,
    },
    otrosprediales: {
      type: String,
      trim: true,
    },
    puntosgpsprediales: {
      type: String,
      trim: true,
    },
    produccionagroecologica: {
      type: String,
      trim: true,
    },
    situacionproduccionagroecologica: {
      type: String,
      trim: true,
    },
    produccionconvencional: {
      type: String,
      trim: true,
    },
    produccionanimal: {
      type: [String],
      trim: true,
    },
    produccionvegetal: {
      type: String,
      trim: true,
    },
    accesoagua: {
      type: String,
      trim: true,
    },
    modalidadaccesoagua: {
      type: String,
      trim: true,
    },
    infraestructuraproductiva: {
      type: String,
      trim: true,
    },
    cualesinfraestructuraproductiva: {
      type: String,
      trim: true,
    },
    maquinariaproductiva: {
      type: String,
      trim: true,
    },
    cualesmaquinariaproductiva: {
      type: String,
      trim: true,
    },
    vendecomercializacion: {
      type: String,
      trim: true,
    },
    cualesvendecomercializacion: {
      type: String,
      trim: true,
    },
    feriaperteneciente: {
      type: String,
      trim: true,
    },
    puesto: {
      type: String,
      trim: true,
    },
    carnetmanipulacion: {
      type: String,
      trim: true,
    },
    vigencia: {
      type: String,
      trim: true,
    },
    monotributista: {
      type: String,
      trim: true,
    },
    excedenteproduccion: {
      type: String,
      trim: true,
    },
    pedido: {
      type: String,
      trim: true,
    },
    compraproduccion: {
      type: String,
      trim: true,
    },
    agregadovalor: {
      type: String,
      trim: true,
    },
    cualesagregadovalor: {
      type: String,
      trim: true,
    },
    equipamento: {
      type: String,
      trim: true,
    },
    cualesequipamento: {
      type: String,
      trim: true,
    },
    difusion: {
      type: String,
      trim: true,
    },
    cualesdifusion: {
      type: String,
      trim: true,
    },
    registroprovincial: {
      type: String,
      trim: true,
    },
    registroproductor: {
      type: String,
      trim: true,
    },
    rensapa: {
      type: String,
      trim: true,
    },
    carnetsanitario: {
      type: String,
      trim: true,
    },
    municipioasignados: {
      type: String,
      trim: true,
    },
    renapa: {
      type: String,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", tasksSchema);
