export interface HeroData {
    titulo_principal: string;
    subtitulo: string;
    descripcion: string;
    video_id: string;
    cta_primario: string;
    cta_secundario?: string;
    estadisticas: { valor: string; etiqueta: string }[];
    imagen?: string;
    logo?: string;
    titulo?: string;
}

export interface QuienesSomosData {
    titulo: string;
    descripcion: string;
    filosofia: { titulo: string; contenido: string };
    mision: string;
    vision: string;
    valores: { titulo: string; items: { titulo: string; descripcion: string; icono: string }[] };
    imagen_destacada: string;
}

export interface HistoriaData {
    titulo: string;
    subtitulo: string;
    descripcion: string[];
    imagen: string;
}

export interface OrganizacionMiembro {
    name: string;
    role: string;
}

export interface OrganizacionSeccion {
    title: string;
    members: OrganizacionMiembro[];
}

export interface OrganizacionData {
    titulo: string;
    descripcion: string;
    estatutos_pdf: string;
    secciones: OrganizacionSeccion[];
}

export interface PaisData {
    id: string;
    nombre: string;
    latitud: number;
    longitud: number;
    representante: string;
    cargo: string;
    contacto?: string;
    descripcion?: string;
    imagen?: string;
    galeria?: string[];
}

export interface PaisesData {
    titulo: string;
    descripcion: string;
    paises_lista: PaisData[];
}

export interface EjeFormacion {
    id: string;
    titulo: string;
    descripcion: string;
}

export interface NivelFormacion {
    id: string | number;
    titulo: string;
    descripcion: string;
    duracion: string;
    requisitos: string;
    icono: string;
    imagen?: string;
    enlace?: string;
}

export interface FormacionData {
    titulo: string;
    descripcion: string;
    ejes: EjeFormacion[];
    niveles?: NivelFormacion[];
}

export interface ArchivoAdjunto {
    id?: string | number;
    nombre: string;
    url: string;
}

export interface Articulo {
    id?: string | number;
    titulo: string;
    extracto?: string;
    contenido?: string;
    fecha?: string;
    imagen?: string;
    enlace?: string;
    url_externa?: string;
    categoria?: string;
    autor?: string;
    autores?: string;
    revista?: string;
    doi?: string;
    pdf_url?: string;
    archivos_adjuntos?: ArchivoAdjunto[];
}

export interface InvestigacionData {
    titulo: string;
    descripcion: string;
    estatutos_pdf: string;
    articulos: Articulo[];
}

export interface ActividadItem {
    id: string | number;
    titulo: string;
    categoria: string;
    descripcion: string;
    fecha: string;
    pais: string;
    impacto: string;
    imagen: string;
    estado?: string;
    url_registro?: string;
    archivos_adjuntos?: ArchivoAdjunto[];
}

export interface ActividadesData {
    titulo: string;
    descripcion: string;
    items: ActividadItem[];
}

export interface GaleriaImagen {
    id?: number | string;
    url: string;
    titulo?: string;
    descripcion?: string;
    categoria?: string;
    alt?: string;
    tipo?: string;
}

export interface GaleriaData {
    titulo?: string;
    imagenes?: GaleriaImagen[];
    [key: string]: any; // Backward compatible if directly parsed
}

export interface NoticiasData {
    titulo: string;
    descripcion: string;
    articulos: Articulo[];
}

export interface AfiliacionData {
    titulo: string;
    subtitulo?: string;
    texto_principal?: string;
    descripcion: string;
    mensaje_expansion: string;
    beneficios: string[];
    email_contacto: string;
}

export interface ContactoData {
    titulo: string;
    descripcion: string;
    email: string;
    telefono: string;
    redes_sociales: { facebook: string; instagram: string; linkedin: string };
}

export interface ColaboradorLogo {
    nombre: string;
    url: string;
}

export interface ColaboradoresData {
    titulo: string;
    logos: ColaboradorLogo[];
}

export interface FooterData {
    descripcion: string;
    enlaces_rapidos: { titulo: string; url: string }[];
    recursos: { titulo: string; url: string }[];
    copyright_text: string;
    redes_sociales?: { facebook: string; instagram: string; linkedin: string };
}

export interface DataContextState {
    hero: HeroData;
    quienes_somos: QuienesSomosData;
    historia: HistoriaData;
    organizacion: OrganizacionData;
    paises: PaisesData;
    actividades: ActividadesData;
    formacion: FormacionData;
    investigacion: InvestigacionData;
    galeria: GaleriaData;
    noticias: NoticiasData;
    afiliacion: AfiliacionData;
    contacto: ContactoData;
    colaboradores: ColaboradoresData;
    footer: FooterData;
    [key: string]: any; // Fallback
}
