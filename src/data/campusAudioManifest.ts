import type { CampusAudioCategory } from "@/app/api/campus/audio-tracks/route";

export type CampusAudioManifestEntry = {
  category: CampusAudioCategory;
  filename: string;
  segments: string[];
};

export const CAMPUS_AUDIO_MANIFEST: CampusAudioManifestEntry[] = [
  { category: "ambience", filename: "campus-ambient.wav", segments: [] },
  { category: "legacy", filename: "acredita no verde.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Ainda vai parar.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Bonconheiros do Brasil.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Cada Strain.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "cai do telhado.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Carteira e Copo.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "crime ou vida.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Drama Cinemático.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "em Cada um.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Eu Fumo cannabis.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "flores aromas.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "growers do mundo.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Hoje Não, Meu Irmão.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Juliana.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Lei de Dois Pesos.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "logica e essa.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Me Conhece.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Meu Camin.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Meus Pais.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "nao e fuga.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "o cheiro da erva hoje.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "o meu caminho.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "o velho raiz.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Oito Anos Atrás.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "os que foram tratados.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Pai vou te contar um segredo.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Pai, Eu.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Plantei o meu caminho.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Princesa da Live.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "que logica.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Quero as sementes germinando.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Revolta - Protesto.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "rua sem voz.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "sabe o nome dele….mp3", segments: ["mp3"] },
  { category: "legacy", filename: "semente pequena.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "som das massas.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Strains.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Um canto.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Verde Janela.mp3", segments: ["mp3"] },
  { category: "legacy", filename: "Vim Pra Califórnia.mp3", segments: ["mp3"] }
];
