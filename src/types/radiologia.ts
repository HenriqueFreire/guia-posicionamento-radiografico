export type RegiaoAnatomica = 
  | 'MMSS' 
  | 'MMII' 
  | 'Cintura & Tórax' 
  | 'Bacia & Pelve';

export type TipoIncidencia = 'Rotina' | 'Especial / Trauma';

export interface IncidenciaRadiografica {
  id: string;
  nome: string;
  regiao: RegiaoAnatomica;
  subregiao: string; // Ex: "Mão", "Polegar", "Punho", "Cotovelo", "Ombro", "Clavícula", "Joelho", "Fêmur", "Pelve", "Quadril"
  tipo: TipoIncidencia;
  
  // Parâmetros Físicos e Geométricos
  espessuraMediaCm: number;
  masBase: number;
  dffCm: number;
  tamanhoChassi: string;
  gradeRecomendada: boolean;
  
  // Posicionamento Técnico
  raioCentral: string;
  posicionamento: string;
  
  // Avaliação e Biossegurança
  criteriosBontrager: string;
  dicaPratica?: string;
  
  // Metadados
  postBlogUrl?: string;
}

export interface ParametrosCalculados {
  kv: number;
  mas: number;
  maSugerido: number;
  tempoS: number;
  usaGrade: boolean;
  formulaKv: string;
}
